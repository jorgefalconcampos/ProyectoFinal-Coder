const express = require("express");
const sessionRouter = express.Router();
const { userModel } = require('../manager/dao/models/users_model');
const { auth } = require("../utils/middleware/get_username_middleware");
const { createHash } = require("../utils/helpers/hasher");
const { checkValidPassword } = require("../utils/helpers/pwd_validator");
const passport = require("passport");
const { generateToken, authToken } = require("../utils/helpers/jsonwebtoken");

const users = [];

sessionRouter.get("/", (req, res) => {
    res.render("login", {});
});


sessionRouter.post("/", async (req, res) => {

    const { email, password} = req.body;
    const user = users.find((user) => user.email === email && user.password === password);

    if (!user) return res.status(400).send({
        status: "error",
        message: "Usuario y/o contraseña incorrectos"
    });

    const accessToken = generateToken(user);
    console.log(accessToken);


    if (!req.user) return res.status(400).send({
        status: "error", message: "Usuario y/o contraseña inválidos"
    })


        req.session.user = {
            username: req.user.username,
            email: req.user.email,
            role: "usuario"
        }

  

    res.send({
        status: "success",
        payload: req.user,
        message: "Login correcto"
    });
});

sessionRouter.get("/current", authToken, (req, res) => {
    res.send({
        status: "success",
        payload: req.user
    })
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