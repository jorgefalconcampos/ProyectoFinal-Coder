const { Router } = require("express");
const { productsRouter } = require("./products_router");
const { cartsRouter } = require("./carts_router");
// const { realTimeProductsRouter } = require("./routes/real_time_products")

const router = Router();

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// app.use("/realtimeproducts", realTimeProductsRouter);

module.exports = router;