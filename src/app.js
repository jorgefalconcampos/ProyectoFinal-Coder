const express = require("express");

const app = express();
const PORT = 8080;
const { Server } = require("socket.io");
const multer = require("multer");
const upload = multer();

const { objConfig } = require("./config/config");

// configuración de handlebars
const handlebars = require("express-handlebars");
app.engine('handlebars', handlebars.engine({defaultLayout: "home"}))
app.set('view engine','handlebars');
app.set('views', __dirname + '/views')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

objConfig.connectDB();

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Ocurrió un error en el servidor.");
});


const httpServer = app.listen(PORT, (err) => {
    if (err) return console.log("Error al iniciar el servidor.");
    console.log(`Servidor corriendo en el puerto ${PORT} - http://localhost:${PORT}`);
})

const socketServer = new Server(httpServer);
const products = [];
  

socketServer.on("connection", () => {
    console.info("Cliente conectado");
});

app.get("/", (req, res) => {
    res.json(products);
})

app.get("/realtimeproducts", async (req, res) => {
    socketServer.emit("nuevo-producto", products)
    res.render("realtimeproducts")
});

app.post("/realtimeproducts", upload.any(), (req, res) => {
    const product = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
    }
    products.push(product);
    socketServer.emit("nuevo-producto", products);
    res.sendStatus(200);
});
