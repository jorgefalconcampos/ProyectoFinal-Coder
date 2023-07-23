const { Schema, model } = require("mongoose");

const collection = "messages";

const chatSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
   
});

const chatModel = model(collection, chatSchema);

module.exports = {
    chatModel
}