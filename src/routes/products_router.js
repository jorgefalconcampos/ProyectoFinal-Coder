const path = require("path");
const express = require("express");
const productsRouter = express.Router();

// const { Manager } = require("../manager/dao/fs_manager.js")
// const dirPath = path.join(__dirname, "../manager/files/products.json");
// const products = new Manager(dirPath);
const productsManager = require("../manager/dao/mongo_product_manager.js");

const { validateFormatInUrl, validateBodyForProduct, createBodyForProduct } = require("../utils/middleware/validations.js")


productsRouter.get("/", validateFormatInUrl("all"), async (req, res) => {
    const limit = req.query.limit;
    // await products.getRecords("products").then((resp) => {
    await productsManager.getAllProducts().then((resp) => {
        limit 
            ? res.json(resp.slice(0, limit))
            : res.json(resp);
    }).catch((error) => console.log(`Error: \n${error}`));
});

productsRouter.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    await productsManager.getProductById(pid).then((resp) => {
        if (resp !== null) { res.json(resp); }
        else { res.status(404).send({"msg": `No se encontró un producto con el ID ${pid}`}); }
    }).catch((error) => console.log(`Error: \n${error}`));
});

productsRouter.post("/", validateBodyForProduct, async (req, res) => {
    const data = createBodyForProduct(req.body);
    await productsManager.addProduct(data).then((resp) => {
        res.status(201).send({
            "msg": `Se creó el producto con el ID ${resp.id}`,
        })
    }).catch((error) => console.log(`Error: \n${error}`));
});

productsRouter.put("/", async(req, res) => { res.status(404).send({"msg": "Agrega un ID"}); });

productsRouter.put("/:pid", validateBodyForProduct, async (req, res) => {
    const { pid } = req.params;
    const data = createBodyForProduct(req.body);
    await productsManager.updateProduct(pid, data).then((resp) => {
        if (resp !== false) {
            res.status(200).send({ 
                "msg": `Se actualizó el producto con el ID ${pid}`,
            });
        }
        else {
            res.status(404).send({"msg": `No se encontró un producto con el ID ${pid}`});
        }
    }).catch((error) => console.log(`Error: \n${error}`));
});

productsRouter.delete("/", async(req, res) => { res.status(404).send({"msg": "Agrega un ID"}); });

productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    // await products.deleteRecord(pid).then((resp) => {
    await productsManager.deleteProduct(pid).then((resp) => {
        if (resp !== false) {
            res.status(200).send({
                "msg": `Se eliminó el producto con el ID ${pid}`,
                "product_data": resp
            });
        }
    });
});

module.exports = {
    productsRouter
}