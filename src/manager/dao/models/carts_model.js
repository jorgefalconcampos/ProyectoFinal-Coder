const { Schema, model } = require("mongoose");

const collection = "carts";

const cartSchema = new Schema({
    cartId: {
        type: String,
        required: false
    },
    products: [{
        type: String,
        required: true
    }],
});

const cartModel = model(collection, cartSchema);

module.exports = {
    cartModel
}