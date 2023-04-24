const { Mongoose, default: mongoose } = require("mongoose");
const { productModel } = require("./models/products_model.js");

class ProductManagerMongo {
  getAllProducts = async ({page}) => {
    const resp = await productModel.paginate({}, {limit: 5, page, lean: true});
    // console.log(resp);
    return resp;
  }

  getProductById = async(pid) => {
    // const objId = new mongoose.Types.ObjectId(pid);
    // let cart = await cartsModel.findById({_id: "64421f2b09c17f3fb9f3695e"});
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
