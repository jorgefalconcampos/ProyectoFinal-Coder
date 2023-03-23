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
    
    // updateRecordInRecord = async (cid, pid) => {
    //     const cartRecords = await this.getRecords();
    //     let parsed_cid = parseInt(cid);
    //     let parsed_pid = parseInt(pid);
    //     try {
    //         cartRecords.map(cart => {
    //             if (cart.id === parsed_cid) {
    //                 const updatedProducts = cart.products.map(product => {
    //                     if (product.id === parsed_pid) {
    //                       return { ...product, quantity: product.quantity + 1 };
    //                     }
    //                     return product;
    //                   });
    //                   return { ...cart, products: updatedProducts };
    //             }

    //             return cart
    //         });


           

         

    //         // looking for the cart ID
    //         // const isId = (element) => { return element.id === parsed_cid; }
    //         // const index = records.findIndex(isId);

    //         // // console.log(`El carrito con ID ${id} está en la posición ${index}`);

    //         // if (index !== -1) {

    //         //     let productsObj = records[index].products;

    //         //     // console.log(typeof(productsObj));

    //         //     if (productsObj.length === 0) {
    //         //         productsObj.push({"product": pid, "quantity": 1})
    //         //     }
    //         //     else {
    //         //         console.log("entra aki");

    //         //         let product = productsObj.find(el => el.product === parsed_pid);

    //         //         if (product !== undefined) {
    //         //             let qtty;
    //         //             product.quantity === 0
    //         //                 ? qtty = 1
    //         //                 : qtty = product.quantity+1;

                        
    //         //             let updatedProduct = { ...product, quantity: qtty };
    //         //             // console.log(updatedProduct);


    //         //             let updatedProductsObj = { ...productsObj, ...updatedProduct };
    //         //             console.log(updatedProductsObj);

                        
    //         //             // let newData = { ...records, products: updatedProductsObj }

    //         //             // let xd = (JSON.stringify(newData))

    //         //             // console.log(JSON.parse(xd));




    //         //             // productsObj.push(updatedProduct);

    //         //             // let newRecords = { ...records, ...updatedProductsObj}
    //         //             // console.log(newRecords);
    //         //             // await this.#writeFile(newRecords);
    //         //         }
    //         //         else { 
    //         //             // console.log(`No existe un producto con el ID ${parsed_pid} dentro del carrito con el ID ${parsed_cid}`);
    //         //             return 101;
    //         //         } 
    //         //     }



               

                

    //         //     // if (products.product) {
    //         //     // }
                
    //         //     // let oldData = records[index].products;
    //         //     // let newId;
    //         //     // oldData.length === 0
    //         //     //     ? newId = 1
    //         //     //     : newId = oldData[oldData.length-1].quantity+1;
    //         //     // console.log(newId);
                
    //         //     // let newData = { ...oldData, ...updateData }
    //         //     // records.splice(index, 1, newData);
    //         //     // await this.#writeFile(records);
    //         //     // return [oldData, newData];
    //         // }

    //         // try {
    //         //     let newId;
    //         //     records.length === 0
    //         //         ? newId = 1
    //         //         : newId = records[records.length-1].id+1;
    //         //     let newObj = { ...newRecord, id: newId };
    //         //     records.push(newObj);
    //         //     await this.#writeFile(records);
    //         //     return newObj;
    //         // }


    //         // else { return false; }
    //     }
    //     catch (error) { console.log(`Ocurrió un error al actualizar la entrada. \n${error}`); }
    // }

    updateRecordInRecord = async (cid, pid) => {
        const cartRecords = await this.getRecords();
        let parsed_cid = parseInt(cid);
        let parsed_pid = parseInt(pid);
        try {
            // el index del carrito que tiene un ID igual al que enviamos en los URL params
            const cartIndex = cartRecords.findIndex(cart => cart.id === parsed_cid);

            if (cartIndex !== -1) {

                // el arreglo de products dentro de nuestro carrito
                const productsArr = cartRecords[cartIndex].products;

                let productIndex = 0;
                let product = {"product": parsed_pid, "quantity": 0};

                let updatedProduct = {};

                if (productsArr.length != 0) { 
                    // el index del producto dentro de products []             
                    productIndex = productsArr.findIndex(el => el.product === parsed_pid);
                    // el producto en sí mismo (objeto)
                    product = productsArr[productIndex];
                }

                // si no existe, la cantidad es 1, si ya existe, se suma en 1
                updatedProduct = {
                    ...product,
                    quantity: product.quantity === 0 ? 1 : product.quantity + 1
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

                console.log(updatedproductsArr);

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












            // console.log(updatedCart);

            // if (updatedCart !== undefined) {


            //     let productsInCart = updatedCart.products;

            //     console.log(productsInCart);
            

            // }
            // else { return false; }
            // console.log(updatedCart);

         

            // looking for the cart ID
            // const isId = (element) => { return element.id === parsed_cid; }
            // const index = records.findIndex(isId);

            // // console.log(`El carrito con ID ${id} está en la posición ${index}`);

            // if (index !== -1) {

            //     let productsObj = records[index].products;

            //     // console.log(typeof(productsObj));

            //     if (productsObj.length === 0) {
            //         productsObj.push({"product": pid, "quantity": 1})
            //     }
            //     else {
            //         console.log("entra aki");

            //         let product = productsObj.find(el => el.product === parsed_pid);

            //         if (product !== undefined) {
            //             let qtty;
            //             product.quantity === 0
            //                 ? qtty = 1
            //                 : qtty = product.quantity+1;

                        
            //             let updatedProduct = { ...product, quantity: qtty };
            //             // console.log(updatedProduct);


            //             let updatedProductsObj = { ...productsObj, ...updatedProduct };
            //             console.log(updatedProductsObj);

                        
            //             // let newData = { ...records, products: updatedProductsObj }

            //             // let xd = (JSON.stringify(newData))

            //             // console.log(JSON.parse(xd));




            //             // productsObj.push(updatedProduct);

            //             // let newRecords = { ...records, ...updatedProductsObj}
            //             // console.log(newRecords);
            //             // await this.#writeFile(newRecords);
            //         }
            //         else { 
            //             // console.log(`No existe un producto con el ID ${parsed_pid} dentro del carrito con el ID ${parsed_cid}`);
            //             return 101;
            //         } 
            //     }



               

                

            //     // if (products.product) {
            //     // }
                
            //     // let oldData = records[index].products;
            //     // let newId;
            //     // oldData.length === 0
            //     //     ? newId = 1
            //     //     : newId = oldData[oldData.length-1].quantity+1;
            //     // console.log(newId);
                
            //     // let newData = { ...oldData, ...updateData }
            //     // records.splice(index, 1, newData);
            //     // await this.#writeFile(records);
            //     // return [oldData, newData];
            // }

            // try {
            //     let newId;
            //     records.length === 0
            //         ? newId = 1
            //         : newId = records[records.length-1].id+1;
            //     let newObj = { ...newRecord, id: newId };
            //     records.push(newObj);
            //     await this.#writeFile(records);
            //     return newObj;
            // }


            // else { return false; }
        }
        else { return false }
        
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
