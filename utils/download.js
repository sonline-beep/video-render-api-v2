const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

async function downloadFile(url) {

    return new Promise((resolve, reject) => {

        const nome = Date.now() + "-" + path.basename(url);

        const destino = path.join(
            __dirname,
            "..",
            "downloads",
            nome
        );

        const file = fs.createWriteStream(destino);

        const protocolo = url.startsWith("https")
            ? https
            : http;

        protocolo.get(url, response => {

            response.pipe(file);

            file.on("finish", () => {
                file.close(() => {
                    resolve(destino);
                });
            });

        }).on("error", err => {

            fs.unlink(destino, () => {});

            reject(err);

        });

    });

}

module.exports = {
    downloadFile
};
