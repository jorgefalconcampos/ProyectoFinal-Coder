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
const validateFormatInUrl = (parameter) => {
    return (req, res, next) => {
        let parameterKey, parameterValue = ""

        if (parameter === "all") {
            parameterKey = "limit";
            parameterValue = req.query.limit;   
        }
        else if (parameter === "one") {
            parameterKey = "id";
            parameterValue = req.params.pid;
        }
        
        if (parameterValue) {
            if (parameterValue % 1 !== 0) 
                return res.status(422).send({"msg": `El parámetro '${parameterKey}' no es un número entero valido`});
            else next()
        }
        else {
            // se valida que la CLAVE limit/id tenga un VALOR
            if (parameterValue === "") 
                return res.status(422).send({"msg": "El parámetro está vacío"});  
        
            // existe un queryParam, pero este no es limit/id
            if (Object.keys(req.query).length > 0) 
                res.status(422).send({"msg": `El parámetro requerido '${parameterKey}' no se encuentra presente`});
            else next()
        }
    }
}

/* middleware que valida que el formato sea:
    - title: string
    - description: string
    - code: string
    - price: number
    - status: boolean
    - stock: number
    - category: string
*/
const validateBodyForProduct = (req, res, next) => {
    const { title, description, code, price, status, stock, category } = req.body;
    if (title && typeof(title) === "string" 
        && description && typeof(description) === "string"
        && code && typeof(code) === "string"
        && price && typeof(price) === "number"
        && status && typeof(status) === "boolean"
        && stock && typeof(stock) === "number" 
        && category && typeof(category) === "string") {
            next();
        }
    else {
        res.status(422).send({"msg": "Los campos están incompletos o en un formato inválido."});
    }
}

/* método que destructura el req.body del request y crea un objeto más manejable
para los métodos 'createRecord' y 'updateRecord', esto al trabjar con productos*/
const createBodyForProduct = (reqBody) => {
    const { title, description, code, price, status, stock, category } = reqBody;
    const data = {
        "title": title,
        "description": description,
        "code": code,
        "price": price,
        "status": status,
        "stock": stock,
        "category": category
    }
    return data;
}

productsRouter.get("/", validateFormatInUrl("all"), async (req, res) => {
    const limit = req.query.limit;
    await products.getRecords("products").then((resp) => {
        limit 
            ? res.json(resp.slice(0, limit))
            : res.json(resp);
    }).catch((error) => console.log(`Error: \n${error}`));
});

productsRouter.get("/:pid", validateFormatInUrl("one"), async (req, res) => {
    const { pid } = req.params;
    await products.getRecordById(parseInt(pid)).then((resp) => {
        if (resp !== null) { res.json(resp); }
        else { res.status(404).send({"msg": `No se encontró un producto con el ID ${pid}`}); }
    }).catch((error) => console.log(`Error: \n${error}`));
});

productsRouter.post("/", validateBodyForProduct, async (req, res) => {
    const data = createBodyForProduct(req.body);
    await products.createRecord(data).then((resp) => {
        res.status(201).send({
            "msg": `Se creó el producto con el ID ${resp.id}`,
            "product_data": resp
        })
    }).catch((error) => console.log(`Error: \n${error}`));
});

productsRouter.put("/", async(req, res) => { res.status(404).send({"msg": "Agrega un ID"}); });

productsRouter.put("/:pid", [validateFormatInUrl("one"), validateBodyForProduct], async (req, res) => {
    const { pid } = req.params;
    const data = createBodyForProduct(req.body);
    await products.updateRecord(pid, data).then((resp) => {
        if (resp !== false) {
            res.status(200).send({
                "msg": `Se actualizó el producto con el ID ${resp[1].id}`,
                "old_product_data": resp[0],
                "product_data": resp[1]
            });
        }
        else {
            res.status(404).send({"msg": `No se encontró un producto con el ID ${pid}`});
        }
    }).catch((error) => console.log(`Error: \n${error}`));
});

module.exports = {
    productsRouter
}