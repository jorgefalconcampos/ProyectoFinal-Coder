const path = require("path");
const express = require("express");
const cartsRouter = express.Router();

const cartsManager = require("../manager/dao/mongo_cart_manager.js");

// const { Manager } = require("../manager/dao/fs_manager.js");
const { validateId } = require("../utils/middleware/validations.js")

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

// se crea el cart, los productos se envían en el body
cartsRouter.post("/", createCart);



cartsRouter.put("/:cid", updateCartById);

cartsRouter.delete("/:cid", deleteCartById);



// cartsRouter.get("/:cid/:pid",  async (req, res) => {
//     console.log("get product");
//     res.status(200).send({
//         "status": "GET ok"
//     });

// });

const validateCart = (req, res, next, cartId) => {
    // carts.getRecords().then((get_resp) => {
    //     if (get_resp.length === 0) {
    //         let data = { products: [], id: 1 }
    //         carts.createRecord(data).then((create_resp) => {
    //             if (create_resp.id) { next(); }
    //         });
    //     }
    //     else { next(); }
    // });
    req.params.internal = true;




}





cartsRouter.post("/:cid/:pid", validateCart, async (req, res) => {
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

cartsRouter.delete("/:cid/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    await cartsManager.deleteProductFromCart(cid, pid);
});

cartsRouter.put("/:cid/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    await cartsManager.updateProductFromCart(cid, pid);
});


cartsRouter.param("cid", async (req, res, next, cid) => {
    if (req.method === "PUT" || req.method === "DELETE") {
        if (!validateId(cid)) { res.status(422).send({"msg": `El parámetro '${cid}' no es un ID de carrito válido`});}
        else { next(); }
    }
    else {
        next()
        // res.status(405).send({"msg": "El método no está soportado"})
    }
});

cartsRouter.param(['cid', 'pid'], async (req, res, next, cid, pid) => {
    if (req.method !== "GET") {

        if (!validateId(cid)) {
            res.status(422).send({"msg": `El parámetro '${cid}' no es un ID de carrito válido`});
        }

        if (!validateId(pid)) { 
            res.status(422).send({"msg": `El parámetro '${pid}' no es un ID de producto válido`});
        }


    }
    else {
        next();
    }
});





module.exports = {
    cartsRouter
}