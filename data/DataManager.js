const fs = require('fs');

module.exports.Read = Read;
module.exports.Write = Write;

const fileName = 'WatchList.json';

function Read() {
    try {
        const jsonAlts = fs.readFileSync(fileName, 'utf8');
        return JSON.parse(jsonAlts);
    } catch (err) {
        console.log(err);
        return null;
    }
}

function Write(data) {
    let jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(fileName, jsonData, err => {
        if (err)
            console.log('Error writing file', err)
    });
}