const express = require("express");
const { productsRouter } = require("./routes/products.router")
const { cartsRouter } = require("./routes/carts.router")
const app = express();
const PORT = 8080;
const server = require("socket.io");

// configuración de handlebars
const handlebars = require("express-handlebars");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Ocurrió un error en el servidor.");
});


app.listen(PORT, (err) => {
    if (err) return console.log("Error al iniciar el servidor.");
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})