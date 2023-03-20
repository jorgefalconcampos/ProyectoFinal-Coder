const express = require("express");

const app = express();
const PORT = 8080;


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Ocurrió un error en el servidor.");
})


app.listen(PORT, (err) => {
    if (err) return console.log("Error al iniciar el servidor.");
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})