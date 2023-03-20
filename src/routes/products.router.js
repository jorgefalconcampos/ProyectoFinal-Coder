const path = require("path");
const express = require("express");
const productsRouter = express.Router();

const { Manager } = require("../manager/manager.js")

const dirPath = path.join(__dirname, "../manager/files/products.json");
const products = new Manager(dirPath);


/* middleware que valida lo siguiente:
    - que exista el queryParam limit/id
    - que NO exista un queryParam que NO sea limit/id
    - que el queryParam limit/id tenga un valor
    - que el queryParam limit/id tenga un valor numérico válido
*/
const validateFormat = (parameter) => {
    return (req, res, next) => {
        let parameterKey, parameterValue = ""

        if (parameter === "getAll") {
            parameterKey = "limit";
            parameterValue = req.query.limit;   
        }
        else if (parameter === "getOne") {
            parameterKey = "id";
            parameterValue = req.params.pid;
        }
        
        if (parameterValue) {
            if (parameterValue % 1 !== 0) 
                return res.status(400).send({"msg": `El parámetro '${parameterKey}' no es un número entero valido`});
            else next()
        }
        else {
            // se valida que la CLAVE limit/id tenga un VALOR
            if (parameterValue === "") 
                return res.status(400).send({"msg": "El parámetro está vacío"});  
        
            // existe un queryParam, pero este no es limit/id
            if (Object.keys(req.query).length > 0) 
                res.status(400).send({"msg": `El parámetro requerido '${parameterKey}' no se encuentra presente`});
            else next()
        }
    }
}

productsRouter.get("/", validateFormat("getAll"), async (req, res) => {
    const limit = req.query.limit;
    await products.getRecords("products").then((resp) => {
        limit 
            ? res.json(resp.slice(0, limit))
            : res.json(resp);
    }).catch((err) => console.log(`Error: \n${err}`));
});

productsRouter.get("/:pid", validateFormat("getOne"), async (req, res) => {
    const { pid } = req.params;
    await products.getRecordById(parseInt(pid)).then((resp) => {
        if (resp !== null) { res.json(resp); }
        else { res.status(404).send({"msg": `No se encontró un producto con el ID ${pid}`}); }
    }).catch((err) => console.log(`Error: \n${err}`));
});

module.exports = {
    productsRouter
}