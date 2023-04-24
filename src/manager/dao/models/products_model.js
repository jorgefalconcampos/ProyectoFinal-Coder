const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")

const collection = "products";

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: [{
        type: String,
        required: false
    }],
});

productSchema.plugin(mongoosePaginate);

const productModel = model(collection, productSchema);

module.exports = {
    productModel
}