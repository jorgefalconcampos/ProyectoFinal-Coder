const express = require("express");
const productsRouter = express.Router();

const { validateBodyForProduct, validateId } = require("../utils/middleware/validations.js")
const { requireUser } = require("../utils/middleware/get_user_info.js");
const { authToken } = require("../utils/helpers/jsonwebtoken.js");

const ProductController = require("../controllers/products_controller.js");
const passport = require("passport");
const { authPassport } = require("../passport-jwt/authPassport.js");
const { authorization } = require("../passport-jwt/authorization_middleware.js");
const { 
    getProducts, 
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
} = new ProductController();


productsRouter.get("/", authPassport("jwt"), authorization("admin"), getProducts);

productsRouter.get("/:pid", getProductById);

productsRouter.post("/", validateBodyForProduct, createProduct);

productsRouter.put("/", async(req, res) => { res.status(404).send({"msg": "Agrega un ID"}); });

productsRouter.put("/:pid", validateBodyForProduct, updateProductById);

productsRouter.delete("/", async(req, res) => { res.status(404).send({"msg": "Agrega un ID"}); });

productsRouter.delete("/:pid", deleteProductById);

productsRouter.param("pid", async (req, res, next, pid) => {
    console.log("pid " + pid);
    if (req.method !== "GET") {
        if (!validateId(pid)) { res.status(422).send({"msg": `El parámetro '${pid}' no es un ID válido`});}
        else { next(); }
    }
});

module.exports = {
    productsRouter
}