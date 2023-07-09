const express = require("express");

const app = express();
const { Server } = require("socket.io");
const routerApp = require("./routes/index.js")
const multer = require("multer");
const upload = multer();
const { objConfig } = require("./config/config");
const PORT = objConfig.port;

const chatManager = require("./manager/dao/mongo_chat_manager.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

// configuración de handlebars
const handlebars = require("express-handlebars");
const helpers = require("./utils/helpers/handlebars_helpers");

const { initializePassportAuth } = require("./config/passport_config_auth.js");
const { initializePassport } = require("./passport-jwt/passport_config.js");

const passport = require("passport");
const cookieParser = require("cookie-parser");
const { processFunction } = require("./utils/process.js");
const { initSocket } = require("./socket_file.js");
const { getUserInfo } = require("./utils/middleware/get_user_info.js");
const handlebars_helpers = require("./utils/helpers/handlebars_helpers.js");


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


initializePassportAuth();
initializePassport(); //jwt
app.use(passport.initialize());
app.use(passport.session());



app.engine('handlebars', handlebars.engine({defaultLayout: "home", helpers: helpers}))
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

// te quedaste en el minuto 3:09 de la clase 14
// https://coderhouse.zoom.us/rec/play/FGts6LmjiZhq1nhhQuACkJAllXbX6iT0JsW1mx7kFiR_7EZXzZViLz2QoyuRzNLCK70FrSSeEna9dvb6.GVuom1Ok4auP9gWo?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fcoderhouse.zoom.us%2Frec%2Fshare%2F3XPglmpR8WtJSmzUZ-Bsx4XCQKMpoeSl2RXYPmfa_o4S-2hCnWyC-IknL0O1VUej.gS-8uv-TZ2R06ij0





const httpServer = app.listen(PORT, (err) => {
    if (err) return console.log("Error al iniciar el servidor.");
    console.log(`Servidor corriendo en el puerto ${PORT} - http://localhost:${PORT}`);
})



const io = new Server(httpServer);

initSocket(io);


// te quedaste en 1:02:55
// https://coderhouse.zoom.us/rec/play/FGts6LmjiZhq1nhhQuACkJAllXbX6iT0JsW1mx7kFiR_7EZXzZViLz2QoyuRzNLCK70FrSSeEna9dvb6.GVuom1Ok4auP9gWo?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fcoderhouse.zoom.us%2Frec%2Fshare%2F3XPglmpR8WtJSmzUZ-Bsx4XCQKMpoeSl2RXYPmfa_o4S-2hCnWyC-IknL0O1VUej.gS-8uv-TZ2R06ij0





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
