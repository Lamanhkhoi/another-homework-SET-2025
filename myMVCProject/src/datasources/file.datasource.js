const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname,"../../data.json");

function Read(){
    try {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(dataPath, jsonString, "utf-8");
    } catch ( error ) {
        console.error(" Lỗi khi khi ghi file: ", error );
    }
}

module.exports = {
    read,
    write,
};