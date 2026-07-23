const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

async function renderVideo({
    videos,
    audio,
    music,
    output
}) {

    return new Promise((resolve, reject) => {

        if (!videos || videos.length === 0) {
            return reject(new Error("Nenhum vídeo recebido."));
        }

        let command = ffmpeg();

        videos.forEach(video => {
            command = command.input(video);
        });

        if (audio) {
            command = command.input(audio);
        }

        if (music) {
            command = command.input(music);
        }

        command
            .on("start", cmd => {
                console.log("FFmpeg iniciado:");
                console.log(cmd);
            })
            .on("progress", progress => {
                console.log("Progresso:", progress.percent || 0);
            })
            .on("end", () => {
                console.log("Renderização concluída.");
                resolve(output);
            })
            .on("error", err => {
                console.error(err);
                reject(err);
            })
            .mergeToFile(output, path.join(__dirname, "../temp"));

    });

}

module.exports = {
    renderVideo
};
