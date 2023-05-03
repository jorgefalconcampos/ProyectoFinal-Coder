const express = require("express");
const sessionRouter = express.Router();
const { userModel } = require('../manager/dao/models/users_model');
const { auth } = require("../utils/middleware/get_username_middleware");


sessionRouter.get("/", (req, res) => {
    res.render("login", {});
});

sessionRouter.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {
            username: "admin coderhouse",
            email: username,
            role: "admin"
        }  
    }
    else {
        const user = await userModel.findOne({username});

        req.session.user = {
            username: user.username,
            email: user.email,
            role: "usuario"
        }

        if (!user) {
            return res.send({
                status: "error",
                message: "Usuario y/o contraseña incorrectos"
            })
        }

        if (password !== user.password) {
            return res.send({
                status: "error",
                message: "Usuario y/o contraseña incorrectos"
            })
        }
    }





    res.status(201).redirect("/api/products");
    // res.send({
    //     status: "success",
    //     payload: req.session.user,
    //     message: "Login correcto"
    // });
});

sessionRouter.get("/register", (req, res) => {
    res.render("register", {});
});

sessionRouter.post("/register", async (req, res) => {
    const  {username, first_name, last_name, email, password } = req.body;
    const exists = await userModel.findOne({email});

    if (exists) return res.send({
        status: "error", 
        message: "Ya existe el usuario"
    });

    const newUser = {
        username,
        first_name, 
        last_name, 
        email,
        password
    }

    await userModel.create(newUser);

    res.status(201).redirect("/");

    // res.send(201).send({
    //     status: "success",
    //     message: "Usuario creado"
    // })
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