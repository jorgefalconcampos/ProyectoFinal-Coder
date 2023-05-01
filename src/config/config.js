const { connect } = require("mongoose");


const url = "mongodb+srv://jorgexd1999:ILcVLrZ4l012WgqY@cluster0.z2wcq6e.mongodb.net/ecommerce?retryWrites=true&w=majority"

const objConfig = {
    connectDB: async ()=>{
        try {
            await connect(url)
            console.log("Conectado a la base de datos");
        } catch (err) {
            console.log(err)
        }
    },
    url: "mongodb+srv://jorgexd1999:ILcVLrZ4l012WgqY@cluster0.z2wcq6e.mongodb.net/ecommerce?retryWrites=true&w=majority"
}

module.exports = {
    objConfig
}
 