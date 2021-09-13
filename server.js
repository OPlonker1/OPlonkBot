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

const Leets = {
    'a': ['a', '4'],
    'b': ['b', '8', '6'],
    'c': ['c'],
    'd': ['d'],
    'e': ['e', '3'],
    'f': ['f', '7'],
    'g': ['g', '6'],
    'h': ['h', '4'],
    'i': ['i', '1', '9'],
    'j': ['j', '7', '9'],
    'k': ['k'],
    'l': ['l', '1'],
    'm': ['m'],
    'n': ['n'],
    'o': ['o', '0'],
    'p': ['p'],
    'q': ['q', '9'],
    'r': ['r'],
    's': ['s', '5'],
    't': ['t', '7'],
    'u': ['u'],
    'v': ['v'],
    'w': ['w'],
    'x': ['x'],
    'y': ['y'],
    'z': ['z', '5'],
    '0': ['0', 'o'],
    '1': ['1', 'i', 'l', '7'],
    '2': ['2', 'z'],
    '3': ['3', 'e'],
    '4': ['4', 'h', 'a'],
    '5': ['5', 's'],
    '6': ['6', 'b', 'g'],
    '7': ['7', 't', 'j', 'l'],
    '8': ['8', 'b'],
    '9': ['9', 'g']
};

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
    client.action( process.env.TARGET_CHANNEL, 'OPlonkBot v1.0 has started.' );
});

client.on('join', (channel, username, self) => {
    if (self) return;

    if (IsBanned(username)[0])
        client.say(channel, `@OPlonker1 There is a possible ban bypasser.\n ${username}`);

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
    } else if (command === 'oplonkbot') {
        client.say(channel, `I am a test bot created by OPlonker1. I am trying to fight the bots!! SirSword `);
    }
}

function ModCommandHandler(channel, tags, command, args) {
    if (tags.mod !== true) return;

    if (command === 'addban') {
        if (args.length == 0) return;

        user = args.shift().toLowerCase();
        if (IsBanned(user)[0]) return;

        if (args.length != 0)
            reason = args.join(' ');
        else
            reason = '';
        
        AddBan(user, reason);
    } else if (command === 'rmban') {
         if (args.length == 0) return;

        user = args.shift().toLowerCase();
        let [isBan, index] = IsBanned(user);
        
        console.log(isBan);
        console.log(index);
        if (!isBan) return;

        console.log(Alts);
        Alts.splice(index);

        console.log(Alts);
    }
}

function MessageHandler(channel, tags, message) {
    lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage === 'modcheck' || lowercaseMessage === 'modcheck?' || lowercaseMessage === 'modcheck!')
        client.say(channel, `@${tags.username} modCheck? Do you really want to incur the wrath of the all powerful mods?`);
}

function AddBan(user, reason) {
    if (IsBanned(user)[0]) return;
    
    const alt = { BanReason: reason, AccountAlts: GenerateAlts(user) };   

    Alts.push(alt);

    fs.writeFileSync('NameAlts.json', JSON.stringify(Alts), err => {
        if (err)
            console.log('Error writing file', err)
    });
}
function IsBanned(username) {
    if (Alts.length === 0) return false;
    
    let banned = false;
    let arrayIndex = -1;

    Alts.forEach(user => {
        user.AccountAlts.forEach(alt => {
            if (username.includes(alt)) {
                banned = true;
                arrayIndex = Alts.indexOf(user);
            }
        })
    });

    return [banned, arrayIndex];
}

function GenerateAlts(user) {
    altNames = [user];


    console.log(`${altNames.length} alts found for ${user}.`);
    return altNames;
}
