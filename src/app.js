const express = require("express");

const app = express();
const PORT = 8080;
const { Server } = require("socket.io");
const routerApp = require("./routes/index.js")
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

const io = new Server(httpServer);
const messages = [];

// socket.on("message", objetoMensajeCliente => {
//     messages.push(objetoMensajeCliente);
//     io.emit("messageLogs", messages);
// });

io.on("connection", socket => {
    // console.log(`\nNuevo cliente conectado. ID: ${socket.id}`);    

    socket.on("authenticated", nombreUsuario => {
        console.log(`\nEl socket con ID '${socket.id}' se identificó como '${nombreUsuario}'`);
        socket.broadcast.emit("newUserConnected", nombreUsuario);
    });

    socket.on("message", objetoMensajeCliente => {
        const obj = {
            "socketId": socket.id,
            ...objetoMensajeCliente
        }
        console.log(obj);

        messages.push(objetoMensajeCliente);
        io.emit("messageLogs", messages);
    });

});





// app.get("/", (req, res) => {
//     res.json(products);
// })

// app.get("/realtimeproducts", async (req, res) => {
//     socketServer.emit("nuevo-producto", products)
//     res.render("realtimeproducts")
// });

// app.post("/realtimeproducts", upload.any(), (req, res) => {
//     const product = {
//         name: req.body.name,
//         description: req.body.description,
//         price: req.body.price,
//     }
//     products.push(product);
//     socketServer.emit("nuevo-producto", products);
//     res.sendStatus(200);
// });

app.use(routerApp);
