const commander = require("commander");

const program = new commander.Command();

program
    .option("-p, --port <port>", "Puerto para el servidor", 8080)
    .option("-d", "Variable de debug", false)
    .option("--mode <mode>", "Modo de trabajo", "production")
    .requiredOption("-u <user>", "Usuario utilizando app", "No se ha pasado el user")
    .option("-l, --letters [letters ...]", "Specify the letter")



program.parse();

console.log("Options: ", program.opts());
console.log("Remaining arguments: ", program.args);

// te quedaste en clase 13, minuo 3:14   