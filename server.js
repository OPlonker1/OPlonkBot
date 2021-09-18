require('dotenv').config();

const tmi = require('tmi.js');

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

client.connect();

client.on('connected', ( address, port ) => {
    client.action( process.env.TARGET_CHANNEL, 'OPlonkBot v1.0.1 has started.' );
});

client.on('join', (channel, username, self) => {
    if (self) return;

    let [isBanned, banIndex] = IsBanned(username);
    if (isBanned) {
        //client.ban(channel, username);
        client.say(channel, `@${TARGET_MOD} There is a possible ban bypasser.\n ${username} : ${Alts[banIndex].BanReason}`);
    }
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    message = message.toLowerCase();

    if (message.startsWith(CMDstart))
        Commands.CommandHandler(channel, tags, message);
    else
        Commands.MessageHandler(channel, tags, message);
});