const { cartModel } = require("./models/carts_model.js");

class CartManagerMongo {

  async getCartById(cid) {
    return await cartModel.findOne({_id: cid}).lean();
  }

  async addCart(newCart) {
    return await cartModel.create(newCart);
  }

  async updateCart(cid, CartToUpdate) {

    console.log(cid);
    console.log("\n\n\n");

    return await cartModel.updateOne({_id: cid}, {$set: {
      products: CartToUpdate.products
    }})
  }

  // eliminar el carrito junto con todos sus productos
  async deleteCart(cid) {
    return await cartModel.deleteOne({_id: cid})
  }

  // async updateProductFromCart(cid, pid) {
  //   return await cartModel.findById(pid);
  // }

  // vaciar carrito, eliminar solo sus productos pero mantener el carrito
  async deleteAllProductsFromCart(cid) {
    const resp = await cartModel.findOne(cid);
    console.log(resp);
  }

  // borra solo un producto del carrito
  async deleteProductFromCart(cid, pid) {
    return await cartModel.findById(pid);
  }


}

module.exports = new CartManagerMongo();
