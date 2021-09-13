require('dotenv').config();
var fs = require('fs');
const tmi = require('tmi.js');

const options = {
    options: { debug: true },

    connection: {
        reconnect: true,
        secure: true
    },

    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_PASSWORD
    },

    channels: [process.env.TARGET_CHANNEL]
};

const client = new tmi.client(options);

const CMDstart = process.env.COMMAND_START;

var Alts;

const ViewersURL = `https://tmi.twitch.tv/group/user/${process.env.TARGET_CHANNEL}/chatters`;

try {
    const jsonAlts = fs.readFileSync('NameAlts.json');
    Alts = JSON.parse(jsonAlts);
} catch (err) {
    console.log(err);
    return;
}

client.connect();

client.on('connected', ( address, port ) => {
    client.action( process.env.TARGET_CHANNEL, 'OPlonkBot has started.' );
});

client.on('join', (channel, username, self) => {
    if (self) return;

    tempNames = [];

    username.forEach(user => {
        if (IsBanned(username))
            tempNames.push(user);
    });

    if (tempNames.length > 0)
        client.say(channel, `@OPlonker1 There are ${tempNames.length} possible ban bypassers.\n ${tempNames}`);

    console.log(username);
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    if (message.startsWith(CMDstart))
        CommandHandler(channel, tags, message);
    else
        MessageHandler(channel, tags, message);
});

function CommandHandler(channel, tags, message) {
	const args = message.slice( CMDstart.length ).split(' ');
	const command = args.shift().toLowerCase();

    ModCommandHandler(channel, tags, command, args);

    if (command === 'echo') {
        client.say(channel, `@${tags.username}, you said: "${args.join(' ')}"`);
    } 
}

function ModCommandHandler(channel, tags, command, args) {
    if (tags.mod !== true) return;

    if (command === 'addban') {
        if (args.length == 0) return;

        user = args.shift().toLowerCase();
        if (IsBanned(user)) return;

        if (args.length != 0)
            reason = args.join(' ');
        else
            reason = '';
        
        AddBan(user, reason);
    } 
}

function MessageHandler(channel, tags, message) {
    lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage === 'modcheck' || lowercaseMessage === 'modcheck?' || lowercaseMessage === 'modcheck!')
        client.say(channel, `@${tags.username} modCheck? Do you really want to incur the wrath of the all powerful mods?`);
}

function AddBan(user, reason) {
    if (IsBanned(user)) return;
    
    const alt = { BanReason: reason, AccountAlts: GenerateAlts(user) };   

    Alts.push(alt);

    fs.writeFileSync('NameAlts.json', JSON.stringify(Alts), err => {
        if (err)
            console.log('Error writing file', err)
    });
}
function IsBanned(username) {
    if (Alts.length === 0) return false;
    
    let val = false;

    Alts.forEach(user => {
        if (user.AccountAlts.indexOf(username) != -1) {
            val =  true;
        }
    });

    return val;
}

function GenerateAlts(user) {
    altNames = [user];


    console.log(`${altNames.length} alts found for ${user}.`);
    return altNames;
}
