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
