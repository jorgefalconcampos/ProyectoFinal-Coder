const express = require("express");
const sessionRouter = express.Router();
const { userModel } = require('../manager/dao/models/users_model');
const { auth } = require("../utils/middleware/get_username_middleware");
const { createHash } = require("../utils/helpers/hasher");
const { checkValidPassword } = require("../utils/helpers/pwd_validator");
const passport = require("passport");
const { generateToken } = require("../utils/helpers/jsonwebtoken");

const users = [];

sessionRouter.get("/", (req, res) => {
    res.render("login", {});
});


sessionRouter.post("/", async (req, res) => {

    if (!req.user) return res.status(400).send({
        status: "error", message: "Usuario y/o contraseña inválidos"
    })

    // const { username, password } = req.body;

    // if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
    //     req.session.user = {
    //         username: "admin coderhouse",
    //         email: username,
    //         role: "admin"
    //     }  
    // }
    // else {

    //     const user = await userModel.findOne({username});

        req.session.user = {
            username: req.user.username,
            email: req.user.email,
            role: "usuario"
        }

    //     if (!user) {
    //         return res.send({
    //             status: "error",
    //             message: "Usuario y/o contraseña incorrectos"
    //         })
    //     }

    //     const isValidPassword = checkValidPassword({
    //         password,
    //         hashedPassword: user.password
    //     });

    //     console.log(isValidPassword);


    //     if (!isValidPassword) {
    //         return res.send({
    //             status: "error",
    //             message: "Usuario y/o contraseña incorrectos"
    //         })
    //     }
    // }



// te quedaste en 4:01:13

// https://coderhouse.zoom.us/rec/play/azBYte4QGVBbggAtZX9m9XiT3W4nvaMeJKW8l89JzEX49Oks4YMF_W6kYT69qgT_DL2-Fxs3NQin1u3-.F_HUQxb_eKdIJNBD?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fcoderhouse.zoom.us%2Frec%2Fshare%2FiCR7hkDcstM1wn9eaE2VRss9gl7oaK3shM89TqhzUXQuVE7R6FWQsWVkAo1DvStz.ShIgCu7ngEzSvw5X

    res.send({
        status: "success",
        payload: req.user,
        message: "Login correcto"
    });
});

sessionRouter.get("/register", (req, res) => {
    res.render("register", {});
});

sessionRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = users.find((user) => user.email === email);
    if (userExists) return res.status(400).send({
        status: "error",
        message: "El usuario ya existe"
    })

    const newUser = {
        name, email, password
    }

    users.push()

    const accessToken = generateToken(newUser);

    res.status(201).send({
        status: "success",
        message: "Usuario creado",
        accessToken
    });
});


sessionRouter.get("/github", passport.authenticate("github"));

sessionRouter.get(
    "/githubcallback", 
    passport.authenticate("github", { failureRedirect: "/session/failregister"}),
    (req, res) => {
        req.session.user = req.user
        res.redirect("/api/products")
    }
);

sessionRouter.get("/failregister", (req, res) => {

    res.send({
        status: "error",
        message: "Error al crear usuario"
    })
});

sessionRouter.get("/recover", (req, res) => {
    res.render("recover_password", {});
})

sessionRouter.post("/recover", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({email});

    if (!user) return res.status(401).send({
        status: "error", 
        message: "No existe un usuario ligado a este email"
    });

    user.password = createHash(password);
    await user.save();

    res.status(200).send({
        status: "success",
        message: "Contraseña actualizada"
    })






});


sessionRouter.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({status: "Logout error", message: err})
        res.render("logout", {});
    });
});

module.exports = {
    sessionRouter
}