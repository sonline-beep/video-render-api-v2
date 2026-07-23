const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

// Teste da API
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "API funcionando!"
    });
});

// Endpoint de renderização
app.post("/render", async (req, res) => {

    const {
        audio,
        music,
        videos
    } = req.body;

    console.log("========== NOVA REQUISIÇÃO ==========");
    console.log("Áudio:", audio);
    console.log("Música:", music);
    console.log("Vídeos:", videos);

    res.json({
        status: "ok",
        message: "Render iniciado!",
        audio,
        music,
        videos,
        quantidadeVideos: Array.isArray(videos) ? videos.length : 0
    });

});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
