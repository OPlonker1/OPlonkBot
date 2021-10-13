const fs = require('fs');

module.exports.Read = Read;
module.exports.Write = Write;

const fileName = 'NameAlts.json';

function Read() {
    try {
        const jsonAlts = fs.readFileSync(fileName);
        return JSON.parse(jsonAlts);
    } catch (err) {
        console.log(err);
        return null;
    }
}

function Write(data) {
    fs.writeFileSync(fileName, JSON.stringify(data), err => {
        if (err)
            console.log('Error writing file', err)
    });
}