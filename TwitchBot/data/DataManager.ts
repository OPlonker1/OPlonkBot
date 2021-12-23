import fs from 'fs';

const currentDirectory = 'TwitchBot/data/';
const fileName = 'WatchList.json';

export function Read() {
    try {
        const jsonAlts = fs.readFileSync(
            currentDirectory + fileName,
            {
                encoding: 'utf-8',
                flag: undefined
            });
        return JSON.parse(jsonAlts);
    } catch (err) {
        console.log(err);
        return null;
    }
}

export function Write(data) {
    let jsonData = JSON.stringify(data, null, 4);
    try {
        fs.writeFileSync(
            currentDirectory + fileName, 
            jsonData,
            'utf-8'
        );
    } catch (err) {
        console.error("Error writing file ", err)
    }
}

export default {
    Read,
    Write
}