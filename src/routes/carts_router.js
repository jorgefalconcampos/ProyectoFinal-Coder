const express = require("express");
const cartsRouter = express.Router();

const { validateId } = require("../utils/middleware/validations.js")
const CartController = require("../controllers/carts_controller.js");

const {
    getCartById,
    createCart,
    updateCartById,
    deleteCartById
} = new CartController();


cartsRouter.get("/:cid", getCartById);

cartsRouter.post("/", createCart);

cartsRouter.put("/:cid", updateCartById);

cartsRouter.delete("/:cid", deleteCartById);

cartsRouter.param("cid", async (req, res, next, cid) => {
    if (!validateId(cid)) { res.status(422).send({"msg": `El parámetro '${cid}' no es un ID de carrito válido`});}
    else { next(); }
    // if (req.method === "PUT" || req.method === "DELETE") {
    //     if (!validateId(cid)) { res.status(422).send({"msg": `El parámetro '${cid}' no es un ID de carrito válido`});}
    //     else { next(); }
    // }
    // else {
    //     next()
    //     // res.status(405).send({"msg": "El método no está soportado"})
    // }
});


// cartsRouter.post("/:cid/:pid", validateCart, async (req, res) => {
//     const { cid, pid } = req.params;
//     await carts.updateRecordInRecord(cid, pid).then((resp) => {
//         if (resp !== false) {
//             res.status(200).send(resp);
//         }
//         else if (resp === false) 
//         { res.status(404).send({"msg": `No se encontró un carrito con el ID ${cid}`}); }
//     }).catch((error) => console.log(`Error: \n${error}`));
// });

// cartsRouter.delete("/:cid/:pid", async (req, res) => {
//     const { cid, pid } = req.params;
//     await cartsManager.deleteProductFromCart(cid, pid);
// });

// cartsRouter.put("/:cid/:pid", async (req, res) => {
//     const { cid, pid } = req.params;
//     await cartsManager.updateProductFromCart(cid, pid);
// });

// const validateCart = (req, res, next, cartId) => {
//     carts.getRecords().then((get_resp) => {
//         if (get_resp.length === 0) {
//             let data = { products: [], id: 1 }
//             carts.createRecord(data).then((create_resp) => {
//                 if (create_resp.id) { next(); }
//             });
//         }
//         else { next(); }
//     });
// }

module.exports = {
    cartsRouter
}