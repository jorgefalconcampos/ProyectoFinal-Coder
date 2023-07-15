const { cartModel } = require("./models/carts_model.js");

class CartManagerMongo {

  async getCartById(cid) {
    return await cartModel.findOne({_id: cid}).lean();
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

  async updateProductFromCart(cid, pid) {
    return await cartModel.findById(pid);
  }

  async deleteAllProductsFromCart(cid) {
    const resp = await cartModel.findOne(cid);
    console.log(resp);
  }

  async deleteProductFromCart(cid, pid) {
    return await cartModel.findById(pid);
  }


}

module.exports = new CartManagerMongo();
