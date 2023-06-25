const express = require("express");
const passport = require("passport");
const { authPassport } = require("../passport-jwt/authPassport");
const { authorization } = require("../passport-jwt/authorization_middleware");
const pruebasRouter = express.Router();


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



module.exports = {
    pruebasRouter
}