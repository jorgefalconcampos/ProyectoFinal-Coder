const productsManager = require("../manager/dao/mongo_product_manager.js");
const { validateFormatInUrl, validateBodyForProduct, createBodyForProduct } = require("../utils/middleware/validations.js")


class ProductController {
    getProducts = async (req, res) => {
        try {       
            const { limit=3, page=1, sort=null } = req.query;
            const query = req.query.query ? JSON.parse(req.query.query) : {};
            const options = sort ? { limit, page, sort: {price: sort}, lean: true} : {limit, page, lean:true}
    
            const {
                docs,
                hasPrevPage,
                prevPage,
                hasNextPage,
                nextPage,
                totalPages,
            } = await productsManager.getAllProducts(query, options);
    
            if(!docs) {
                return res.status(400).render("no_products_to_display");
            }
    
            res.status(200).render("products", {
                username: req.session.user_info.username,
                role: req.session.user_info.role,
                success: true,
                products: docs,
                hasPrevPage,
                prevPage,
                hasNextPage,
                nextPage,
                totalPages: Array(totalPages).fill().map((x, i) => i+1),
                page: Number(page)-1
            });
        } catch (error) {
            console.log(`Error: \n${error}`)
        }       
    }

    getProductById = async (req, res) => {
        try {
            const { pid } = req.params;
            const resp = await productsManager.getProductById(pid)
            if (resp !== null) { 
                res.status(200).render("product_detail", {
                    username: req.session.user_info.username,
                    role: req.session.user_info.role,
                    product: resp
                });
             }
            else { res.status(404).send({"msg": `No se encontró un producto con el ID ${pid}`}); }
            
        } catch (error) {
            console.log(`Error: \n${error}`);
        }
    }

    createProduct = async (req, res) => {
        const data = createBodyForProduct(req.body);
        await productsManager.addProduct(data).then((resp) => {
            res.status(201).send({
                "msg": `Se creó el producto con el ID ${resp.id}`,
            })
        }).catch((error) => console.log(`Error: \n${error}`));
    }

    updateProductById = async (req, res) => {
        const { pid } = req.params;
        const data = createBodyForProduct(req.body);
        await productsManager.updateProduct(pid, data).then((resp) => {
            if (resp !== false && resp.matchedCount > 0 && resp.modifiedCount > 0) {
                res.status(200).send({ 
                    "msg": `Se actualizó el producto con el ID ${pid}`,
                });
            }
            else {
                res.status(404).send({"msg": `No se encontró un producto con el ID ${pid}`});
            }
        }).catch((error) => {
            res.status(500).send({"error": "Ocurrió un error al procesar esta solicitud"})
            console.log(`Error: \n${error}`)
        });
    }

    deleteProductById = async (req, res) => {
        const { pid } = req.params;
        await productsManager.deleteProduct(pid).then((resp) => {
            if (resp !== false) {
                res.status(200).send({
                    "msg": `Se eliminó el producto con el ID ${pid}`,
                    "product_data": resp
                });
            }
        });
    }
}

module.exports = ProductController;