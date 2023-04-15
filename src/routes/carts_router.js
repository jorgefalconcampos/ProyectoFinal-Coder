const path = require("path");
const express = require("express");
const cartsRouter = express.Router();

const { Manager } = require("../manager/fs_manager.js");
const { validateFormatInUrl } = require("../utils/middleware/validations.js");

const dirPath = path.join(__dirname, "../manager/files/carts.json");
const carts = new Manager(dirPath);

cartsRouter.get("/", async(req, res) => { res.status(404).send({"msg": "Agrega un ID"}); });

cartsRouter.get("/:cid", validateFormatInUrl("one"), async (req, res) => {
    const { cid } = req.params;
    await carts.getRecordById(cid).then((resp) => {
        if (resp !== null) { res.json(resp); }
        else { res.status(404).send({"msg": `No se encontró un carrito con el ID ${cid}`}); }
    }).catch((error) => console.log(`Error: \n${error}`));
});


cartsRouter.post("/", async (req, res) => {
    const data = ({products: []});
    await carts.createRecord(data).then((resp) => {
        res.status(201).send({
            "msg:": `Se creó el carrito con el ID ${resp.id}`
        });
    }).catch((error) => console.log(`Error: \n${error}`));
});

const validateCart = (req, res, next) => {
    carts.getRecords().then((get_resp) => {
        if (get_resp.length === 0) {
            let data = { products: [], id: 1 }
            carts.createRecord(data).then((create_resp) => {
                if (create_resp.id) { next(); }
            });
        }
        else { next(); }
    });
}

cartsRouter.post("/:cid/product/:pid", validateCart, async (req, res) => {
    const { cid, pid } = req.params;

    await carts.updateRecordInRecord(cid, pid).then((resp) => {
        if (resp !== false) {
            res.status(200).send(resp);
        }
        else if (resp === false) 
        { res.status(404).send({"msg": `No se encontró un carrito con el ID ${cid}`}); }
    }).catch((error) => console.log(`Error: \n${error}`));
});

module.exports = {
    cartsRouter
}