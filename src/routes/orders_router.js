const express = require("express");
const ordersRouter = express.Router();

const OrderController = require("../controllers/orders_controller");

const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderById,
    deleteOrderById

} = new OrderController();


ordersRouter.get("/:oid");

ordersRouter.post("/");

ordersRouter.put("/");



module.exports = {
    ordersRouter
}