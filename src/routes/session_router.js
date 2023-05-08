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


sessionRouter.post("/", passport.authenticate("login", {failureRedirect: "/failedlogin"}), async (req, res) => {
    
    if(!req.user) return res.status (400).send({status: "error", error: "Invalid credentials"})

    // console.log(req.user);
    
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        username: req.user.username,
        email:req.user.email
    }
    console.log("\n\n");

    // console.log(req.session);
    // res.send({status:"success", payload:req.user})
    res.status(201).redirect("/api/products");



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

sessionRouter.post("/register", passport.authenticate("register", {failureRedirect: "/failregister"}), async (req, res) => {
    res.status(201).send({
        status: "success",
        message: "Usuario creado"
    })
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