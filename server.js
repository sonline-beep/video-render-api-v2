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
        fileSize: 1024 * 1024 * 500 // 500 MB por arquivo
    }
});

// Rota de teste
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "API funcionando!"
    });
});

// Upload dos arquivos
app.post(
    "/render",
    upload.fields([
        {
            name: "videos",
            maxCount: 50
        },
        {
            name: "audio",
            maxCount: 1
        },
        {
            name: "music",
            maxCount: 1
        }
    ]),
    async (req, res) => {

        try {

            const videos = req.files.videos || [];
            const audio = req.files.audio || [];
            const music = req.files.music || [];

            if (videos.length === 0) {
                return res.status(400).json({
                    status: "erro",
                    message: "Nenhum vídeo enviado."
                });
            }

            res.json({
                status: "ok",
                message: "Arquivos recebidos com sucesso.",

                videos: videos.map(v => ({
                    nome: v.originalname,
                    arquivo: v.filename,
                    tamanho: v.size
                })),

                audio: audio.length
                    ? {
                        nome: audio[0].originalname,
                        arquivo: audio[0].filename,
                        tamanho: audio[0].size
                    }
                    : null,

                music: music.length
                    ? {
                        nome: music[0].originalname,
                        arquivo: music[0].filename,
                        tamanho: music[0].size
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

    }
);

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
