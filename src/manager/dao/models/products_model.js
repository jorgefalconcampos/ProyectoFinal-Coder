const { Schema, model } = require("mongoose");

const collection = "productos";

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

const productModel = model(collection, productSchema);

module.exports = {
    productModel
}