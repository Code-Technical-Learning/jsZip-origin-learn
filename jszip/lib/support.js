"use strict";
// 支持的类型检查

exports.base64 = true;
exports.array = true;
exports.string = true;
exports.arraybuffer =
    typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
exports.nodebuffer = typeof Buffer !== "undefined";
// contains true if JSZip can read/generate Uint8Array, false otherwise.
exports.uint8array = typeof Uint8Array !== "undefined";

// 检查是否支持blob
if (typeof ArrayBuffer === "undefined") {
    exports.blob = false;
} else {
    let buffer = new ArrayBuffer(0);
    try {
        exports.blob =
            new Blob([buffer], {
                type: "application/zip",
            }).size === 0;
    } catch (e) {
        // 兼容其他浏览器的blob
        try {
            let Builder =
                self.BlobBuilder ||
                self.WebKitBlobBuilder ||
                self.MozBlobBuilder ||
                self.MSBlobBuilder;
            let builder = new Builder();
            builder.append(buffer);
            exports.blob = builder.getBlob("application/zip").size === 0;
        } catch (e) {
            exports.blob = false;
        }
    }
}

try {
    exports.nodestream = !!require("readable-stream").Readable;
} catch (e) {
    exports.nodestream = false;
}
