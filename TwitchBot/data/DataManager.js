const fs = require('fs');

module.exports.Read = Read;
module.exports.Write = Write;

const currentDirectory = 'bot/data/';
const fileName = 'WatchList.json';

function Read() {
    try {
        const jsonAlts = fs.readFileSync(currentDirectory + fileName);
        return JSON.parse(jsonAlts);
    } catch (err) {
        console.log(err);
        return null;
    }
}

function Write(data) {
    let jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(currentDirectory + fileName, jsonData, err => {
        if (err)
            console.log('Error writing file', err)
    });
}