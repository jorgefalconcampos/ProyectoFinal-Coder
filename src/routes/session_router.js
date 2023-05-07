const express = require("express");
const sessionRouter = express.Router();
const { userModel } = require('../manager/dao/models/users_model');
const { auth } = require("../utils/middleware/get_username_middleware");
const { createHash } = require("../utils/helpers/hasher");
const { checkValidPassword } = require("../utils/helpers/pwd_validator");
const passport = require("passport");


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




    

    // res.status(201).redirect("/api/products");
    res.send({
        status: "success",
        payload: req.user,
        message: "Login correcto"
    });
});

sessionRouter.get("/register", (req, res) => {
    res.render("register", {});
});

sessionRouter.post("/register", passport.authenticate("register", {failureRedirect: "/failregister"}), async (req, res) => {






    // const  {username, first_name, last_name, email, password } = req.body;

    // const exists = await userModel.findOne({email});

    // if (exists) return res.send({
    //     status: "error", 
    //     message: "Ya existe el usuario"
    // });

    // const newUser = {
    //     username,
    //     first_name, 
    //     last_name, 
    //     email,
    //     password: createHash(password)
    // }

    // await userModel.create(newUser);

    // res.status(201).redirect("/");

    res.status(201).send({
        status: "success",
        message: "Usuario creado"
    })
});

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