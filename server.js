const express = require("express");
const path = require("path");

const { downloadFile } = require("./utils/download");
const { renderVideo } = require("./utils/ffmpeg");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "API funcionando!"
    });
});

app.post("/render", async (req, res) => {

    try {

        const {
            videos,
            audio,
            music
        } = req.body;

        if (!videos || videos.length === 0) {
            return res.status(400).json({
                status: "erro",
                message: "Nenhum vídeo recebido."
            });
        }

        console.log("Baixando vídeos...");

        const videosLocais = [];

        for (const video of videos) {
            const arquivo = await downloadFile(video);
            videosLocais.push(arquivo);
        }

        console.log("Baixando narração...");

        const audioLocal = audio
            ? await downloadFile(audio)
            : null;

        console.log("Baixando música...");

        const musicLocal = music
            ? await downloadFile(music)
            : null;

        const output = path.join(
            __dirname,
            "output",
            `video-${Date.now()}.mp4`
        );

        console.log("Renderizando vídeo...");

        await renderVideo({
            videos: videosLocais,
            audio: audioLocal,
            music: musicLocal,
            output
        });

        res.json({
            status: "ok",
            message: "Vídeo renderizado.",
            arquivo: output
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            status: "erro",
            message: err.message
        });

    }

});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
