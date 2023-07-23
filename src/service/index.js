const UserManagerMongo = require("../manager/dao/mongo/mongo_cart_manager");

const userService = new UserManagerMongo();

module.exports = {
    userService
}