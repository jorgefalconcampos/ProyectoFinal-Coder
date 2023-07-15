const cartsManager = require("../manager/dao/mongo_cart_manager");

class CartController {

    getCartById = async (req, res) => {
        const { cid } = req.params;
        await cartsManager.getCartById(cid).then((resp) => {
            if (resp !== null) { 
    
                let hasItems = false;
                resp.products?.length > 0 ? hasItems = true : "";
    
                const productsInCart = resp.products.map(({ _id, product: { __v, ...restProduct }, ...rest }) => ({
                    ...rest,
                    product: {
                        _id: restProduct._id,
                        ...restProduct
                    }
                }));
    
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

    }

    deleteCartById = async(req, res) => {
        const { cid } = req.params;
        await cartsManager.deleteAllProductsFromCart(cid);
    }


}

module.exports = CartController;