const express = require("express");

const app = express();
const PORT = 8080;
const { Server } = require("socket.io");
const routerApp = require("./routes/index.js")
const multer = require("multer");
const upload = multer();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { objConfig } = require("./config/config");
const chatManager = require("./manager/dao/mongo_chat_manager.js");

// configuración de handlebars
const handlebars = require("express-handlebars");
const { initializePassport } = require("./config/passport_config.js");
const passport = require("passport");
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

app.use(session({
    store: MongoStore.create({
        mongoUrl: objConfig.url,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 1000000000*24,
    }),
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());



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
