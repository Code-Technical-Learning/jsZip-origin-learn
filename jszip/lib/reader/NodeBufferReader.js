"use strict";
let Uint8ArrayReader = require("./Uint8ArrayReader");
let utils = require("../utils");

function NodeBufferReader(data) {
    Uint8ArrayReader.call(this, data);
}
utils.inherits(NodeBufferReader, Uint8ArrayReader);

/**
 * @see DataReader.readData
 */
NodeBufferReader.prototype.readData = function (size) {
    this.checkOffset(size);
    let result = this.data.slice(
        this.zero + this.index,
        this.zero + this.index + size
    );
    this.index += size;
    return result;
};
module.exports = NodeBufferReader;
