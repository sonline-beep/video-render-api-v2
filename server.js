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

app.post(
    "/render",
    upload.fields([
        { name: "videos", maxCount: 100 },
        { name: "audio", maxCount: 1 },
        { name: "music", maxCount: 1 }
    ]),
    async (req, res) => {

        try {

            const videos = (req.files.videos || []).map(v => v.path);

            if (!videos.length) {
                return res.status(400).json({
                    error: "Nenhum vídeo recebido."
                });
            }

            const audio = req.files.audio?.[0]?.path;
            const music = req.files.music?.[0]?.path;

            if (!audio || !music) {
                return res.status(400).json({
                    error: "Áudio ou música não enviados."
                });
            }

            const finalVideo = await renderVideo(
                videos,
                audio,
                music,
                tempDir
            );

            res.download(finalVideo, "video-final.mp4");

        } catch (err) {

            console.error(err);

            res.status(500).json({
                error: err.message
            });

        }

    }
);

app.listen(PORT, () => {
    console.log("Servidor iniciado na porta " + PORT);
});
