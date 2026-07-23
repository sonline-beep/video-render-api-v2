const { exec } = require("child_process");
const path = require("path");

async function renderVideo({ audio, music }) {

    return new Promise((resolve, reject) => {

        const output = path.join(
            __dirname,
            "..",
            "output",
            "video-final.mp4"
        );

        const comando = `ffmpeg -y \
-loop 1 \
-f lavfi -i color=c=black:s=1920x1080:d=10 \
-i "${audio}" \
-i "${music}" \
-filter_complex "[2:a]volume=0.2[music];[1:a][music]amix=inputs=2:duration=first" \
-shortest \
-c:v libx264 \
-pix_fmt yuv420p \
"${output}"`;

        exec(comando, (erro) => {

            if (erro) {
                reject(erro);
                return;
            }

            resolve(output);

        });

    });

}

module.exports = {
    renderVideo
};
