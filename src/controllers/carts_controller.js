const cartsManager = require("../manager/dao/mongo/mongo_cart_manager");

class CartController {

    standarizeResponse = (resp) => {
        const products = resp.products.map(({ _id, product: { __v, ...restProduct }, ...rest }) => ({
            ...rest,
            product: {
                _id: restProduct._id,
                ...restProduct
            }
        }));
        return products;
    }


    // TO DO: agregar validación para usuarios autenticados
    getCartById = async (req, res) => {
        const { cid } = req.params;
        await cartsManager.get(cid).then((resp) => {
            if (resp !== null) { 
                let hasItems = false;
                resp.products?.length > 0 ? hasItems = true : "";
                const productsInCart = this.standarizeResponse(resp);
                res.status(200).render("cart_detail", {
                    username: req.session.user_info.username,
                    role: req.session.user_info.role,
                    hasItems: hasItems,
                    productsInCart: productsInCart,
                    productsCount: productsInCart.length,
                });
            }
            else { 
                const not_found = true; const message = `No se encontró un carrito con el ID ${cid}`;
                res.status(404).render("cart_not_found", {not_found, message});
             }
        }).catch((error) => console.log(`Error: \n${error}`));
    }

    createCart = async (req, res) => {
        const data = req.body.products ? {products: req.body.products} : {products: []};
        // await carts.createRecord(data).then((resp) => {
        await cartsManager.create(data).then((resp) => {
            res.status(201).send({
                "msg:": `Se creó el carrito con el ID ${resp.id}`
            });
        }).catch((error) => console.log(`Error: \n${error}`));
    }

    updateCartById = async(req, res) => {
        const { cid } = req.params;
        let hasItems = false;
        const cart = await cartsManager.get(cid);
        if (cart !== null) { 
            cart.products?.length > 0 ? hasItems = true : "";
            if (hasItems) {
                await cartsManager.update(cid, req.body).then((resp) => {
                    if (resp !== false && resp.matchedCount > 0 && resp.modifiedCount > 0) {
                        res.status(200).send({ 
                            "msg": `Se actualizó el carrito con el ID ${cid}`,
                        });
                    }
                });
            }
        }
        else { 
            const not_found = true; const message = `No se encontró un carrito con el ID ${cid} para actualizar`;
            res.status(404).render("cart_not_found", {not_found, message});
         }
    }

    deleteCartById = async(req, res) => {
        const { cid } = req.params;
        const exists = await this.#cartExists(cid);

        if (exists) {
            const cart = await cartsManager.delete(cid);
            if (cart.deletedCount > 0) {
                res.status(200).send({ 
                    "msg": `Se eliminó el carrito con el ID ${cid}`,
                });
            }
        }
        else {
            res.status(404).send({ 
                "msg": `No se encontró un carrito para eliminar con el ID ${cid}`
            });
        }
    }



     
    


    #cartExists = async(cid) => {
        return await cartsManager.get(cid).then((resp) => {
            if (resp !== null) { return resp; }
            else { return false; }
        }).catch((error) => console.log(`Error al validar existencia del carrito: \n${error}`));
    }


}

module.exports = CartController;