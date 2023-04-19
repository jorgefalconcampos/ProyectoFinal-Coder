const { productModel } = require("../");

class ProductManagerMongo {
  async getAllProducts() {
    return await productModel.find().lean();
  }


  async getProductById(pid) {
    return "GET PRODUCTOS";
  }


  async addProduct(newProduct) {
    return await productModel.create(newProduct);
  }


  async updateProduct(pid, productToUpdate) {
    return "UPDATE PRODUCTOS";
  }

  async deleteProduct(pid) {
    return "UPDATE PRODUCTOS";
  }


}

module.exports = new ProductManagerMongo();
