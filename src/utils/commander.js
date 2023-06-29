const { Command } = require("commander");

const commander = new Command();

commander
    // .option("-p, --port <port>", "Puerto para el servidor", 8080)
    // .option("-d", "Variable de debug", false)
    .option("--mode <mode>", "Modo de ejecución de la app", "production")
    // .requiredOption("-u <user>", "Usuario utilizando app", "No se ha pasado el user")
    // .option("-l, --letters [letters ...]", "Specify the letter")
.parse();

// console.log("Options: ", program.opts());
// console.log("Remaining arguments: ", program.args);

module.exports = {
    commander
}