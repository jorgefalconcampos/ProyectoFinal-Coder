const { Schema, model } = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "users";

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    age: Number,
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    cart: {

    },
    gender: String,

});

UserSchema.plugin(mongoosePaginate);

const userModel = model(collection, UserSchema);

module.exports = {
  userModel,
};
