const { connect } = require("mongoose");
const { commander } = require("../utils/commander");
const { mode } = commander.opts();

require("dotenv").config({
    path: mode === "development" ? "./.env.development" : "./.env.production"
});

const url = "mongodb+srv://jorgexd1999:ILcVLrZ4l012WgqY@cluster0.z2wcq6e.mongodb.net/ecommerce?retryWrites=true&w=majority"

const objConfig = {
    port: process.env.PORT || 8000,
    mongoURL: process.env.MONGO_URL || "",
    adminName: process.env.ADMIN_NAME || "",
    adminPassword: process.env.ADMIN_PWD || "",
    jwtSigned: process.env.SECRET || "",


    connectDB: async ()=>{
        try {
            await connect(url)
            console.log("Conectado a la base de datos");
        } catch (err) {
            console.log(err)
        }
    },
    url: "mongodb+srv://jorgexd1999:ILcVLrZ4l012WgqY@cluster0.z2wcq6e.mongodb.net/ecommerce?retryWrites=true&w=majority"
}

const githubConfig = {
    clientID: process.env.CLIENT_ID || "",
    clientSecret: process.env.CLIENT_SECRET || "",
    callbackURL: process.env.CALLBACK_URL || "",
}

module.exports = {
    objConfig,
    githubConfig
}
