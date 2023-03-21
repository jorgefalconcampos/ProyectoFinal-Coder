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

    createRecord = async(newRecord) => {
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
        catch (error) {
            console.log(`Hubo un error al agregar el producto. \n${error}`);
        }
    }
}

module.exports = {
    Manager
}
