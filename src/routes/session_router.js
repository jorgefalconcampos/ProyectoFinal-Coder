const express = require("express");
const sessionRouter = express.Router();

const userModel = require('../manager/dao/models/users_model');

sessionRouter.get("/login", (req, res) => {
    res.render("login", {});
});


sessionRouter.post("/login", async (req, res) => {
    const { username } = req.body;

    const user = await userModel.findOne({username});

    if (!user) {
        return res.send({
            status: "error",
            message: "Usuario y/o contraseña incorrectos"
        })
    }

    req.session.user = {
        username: user.username,
        email: user.email,
        admin: true
    }

    res.send({
        status: "success",
        payload: req.session.user,
        message: "Login correcto"
    });
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

    res.status(201).render("login");

    // res.send(201).send({
    //     status: "success",
    //     message: "Usuario creado"
    // })
});


sessionRouter.get("/", (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`);
    }
    else {
        req.session.counter = 1;
        res.send("Bienvenido");
    }
});


sessionRouter.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({status: "Logout error", message: err})
        res.send("Logout ok");
    });
});

module.exports = {
    sessionRouter
}