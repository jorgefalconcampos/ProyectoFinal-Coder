const express = require("express");
const realTimeProductsRouter = express.Router();


realTimeProductsRouter.get("/", async (req, res) => {
    res.render("realTimeProducts", {})
});


module.exports = {
    realTimeProductsRouter
}