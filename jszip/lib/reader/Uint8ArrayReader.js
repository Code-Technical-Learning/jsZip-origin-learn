"use strict";
let ArrayReader = require("./ArrayReader");
let utils = require("../utils");

function Uint8ArrayReader(data) {
    ArrayReader.call(this, data);
}
utils.inherits(Uint8ArrayReader, ArrayReader);
/**
 * @see DataReader.readData
 */
Uint8ArrayReader.prototype.readData = function (size) {
    this.checkOffset(size);
    if (size === 0) {
        // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
        return new Uint8Array(0);
    }
    let result = this.data.subarray(
        this.zero + this.index,
        this.zero + this.index + size
    );
    this.index += size;
    return result;
};
module.exports = Uint8ArrayReader;
