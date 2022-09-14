"use strict";

let utils = require("../utils");
let support = require("../support");
let ArrayReader = require("./ArrayReader");
let StringReader = require("./StringReader");
let NodeBufferReader = require("./NodeBufferReader");
let Uint8ArrayReader = require("./Uint8ArrayReader");

/**
 * Create a reader adapted to the data.
 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
 * @return {DataReader} the data reader.
 */
module.exports = function (data) {
    let type = utils.getTypeOf(data);
    utils.checkSupport(type);
    if (type === "string" && !support.uint8array) {
        return new StringReader(data);
    }
    if (type === "nodebuffer") {
        return new NodeBufferReader(data);
    }
    if (support.uint8array) {
        return new Uint8ArrayReader(utils.transformTo("uint8array", data));
    }
    return new ArrayReader(utils.transformTo("array", data));
};
