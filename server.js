const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();

const PORT = process.env.PORT || 8080;

// Garante que a pasta temp exista
const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const nome = file.originalname.replace(/\s+/g, "_");
        cb(null, `${timestamp}-${nome}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 500
    }
});

// Teste
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "API funcionando!"
    });
});

// Upload
app.post("/render", upload.any(), async (req, res) => {

    try {

        const videos = req.files.filter(f =>
            f.fieldname.startsWith("videos")
        );

        const audio = req.files.find(f =>
            f.fieldname === "audio"
        );

        const music = req.files.find(f =>
            f.fieldname === "music"
        );

        if (videos.length === 0) {
            return res.status(400).json({
                status: "erro",
                message: "Nenhum vídeo enviado."
            });
        }

        res.json({

            status: "ok",
            message: "Arquivos recebidos.",

            totalVideos: videos.length,

            videos: videos.map(v => ({
                campo: v.fieldname,
                nome: v.originalname,
                arquivo: v.filename,
                tamanho: v.size
            })),

            audio: audio
                ? {
                    nome: audio.originalname,
                    arquivo: audio.filename,
                    tamanho: audio.size
                }
                : null,

            music: music
                ? {
                    nome: music.originalname,
                    arquivo: music.filename,
                    tamanho: music.size
                }
                : null

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
