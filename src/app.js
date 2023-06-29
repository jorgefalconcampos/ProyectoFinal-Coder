const express = require("express");

const app = express();
const { Server } = require("socket.io");
const routerApp = require("./routes/index.js")
const multer = require("multer");
const upload = multer();
const { objConfig } = require("./config/config");
const PORT = objConfig.port;

const chatManager = require("./manager/dao/mongo_chat_manager.js");

// configuración de handlebars
const handlebars = require("express-handlebars");
const { initializePassport } = require("./passport-jwt/passport_config.js");

const passport = require("passport");
const cookieParser = require("cookie-parser");
const { processFunction } = require("./utils/process.js");

initializePassport(); //jwt

app.use(passport.initialize());


app.engine('handlebars', handlebars.engine({defaultLayout: "home"}))
app.set('view engine','handlebars');
app.set('views', __dirname + '/views')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("Coder"))
// app.use(cookieParser())

processFunction();

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
        uploadChat(objetoMensajeCliente);
        messages.push(objetoMensajeCliente);
        io.emit("messageLogs", messages);
    });

});


async function uploadChat(data) {
    await chatManager.addChat(data).then((resp) => {
        console.log(`Se guardó el mensaje en la BDD con el ID ${resp.id}`);
    }).catch((error) => console.log(`Error: \n${error}`));
}



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
