const path = require("path");
const express = require("express");
const cartsRouter = express.Router();

const { Manager } = require("../manager/manager.js");

const dirPath = path.join(__dirname, "../manager/files/carts.json");
const carts = new Manager(dirPath);

cartsRouter.get("/", async(req, res) => { res.status(404).send({"msg": "Agrega un ID"}); });

cartsRouter.get("/:cid", async (req, res) => {
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

module.exports = {
    cartsRouter
}