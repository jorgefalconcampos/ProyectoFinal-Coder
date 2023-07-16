const cartsManager = require("../manager/dao/mongo_cart_manager");

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

    getCartById = async (req, res) => {
        const { cid } = req.params;
        await cartsManager.getCartById(cid).then((resp) => {
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
        await cartsManager.addCart(data).then((resp) => {
            res.status(201).send({
                "msg:": `Se creó el carrito con el ID ${resp.id}`
            });
        }).catch((error) => console.log(`Error: \n${error}`));
    }







    updateCartById = async(req, res) => {
        const { cid } = req.params;
        let hasItems = false;
        const cart = await cartsManager.getCartById(cid);
        if (cart !== null) { 
            cart.products?.length > 0 ? hasItems = true : "";
            if (hasItems) {
                await cartsManager.updateCart(cid, req.body).then((resp) => {
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
        await cartsManager.deleteAllProductsFromCart(cid);
    }


}

module.exports = CartController;