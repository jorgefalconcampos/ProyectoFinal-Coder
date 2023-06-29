const express = require("express");
const passport = require("passport");
const { authPassport } = require("../passport-jwt/authPassport");
const { authorization } = require("../passport-jwt/authorization_middleware");
const router = require(".");
const pruebasRouter = express.Router();
const { fork } = require('child_process')



pruebasRouter.get('/current', authPassport('jwt'), authorization("user"), (req,res)=>{
    // pruebasRouter.get("/current", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.send(req.user)
});

// EN LUGAR DE: 
// pruebasRouter.get("/diccionario/:word", (req, res) => {
    // let { word } = req.params;
    // validar aquí que word no sea numérica, etc
// });

// te quedaste en 9:10 de la clase 13

// USAMOS ROUTER PARAM
pruebasRouter.param("word", async (req, res, next, word) => {
    let words = ['hola', 'mundo', 'javascript'];
    let searchWord = words.find(w => w === word);
    if (!searchWord) {
        req.word = null
    }
    else {
        req.word = searchWord;
    }
    next();
})

// Y AQUÍ PODEMOS ACCEDER A "WORD" ya validado
pruebasRouter.get("/diccionario/:word", (req, res) => { 
    let { word } = req

})

// ----------------------------

const operacionCompleja = (params) => {
    let result = 0;
    for (let i=0; i< 5e9; i++) {
        result += 1;
    }
    return result;
}

pruebasRouter.get("/complejablock", (req, res) => {
    const result = operacionCompleja();
    res.send(`<center><h1>Resultado</h1></center>${result}`);
});

pruebasRouter.get("/complejanoblock", (req, res) => {
    const child = fork("./src/utils/compleja.js");
    child.send("Inicia el cálculo");
    child.on("message", result => {
        res.send(`<center><h1>Resultado</h1></center>${result}`);
    })
});











module.exports = {
    pruebasRouter
}