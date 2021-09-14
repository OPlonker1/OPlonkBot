require('dotenv').config();

const tmi = require('tmi.js');

const AltGenerator = require('./altGenerator');
const Database = require('./DataManager');

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

Alts = Database.Read();

client.connect();

client.on('connected', ( address, port ) => {
    client.action( process.env.TARGET_CHANNEL, 'OPlonkBot v1.0.1 has started.' );
});

client.on('join', (channel, username, self) => {
    if (self) return;

    let [isBanned, banIndex] = IsBanned(username);
    if (isBanned) {
        //client.ban(channel, username);
        client.say(channel, `@OPlonker1 There is a possible ban bypasser.\n ${username} : ${Alts[banIndex].BanReason}`);
    }
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

    if (command === 'oplonkbot') {
        client.say(channel, `I am a bot created by OPlonker1. I am trying to fight the bad bots!! MrDestructoid `);
    }
}

function ModCommandHandler(channel, tags, command, args) {
    if (tags.mod !== true) return;

    if (command === 'echo') {
        client.say(channel, `"${args.join(' ')}"`);
    } else if (command === 'addban') {
        if (args.length == 0) return;

        user = args.shift().toLowerCase();
        if (IsBanned(user)[0]) return;

        if (args.length != 0)
            reason = args.join(' ');
        else
            reason = '';
        
        let banIndex = AddBan(user, reason);
        client.say(channel, `${user} has been added to the watchlist with ${Alts[banIndex].AccountAlts.length - 1} generated alt names.`);

    } else if (command === 'rmban') {
        if (args.length == 0) return;

        user = args.shift().toLowerCase();
        let [isBan, index] = IsBanned(user);
        
        if (!isBan) return;

        Alts.splice(index);

        Database.Write(Alts);
        
        client.say(channel, `${user} has been removed from the watchlist`);
    } else if (command === 'ls_alts') {
        if (args.length == 0) return;

        user = args.shift().toLowerCase();

        let [isBanned, banIndex] = IsBanned(user);
        if (!isBanned) return;

        let startIndex = 1;
        if (args.length != 0) {
            startIndex = parseInt(args.shift());

            if (startIndex > 10)
                startIndex = 10;
            
            if (startIndex > Alts[banIndex].AccountAlts.length - 1)
                startIndex = Alts[banIndex].AccountAlts.length - 1;
        }

        let numberToRetrieve = 1;
        if (args.length != 0) {
            numberToRetrieve = parseInt(args.shift());
            if ((startIndex + numberToRetrieve) > Alts[banIndex].AccountAlts.length - 1)
                startIndex = (Alts[banIndex].AccountAlts.length - 1) - numberToRetrieve;
        }

        let altList = [];
        for (let index = startIndex; index < startIndex + numberToRetrieve; index++) {
            altList.push(Alts[banIndex].AccountAlts[index]);
        }
        
        client.say(channel, `${altList.join('\n')}`);
        
    } else if (command === 'isbanned') {
        if (args.length == 0) return;

        user = args.shift().toLowerCase();

        let [isBanned, banIndex] = IsBanned(user);
        if (isBanned)
            client.say(channel, `${user} is on the watchlist. ${Alts[banIndex].AccountAlts.length - 1} alts generated for this user.`);
        else
            client.say(channel, `${user} is not on the watchlist.`);
    }
}

function MessageHandler(channel, tags, message) {
    lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage === 'modcheck' || lowercaseMessage === 'modcheck?' || lowercaseMessage === 'modcheck!')
        client.say(channel, `@${tags.username} modCheck? Do you really want to incur the wrath of the all powerful mods?`);
}

function AddBan(user, reason) {
    if (IsBanned(user)[0]) return;
    
    const alt = { BanReason: reason, AccountAlts: AltGenerator(user) };   
    Alts.push(alt);

    Database.Write(Alts);

    return Alts.indexOf(alt);
}

function IsBanned(username) {
    let banned = false;
    let arrayIndex = -1;

    if (Alts.length === 0) return [banned, arrayIndex];
    
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

