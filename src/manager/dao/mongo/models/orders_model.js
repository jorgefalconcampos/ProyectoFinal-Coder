const { Schema, model } = require("mongoose");

const collection = "orders";

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "products"
    }],
    total: Number,
    created: Date
});


const orderModel = model(collection, cartSchema);

module.exports = {
    orderModel
}