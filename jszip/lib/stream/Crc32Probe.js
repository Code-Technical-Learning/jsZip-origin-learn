"use strict";

let GenericWorker = require("./GenericWorker");
let crc32 = require("../crc32");
let utils = require("../utils");

/**
 * A worker which calculate the crc32 of the data flowing through.
 * 计算流经数据的 crc32 的 worker
 * @constructor
 */
function Crc32Probe() {
    GenericWorker.call(this, "Crc32Probe");
    this.withStreamInfo("crc32", 0);
}
utils.inherits(Crc32Probe, GenericWorker);

/**
 * @see GenericWorker.processChunk
 */
Crc32Probe.prototype.processChunk = function (chunk) {
    this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
    this.push(chunk);
};
module.exports = Crc32Probe;
