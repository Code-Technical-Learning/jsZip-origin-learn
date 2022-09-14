const JSZip = require("./jszip");
const fs = require("fs");

const zip = new JSZip();

zip.file("Hello.txt", "Hello World\n");

const img = zip.folder("images");
// img.file("smile.gif", imgData, {base64: true});

zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
  const ws = fs.createWriteStream("./unCompress/index.zip");
  ws.write(content);
});
