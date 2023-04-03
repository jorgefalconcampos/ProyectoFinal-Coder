const express = require("express");
const { productsRouter } = require("./routes/products_router")
const { cartsRouter } = require("./routes/carts_router")
const { realTimeProductsRouter } = require("./routes/real_time_products")
const app = express();
const PORT = 8080;
const server = require("socket.io");

// configuración de handlebars
const handlebars = require("express-handlebars");
app.engine('handlebars', handlebars.engine({defaultLayout: "home"}))
app.set('view engine','handlebars');
app.set('views', __dirname + '/views')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
// app.use("/realtimeproducts", realTimeProducts);


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Ocurrió un error en el servidor.");
});


app.listen(PORT, (err) => {
    if (err) return console.log("Error al iniciar el servidor.");
    console.log(`Servidor corriendo en el puerto ${PORT} - http://localhost:${PORT}`);
})