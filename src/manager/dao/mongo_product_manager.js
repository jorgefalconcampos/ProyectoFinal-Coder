const { productModel } = require("./models/products_model.js");

class ProductManagerMongo {
  getAllProducts = async ({page}) => {
    const resp = await productModel.paginate({}, {limit: 5, page, lean: true});
    console.log(resp);
    return resp;
  }

  async getProductById(pid) {
    return await productModel.findById(pid);
  }

  async addProduct(newProduct) {
    return await productModel.create(newProduct);
  }

  async updateProduct(pid, productToUpdate) {
    return await productModel.updateOne({_id: pid}, {$set: {
      title: productToUpdate.title,
      description: productToUpdate.description,
      code: productToUpdate.code,
      price: productToUpdate.price,
      status: productToUpdate.status,
      stock: productToUpdate.stock,
      thumbnails: productToUpdate.thumbnails,
      category: productToUpdate.category
    }})
  }

  async deleteProduct(pid) {
    return await productModel.deleteOne({pid})
  }


}

module.exports = new ProductManagerMongo();
