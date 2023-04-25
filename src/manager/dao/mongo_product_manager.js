const { productModel } = require("./models/products_model.js");

class ProductManagerMongo {
  getAllProducts = async (query, options) => {
    const resp = await productModel.paginate(query, options);
    console.log(resp);
    return resp;
  }

  getProductById = async(pid) => {
    const resp = await productModel.findOne({_id: pid}).lean();
    console.log(resp);
    return resp;
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
