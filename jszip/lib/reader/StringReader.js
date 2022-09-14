"use strict";
let DataReader = require("./DataReader");
let utils = require("../utils");

function StringReader(data) {
    DataReader.call(this, data);
}
utils.inherits(StringReader, DataReader);
/**
 * @see DataReader.byteAt
 */
StringReader.prototype.byteAt = function (i) {
    return this.data.charCodeAt(this.zero + i);
};
/**
 * @see DataReader.lastIndexOfSignature
 */
StringReader.prototype.lastIndexOfSignature = function (sig) {
    return this.data.lastIndexOf(sig) - this.zero;
};
/**
 * @see DataReader.readAndCheckSignature
 */
StringReader.prototype.readAndCheckSignature = function (sig) {
    let data = this.readData(4);
    return sig === data;
};
/**
 * @see DataReader.readData
 */
StringReader.prototype.readData = function (size) {
    this.checkOffset(size);
    // this will work because the constructor applied the "& 0xff" mask.
    let result = this.data.slice(
        this.zero + this.index,
        this.zero + this.index + size
    );
    this.index += size;
    return result;
};
module.exports = StringReader;
