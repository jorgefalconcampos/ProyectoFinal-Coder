const { Schema, model } = require("mongoose");

const collection = "messages";

const productSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
   
});

const productModel = model(collection, productSchema);

module.exports = {
    productModel
}