"use strict";

let GenericWorker = require("./GenericWorker");
let utils = require("../utils");

/**
 * A worker which convert chunks to a specified type.
 * @constructor
 * @param {String} destType the destination type.
 */
function ConvertWorker(destType) {
    GenericWorker.call(this, "ConvertWorker to " + destType);
    this.destType = destType;
}
utils.inherits(ConvertWorker, GenericWorker);

/**
 * 将生成的压缩包的信息转换为 buffer 或 二进制，所以 on data 中的数据为 buffer
 * @see GenericWorker.processChunk
 */
ConvertWorker.prototype.processChunk = function (chunk) {
    this.push({
        data: utils.transformTo(this.destType, chunk.data),
        meta: chunk.meta,
    });
};
module.exports = ConvertWorker;
