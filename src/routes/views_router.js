const { Router } = require('express');

const viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
    res.render("index", {});
})

module.exports = {
    viewsRouter
};