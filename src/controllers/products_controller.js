const productManager = require("../manager/dao/mongo_product_manager");


class ProductController {
    getProducts = async (req, res) => {
        try {
            const resp = await productManager.getAllProducts();
            res.send(resp);
        }
        catch (err) {
            console.log(err);
        }
        createProduct = () => {

        }
    }
}

module.exports = ProductController;