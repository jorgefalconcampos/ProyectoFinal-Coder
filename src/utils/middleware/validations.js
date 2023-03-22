
/* middleware que valida lo siguiente:
    - que exista el queryParam limit/id
    - que NO exista un queryParam que NO sea limit/id
    - que el queryParam limit/id tenga un valor
    - que el queryParam limit/id tenga un valor numérico válido
*/
const validateFormatInUrl = (parameter) => {
    return (req, res, next) => {

        let parameterKey, parameterValue = ""

        if (parameter === "all") {
            parameterKey = "limit";
            parameterValue = req.query.limit;   
        }
        else if (parameter === "one") {
            parameterKey = "id";
            parameterValue = req.params.pid || req.params.cid;
        }
        
        if (parameterValue) {
            if (parameterValue % 1 !== 0) 
                return res.status(422).send({"msg": `El parámetro '${parameterKey}' no es un número entero valido`});
            else next()
        }
        else {
            console.log("llega aki");

            // se valida que la CLAVE limit/id tenga un VALOR
            if (parameterValue === "") 
                return res.status(422).send({"msg": "El parámetro está vacío"});  
        
            // existe un queryParam, pero este no es limit/id
            if (Object.keys(req.query).length > 0) 
                res.status(422).send({"msg": `El parámetro requerido '${parameterKey}' no se encuentra presente`});
            else next()
        }
    }
}


/* middleware que valida que el formato sea:
//     - title: string
//     - description: string
//     - code: string
//     - price: number
//     - status: boolean
//     - stock: number
//     - category: string
// */
const validateBodyForProduct = (req, res, next) => {
    const { title, description, code, price, status, stock, category } = req.body;
    if (title && typeof(title) === "string" 
        && description && typeof(description) === "string"
        && code && typeof(code) === "string"
        && price && typeof(price) === "number"
        && status && typeof(status) === "boolean"
        && stock && typeof(stock) === "number" 
        && category && typeof(category) === "string") {
            next();
        }
    else {
        res.status(422).send({"msg": "Los campos están incompletos o en un formato inválido."});
    }
}


/* método que destructura el req.body del request y crea un objeto más manejable
para los métodos 'createRecord' y 'updateRecord', esto al trabjar con productos*/
const createBodyForProduct = (reqBody) => {
    const { title, description, code, price, status, stock, category } = reqBody;
    const data = {
        "title": title,
        "description": description,
        "code": code,
        "price": price,
        "status": status,
        "stock": stock,
        "category": category
    }
    return data;
}



module.exports = {
    validateFormatInUrl,
    validateBodyForProduct,
    createBodyForProduct

}
