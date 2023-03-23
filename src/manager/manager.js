const fs = require("fs");

class Manager {
    constructor(path) {
        this.path = path;
    }


    #writeFile = async (data) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2))
        }
        catch (err) { console.error(`\n${err}`); }

    }


    getRecords = async () => {
        try {
            if (fs.existsSync(this.path) && (fs.readFileSync(this.path).length !== 0)) { 
                const products = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(products);
            }
            else {
                console.info("Creando...");
                return []
            }
        } catch (error) {
            if (error.message.includes('no such file or directory')) {
                console.error("\nAl parecer el archivo o directorio no existe.");
                return [];
            }
        }
    }


    getRecordById = async (id) => {
        let records = await this.getRecords();
        let parsedId = parseInt(id);
        try {
            const obj = records.find((record) => { return record.id === parsedId });
            return obj ? obj : null;
        }
        catch (error) { console.error(`\nError al obtener entrada. ${error}`); }
    }


    createRecord = async (newRecord) => {
        let records = await this.getRecords();
        try {
            let newId;
            records.length === 0
                ? newId = 1
                : newId = records[records.length-1].id+1;
            let newObj = { ...newRecord, id: newId };
            records.push(newObj);
            await this.#writeFile(records);
            return newObj;
        }
        catch (error) { console.log(`Ocurrió un error al agregar la entrada. \n${error}`); }
    }


    updateRecord = async (id, updateData) => {
        const records = await this.getRecords();
        let parsedId = parseInt(id);
        try {
            const isId = (element) => { return element.id === parsedId; }
            const index = records.findIndex(isId);
            if (index !== -1) {
                let oldData = records[index];
                let newData = { ...oldData, ...updateData }
                records.splice(index, 1, newData);
                await this.#writeFile(records);
                return [oldData, newData];
            }
            else { return false; }
        }
        catch (error) { console.log(`Ocurrió un error al actualizar la entrada. \n${error}`); }
    }


    updateMany = () => {
        return carts.map(cart => {
            if (cart.id === cartId) {
              const updatedProducts = cart.products.map(product => {
                if (product.id === productId) {
                  return { ...product, quantity: product.quantity + 1 };
                }
                return product;
              });
              return { ...cart, products: updatedProducts };
            }
            return cart;
          });
    }
    

    updateRecordInRecord = async (cid, pid) => {
        let cartRecords = await this.getRecords();
        let parsed_cid = parseInt(cid);
        let parsed_pid = parseInt(pid);
        try {
            // el index del carrito que tiene un ID igual al que enviamos en los URL params
            const cartIndex = cartRecords.findIndex(cart => cart.id === parsed_cid);
            console.log(cartIndex);

            if (cartIndex !== -1) {
                // el arreglo de products dentro de nuestro carrito
                const productsArr = cartRecords[cartIndex].products;

                let productIndex = 0;

                // let product = {};
                let product = {"product": parsed_pid, "quantity": 0};

                let updatedProduct = {};

                if (productsArr.length != 0) { 
                    // el index del producto dentro de products []             
                    productIndex = productsArr.findIndex(el => el.product === parsed_pid);
                    productIndex !== -1 
                        // el producto en sí mismo (objeto)
                        ? product = productsArr[productIndex]
                        : "" // no hacer nada, debido que ya se definió en 0
                }

                updatedProduct = {
                    ...product,
                    // quantity: product.quantity === 0 ? 1 : product.quantity + 1
                    quantity: product.quantity + 1
                }
                 

                /* creamos el objeto que contiene los productos de la sig. manera:
                    - copiamos lo que hay antes
                    - copiamos el producto actualizado
                    - copiamos lo que hay después
                */
                const updatedproductsArr = [
                    ...productsArr.slice(0, productIndex),
                    updatedProduct,
                    ...productsArr.slice(productIndex + 1)
                ];


                // actualizamos la cart
                const updatedCart = {
                    ...cartRecords[cartIndex],
                    products: updatedproductsArr
                }

                /* creamos el objeto que contiene todos los carritos de la sig. manera:
                    - copiamos lo que hay antes
                    - copiamos el carrito actualizado
                    - copiamos lo que hay después
                */
                const updatedCarts = [
                    ...cartRecords.slice(0, cartIndex),
                    updatedCart,
                    ...cartRecords.slice(cartIndex + 1)
                ]

                await this.#writeFile(updatedCarts);

                return updatedCart;
            }
            else {
                // cuando no existe el carro
                // let newCart = { "products": [], "id": cartRecords[cartRecords.length-1].id+1 }
                // cartRecords.push(newCart)
                // await this.#writeFile(cartRecords);
                return false;
            }
        }
        catch (error) { console.log(`Ocurrió un error al actualizar la entrada. \n${error}`); }
    }


    deleteRecord = async (id) => {
        const exists = await this.getRecordById(id);
        let parsedId = parseInt(id);
        if (exists) {
            let records = await this.getRecords();
            try {
                records = records.filter(record => record.id != parsedId);
                await this.#writeFile(records);
                const updatedList = await this.getRecords();
                return updatedList;
            }
            catch (error) { console.error(`\nError al eliminar entrada. ${error}`); }
        }
    }
}

module.exports = {
    Manager
}
