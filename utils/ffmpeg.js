const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

async function renderVideo(videos, audio, music, outputFolder) {

    return new Promise((resolve, reject) => {

        const listFile = path.join(outputFolder, "videos.txt");

        const txt = videos
            .map(v => `file '${v.replace(/\\/g,"/")}'`)
            .join("\n");

        fs.writeFileSync(listFile, txt);

        const joined = path.join(outputFolder, "joined.mp4");

        ffmpeg()

            .input(listFile)
            .inputOptions([
                "-f concat",
                "-safe 0"
            ])

            .outputOptions([
                "-c copy"
            ])

            .save(joined)

            .on("end", () => {

                const finalVideo = path.join(outputFolder, "video-final.mp4");

                ffmpeg()

                    .input(joined)

                    .input(audio)

                    .input(music)

                    .complexFilter([
                        "[1:a][2:a]amix=inputs=2:duration=first[a]"
                    ])

                    .outputOptions([
                        "-map 0:v",
                        "-map [a]",
                        "-shortest"
                    ])

                    .save(finalVideo)

                    .on("end", () => {

                        resolve(finalVideo);

                    })

                    .on("error", reject);

            })

            .on("error", reject);

    });

}

module.exports = renderVideo;
