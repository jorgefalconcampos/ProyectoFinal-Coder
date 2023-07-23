const { objConfig } = require("../../config/config");

let ProductsDaos;
let UsersDaos;
let CartsDaos;
let ContactsDaos;



switch (objConfig.persistence) {
    case "MONGO":
        MongoSingleton.getInstance();
        break;



        
    case "MEMORY":
        break;




    case "FILE":
        break;



    default:
        break;
}