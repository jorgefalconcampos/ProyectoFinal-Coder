const path = require("path");
const express = require("express");
const cartsRouter = express.Router();

const cartsManager = require("../manager/dao/mongo_cart_manager.js");

// const { Manager } = require("../manager/dao/fs_manager.js");
const { validateFormatInUrl } = require("../utils/middleware/validations.js");
const CartController = require("../controllers/carts_controller.js");

// const dirPath = path.join(__dirname, "../manager/files/carts.json");
// const carts = new Manager(dirPath);

// cartsRouter.get("/", async(req, res) => { 
//     // return res.status(400).redirect("/api/products");
// });

const {
    getCartById,
    createCart,
    updateCartById,

    deleteCartById
    
} = new CartController();

cartsRouter.get("/:cid", getCartById);


cartsRouter.post("/", createCart);

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

cartsRouter.put("/:cid", updateCartById);

cartsRouter.delete("/:cid", deleteCartById);



cartsRouter.post("/:cid/product/:pid", validateCart, async (req, res) => {
    const { cid, pid } = req.params;
    // nw
    await carts.updateRecordInRecord(cid, pid).then((resp) => {
        if (resp !== false) {
            res.status(200).send(resp);
        }
        else if (resp === false) 
        { res.status(404).send({"msg": `No se encontró un carrito con el ID ${cid}`}); }
    }).catch((error) => console.log(`Error: \n${error}`));
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    await cartsManager.deleteProductFromCart(cid, pid);
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    await cartsManager.updateProductFromCart(cid, pid);
});

module.exports = {
    cartsRouter
}