"use strict";

let compressions = require("../compressions");
let ZipFileWorker = require("./ZipFileWorker");

/**
 * 找到要使用的压缩.
 * @param {String} fileCompression the compression defined at the file level, if any.
 * @param {String} zipCompression the compression defined at the load() level.
 * @return {Object} the compression object to use.
 */
let getCompression = function (fileCompression, zipCompression) {
    let compressionName = fileCompression || zipCompression;
    let compression = compressions[compressionName];
    if (!compression) {
        throw new Error(
            compressionName + " is not a valid compression method !"
        );
    }
    return compression;
};

/**
 * Create a worker to generate a zip file.
 * 创建一个工作者去生成文件
 * @param {JSZip} zip the JSZip instance at the right root level.
 * @param {Object} options to generate the zip file.
 * @param {String} comment the comment to use.
 */
exports.generateWorker = function (zip, options, comment) {
    let zipFileWorker = new ZipFileWorker(
        options.streamFiles,
        comment,
        options.platform,
        options.encodeFileName
    );
    let entriesCount = 0;
    try {
        zip.forEach(function (relativePath, file) {
            entriesCount++;
            let compression = getCompression(
                file.options.compression,
                options.compression
            );
            let compressionOptions =
                file.options.compressionOptions ||
                options.compressionOptions ||
                {};
            let dir = file.dir,
                date = file.date;

            // 使用 zipObject 文件的 _compressWorker
            file._compressWorker(compression, compressionOptions)
                .withStreamInfo("file", {
                    name: relativePath,
                    dir: dir,
                    date: date,
                    comment: file.comment || "",
                    unixPermissions: file.unixPermissions,
                    dosPermissions: file.dosPermissions,
                })
                .pipe(zipFileWorker);
        });
        zipFileWorker.entriesCount = entriesCount;
    } catch (e) {
        zipFileWorker.error(e);
    }

    return zipFileWorker;
};
