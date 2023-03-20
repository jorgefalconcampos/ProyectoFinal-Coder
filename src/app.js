const express = require("express");
const { productsRouter } = require("./routes/products.router")
const { cartRouter } = require("./routes/carts.router")
const app = express();
const PORT = 8080;

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Ocurrió un error en el servidor.");
});


app.listen(PORT, (err) => {
    if (err) return console.log("Error al iniciar el servidor.");
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})