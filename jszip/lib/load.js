"use strict";
let utils = require("./utils");
let external = require("./external");
let utf8 = require("./utf8");
let ZipEntries = require("./zipEntries");
let Crc32Probe = require("./stream/Crc32Probe");
let nodejsUtils = require("./nodejsUtils");

/**
 * Check the CRC32 of an entry.
 * @param {ZipEntry} zipEntry the zip entry to check.
 * @return {Promise} the result.
 */
function checkEntryCRC32(zipEntry) {
    return new external.Promise(function (resolve, reject) {
        let worker = zipEntry.decompressed
            .getContentWorker()
            .pipe(new Crc32Probe());
        worker
            .on("error", function (e) {
                reject(e);
            })
            .on("end", function () {
                if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
                    reject(new Error("Corrupted zip : CRC32 mismatch"));
                } else {
                    resolve();
                }
            })
            .resume();
    });
}

module.exports = function (data, options) {
    let zip = this;
    options = utils.extend(options || {}, {
        base64: false,
        checkCRC32: false,
        optimizedBinaryString: false,
        createFolders: false,
        decodeFileName: utf8.utf8decode,
    });

    if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        return external.Promise.reject(
            new Error("JSZip can't accept a stream when loading a zip file.")
        );
    }

    return utils
        .prepareContent(
            "the loaded zip file",
            data,
            true,
            options.optimizedBinaryString,
            options.base64
        )
        .then(function (data) {
            let zipEntries = new ZipEntries(options);
            zipEntries.load(data);
            return zipEntries;
        })
        .then(function checkCRC32(zipEntries) {
            let promises = [external.Promise.resolve(zipEntries)];
            let files = zipEntries.files;
            if (options.checkCRC32) {
                for (let i = 0; i < files.length; i++) {
                    promises.push(checkEntryCRC32(files[i]));
                }
            }
            return external.Promise.all(promises);
        })
        .then(function addFiles(results) {
            let zipEntries = results.shift();
            let files = zipEntries.files;
            for (let i = 0; i < files.length; i++) {
                let input = files[i];

                let unsafeName = input.fileNameStr;
                let safeName = utils.resolve(input.fileNameStr);

                zip.file(safeName, input.decompressed, {
                    binary: true,
                    optimizedBinaryString: true,
                    date: input.date,
                    dir: input.dir,
                    comment: input.fileCommentStr.length
                        ? input.fileCommentStr
                        : null,
                    unixPermissions: input.unixPermissions,
                    dosPermissions: input.dosPermissions,
                    createFolders: options.createFolders,
                });
                if (!input.dir) {
                    zip.file(safeName).unsafeOriginalName = unsafeName;
                }
            }
            if (zipEntries.zipComment.length) {
                zip.comment = zipEntries.zipComment;
            }

            return zip;
        });
};
