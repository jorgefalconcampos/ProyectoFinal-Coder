const { Schema, model } = require("mongoose");

const collection = "carts";

const productSchema = new Schema({
    cartId: {
        type: String,
        required: true
    },
    products: [{
        type: String,
        required: true
    }],
});

const productModel = model(collection, productSchema);

module.exports = {
    productModel
}