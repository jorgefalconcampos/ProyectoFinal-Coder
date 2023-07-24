const productsManager = require("../manager/dao/mongo/mongo_product_manager");
const { createBodyForProduct } = require("../utils/middleware/validations")


class ProductController {

    #productExixts = async (pid) => {
        return await productsManager.get(pid).then((resp) => {
            if (resp != null) { return resp; }
            else { return false; }
        }).catch((error) => console.log(`Error al validar si existe del producto: \n${error}`));
    }
    
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
            } = await productsManager.getAll(query, options);
    
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
        const { pid } = req.params;
        const product = await this.#productExixts(pid);
        if (product) {
            res.status(200).render("product_detail", {
                username: req.session.user_info.username,
                role: req.session.user_info.role,
                product: product
            });
        }
        else { res.status(404).send({"msg": `No se encontró un producto con el ID ${pid}`}); }
        
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
        const product = await this.#productExixts(pid);
        if (product) {
            const data = createBodyForProduct(req.body);
            try {
                const productToUpdate = await productsManager.updateProduct(pid, data);
                if (productToUpdate.matchedCount > 0 && productToUpdate.modifiedCount > 0) {
                    res.status(200).send({ "msg": `Se actualizó el producto con el ID ${pid}`, });
                }
                else {
                    res.status(200).send({"msg": `No se actualizó el producto con el ID ${pid}`,});
                }
            }        
            catch (error) {
                res.status(500).send({"error": "Ocurrió un error al procesar esta solicitud"})
                console.log(`Error: \n${error}`)
            }
        }    
    }






    deleteProductById = async (req, res) => {
        const { pid } = req.params;
        const product = await this.#productExixts(pid);
        if (product) {
            const productToDelete = await productsManager.delete(pid);
            if (productToDelete.deletedCount > 0) {
                res.status(200).send({
                    "msg": `Se eliminó el producto con el ID ${pid}`,
                    // "product_data": resp
                });
            }
        }
        else {
            res.status(404).send({ 
                "msg": `No se encontró un producto para eliminar con el ID ${pid}`
            });
        }
    }
}

module.exports = ProductController;