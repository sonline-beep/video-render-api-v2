const express = require("express");

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

    res.json({
        status: "ok",
        message: "Render iniciado!",
        dadosRecebidos: req.body
    });

});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
