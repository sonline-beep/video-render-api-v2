const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

function renderVideo({ videos, audio, music, output }) {

    return new Promise((resolve, reject) => {

        const command = ffmpeg();

        // adiciona todos os vídeos
        videos.forEach(video => {
            command.input(video);
        });

        // adiciona narração
        command.input(audio);

        // adiciona música
        command.input(music);

        command
            .complexFilter([
                {
                    filter: "amix",
                    options: {
                        inputs: 2,
                        duration: "first"
                    },
                    inputs: ["1:a", "2:a"],
                    outputs: "mix"
                }
            ])
            .outputOptions([
                "-map 0:v",
                "-map [mix]",
                "-shortest"
            ])
            .save(output)
            .on("end", resolve)
            .on("error", reject);

    });

}

module.exports = {
    renderVideo
};
