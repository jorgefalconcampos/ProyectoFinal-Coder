const { cartModel } = require("./models/carts_model.js");

class CartManagerMongo {
  async getAllCarts() {
    return await cartModel.find().lean();
  }

  async getCartById(pid) {
    return await cartModel.findById(pid);
  }

  async addCart(newCart) {
    return await cartModel.create(newCart);
  }

  async updateCart(pid, CartToUpdate) {
    return await cartModel.updateOne({_id: pid}, {$set: {
      title: CartToUpdate.title,
      description: CartToUpdate.description,
      code: CartToUpdate.code,
      price: CartToUpdate.price,
      status: CartToUpdate.status,
      stock: CartToUpdate.stock,
      thumbnails: CartToUpdate.thumbnails,
      category: CartToUpdate.category
    }})
  }

  async deleteCart(pid) {
    return await cartModel.deleteOne({pid})
  }


}

module.exports = new CartManagerMongo();
