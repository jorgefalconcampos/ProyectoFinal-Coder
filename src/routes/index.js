const { Router } = require("express");
const { productsRouter } = require("./products_router");
const { cartsRouter } = require("./carts_router");
const { viewsRouter } = require("./views_router");
// const { realTimeProductsRouter } = require("./routes/real_time_products")

const router = Router();

router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/chat", viewsRouter);
// router.use("/realtimeproducts", realTimeProductsRouter);

module.exports = router;