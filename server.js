const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const renderVideo = require("./utils/ffmpeg");

const app = express();

const PORT = process.env.PORT || 8080;

const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 500
    }
});

app.get("/", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.post("/render", upload.any(), async (req, res) => {

    try {

        const videos = req.files
            .filter(file => file.fieldname.startsWith("videos"))
            .map(file => file.path);

        if (!videos.length) {
            return res.status(400).json({
                error: "Nenhum vídeo recebido."
            });
        }

        const audioFile = req.files.find(file => file.fieldname === "audio");
        const musicFile = req.files.find(file => file.fieldname === "music");

        if (!audioFile) {
            return res.status(400).json({
                error: "Áudio não recebido."
            });
        }

        if (!musicFile) {
            return res.status(400).json({
                error: "Música não recebida."
            });
        }

        const finalVideo = await renderVideo(
            videos,
            audioFile.path,
            musicFile.path,
            tempDir
        );

        return res.download(finalVideo, "video-final.mp4");

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message
        });

    }

});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
