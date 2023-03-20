const fs = require("fs");

class Manager {
    constructor(path) {
        this.path = path;
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

    getRecordById = async(id) => {
        let records = await this.getRecords();
        try {
            const obj = records.find((record) => { return record.id === id });
            return obj ? obj : null;
        }
        catch (error) {
            console.error(`\nError al obtener producto. ${error}`);
        }
    }
}

module.exports = {
    Manager
}
