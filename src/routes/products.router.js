const path = require("path");
const express = require("express");
const productsRouter = express.Router();

const { Manager } = require("../manager/manager.js")

const dirPath = path.join(__dirname, "../manager/files/products.json");
const products = new Manager(dirPath);


/* middleware que valida lo siguiente:
    - que exista el queryParam limit
    - que NO exista un queryParam que NO sea limit
    - que el queryParam limit tenga un valor
    - que el queryParam limit tenga un valor numérico válido
*/
const validateFormat = (req, res, next) => {
    const limit = req.query.limit;

    if (limit) {
        if (limit % 1 !== 0) 
            return res.status(400).send({"msg": "El parámetro 'limit' no es un número entero valido"});
        else next()
    }
    else {
        // se valida que la CLAVE limit tenga un VALOR
        if (limit === "") 
            return res.status(400).send({"msg": "El parámetro está vacío"});  
    
        // existe un queryParam, pero este no es limit
        if (Object.keys(req.query).length > 0) 
            res.status(400).send({"msg": `El parámetro requerido 'limit' no se encuentra presente`});
        else next()
    }
}

productsRouter.get("/", validateFormat, async (req, res) => {
    const limit = req.query.limit;

    await products.getRecords("products").then((resp) => {
        console.log(`resp: ${resp}`);
        limit 
            ? res.json(resp.slice(0, limit))
            : res.json(resp);
    }).catch((err) => console.log(`Error: \n${err}`));
})

module.exports = {
    productsRouter
}