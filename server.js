require('dotenv').config();

const tmi = require('tmi.js');

const AltGenerator = require('./altGenerator');
const Database = require('./dataManager');

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
    } else if (command === 'mic') {
        client.say(channel, `Mic got tired. Have to wake it up. BOP`);
    } else if (command === 'internet') {
        client.say(channel, `All the ether is leaking out of the ethernet cables!! panicBasket`);
    }else if (command === 'screen') {
        client.say(channel, `I must keep my gameplay secret BrainSlug `);
    } else if (command === 'squid') {
        client.say(channel, `\nSquid1 Squid2 Squid3 Squid2 Squid4`);
    } else if (command === 'toxic') {
        client.say(channel, `Wait.... is that a ToxicSpud? PJSalt cvHazmat`);
    } else if (command === 'bonk') {
        let str = '';
        if (args.length != 0) {

            let user = args.shift();
            if (user.charAt(0) === '@')
                user = user.slice(1, user.length);
            
            str += `@${user} `;
        }
        
        str += 'Bonk, to jail with you! FootYellow StinkyCheese';
        client.say(channel, str);        
    }
}

function ModCommandHandler(channel, tags, command, args) {
    if (tags.mod !== true) return;

    if (command === 'echo') {
        client.say(channel, `${args.join(' ')}`);
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
    } else if (command === 'raid') {
        client.say(channel, `TombRaid TombRaid Welcome Raiders!! TombRaid TombRaid `);
    }
}

function MessageHandler(channel, tags, message) {
    lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage === 'modcheck' || lowercaseMessage === 'modcheck?' || lowercaseMessage === 'modcheck!')
        client.say(channel, `@${tags.username} modCheck? Do you really want to incur the wrath of the all powerful mods?`);
    else if (lowercaseMessage.includes('chat blind?'))
        client.say(channel, `Chat blind confirmed`);
    else if (lowercaseMessage == 'ddreminder')
        client.say(channel, `"Remind yourself that overconfidence is a slow and insidious killer" - Darkest Dungeon`);
    else if (lowercaseMessage == 'aim assist')
        client.say(channel, `My aim is usually better than this I swear, too much aim assist in this game!`);
    else if (lowercaseMessage === 'smort')
        client.say(channel, `That's a lot of brain cells!`);
        else if (lowercaseMessage === 'stronk')
        client.say(channel, `Got them big stronk muscles!`);
    else if (lowercaseMessage.includes('rip ') || lowercaseMessage.includes(' rip') || lowercaseMessage == 'rip')
        client.say(channel, `riPepperonis riPepperonis`);
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

