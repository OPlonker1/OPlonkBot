require('dotenv').config();

const tmi = require('tmi.js');

const BotFinder = require('./BotFinder');
const BanManager = require('./BanManager');
const Commands = require('./CommandFunctions');

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

BanManager.Init();
Commands.Init(client);

client.connect();

let FoundBots;

client.on('connected', async (address, port) => {
    FoundBots = await BotFinder.GetViewerBots(process.env.TARGET_CHANNEL);
    let Bots = await BotFinder.GetBotList();
    
    client.action(process.env.TARGET_CHANNEL, `v1.0.3 has started. Aware of ${Bots.length} bots currently.`);

    if (FoundBots.length > 0) {
        let botString = `${FoundBots.length} possible bot(s) found in chat. `;
        FoundBots.forEach(bot => {
            botString += `${bot[0]}, `;
        })
        client.say(process.env.TARGET_CHANNEL, botString);
    }

});

client.on('join', (channel, username, self) => {
    if (self) return;

    let [isBanned, banIndex] = BanManager.IsBanned(username);
    if (isBanned) {
        client.ban(channel, username);
        client.whisper(`@${TARGET_MOD}`, `${username} has been banned.`);
        //client.say(channel, `@${TARGET_MOD} There is a possible ban bypasser.\n ${username} : ${Alts[banIndex].BanReason}`);
    }

    let found = false;
    FoundBots.forEach(bot => {
        if (bot[0] === username)
            found = true;
    })

    if (found) return;

    if (BotFinder.IsBot(username)) {
        client.say(channel, `${username} is a potential bot`);
    }
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    if (message.startsWith(CMDstart))
        Commands.CommandHandler(channel, tags, message);
    else
        Commands.MessageHandler(channel, tags, message);
});