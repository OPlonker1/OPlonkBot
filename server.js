require('dotenv').config();

const tmi = require('tmi.js');

const BotFinder = require('./BotFinder');
const BanManager = require('./BanManager');
const Commands = require('./CommandFunctions');
const { sleep } = require('./Utils');

TARGET_CHANNELS = ['oplonker1', 'tornadopotato99', 'somegingergirl'];

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

    channels: TARGET_CHANNELS    
};

const client = new tmi.client(options);

const CMDstart = process.env.COMMAND_START;

let FoundBots = {};

function Init(){
    BanManager.Init();
    Commands.Init(client);

    client.connect();
}

//client.on('connected', async (address, port) => {});

client.on('join', async (channel, username, self) => {
    if (self) {
        GreetingMessage(channel);
        BotCheck(channel);
        return;
    }

    let [isBanned, banIndex] = BanManager.IsBanned(username);
    if (isBanned) {
        client.ban(channel, username);
        client.whisper(`${TARGET_MOD}`, `${username} has been banned.`);
        return;
    }

    let found = false;
    FoundBots[channel].forEach(bot => {
        if (bot[0] === username)
            found = true;
    })

    if (found) return;
    [isBot, BotDetails] = await BotFinder.IsBot(username);
    if (isBot) {
        client.say(channel, `${username} is a potential bot, in ${BotDetails[1]} channels`);
        if (BotDetails[1] > 100)
            client.ban(channel, username, 'Accused of being a bot');
    }
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    if (message.startsWith(CMDstart))
        Commands.CommandHandler(channel, tags, message);
    else
        Commands.MessageHandler(channel, tags, message);
});

async function GreetingMessage(channel) {
    let Bots = await BotFinder.GetBotList();

    client.action(channel, `v1.1.1 has started. Aware of ${Bots.length} bots currently.`);
}

async function BotCheck(channel) {
    FoundBots[channel] = await BotFinder.GetViewerBots(channel.slice(1, channel.length));

    if (FoundBots[channel].length > 0) {
            let botString = `${FoundBots[channel].length} possible bot(s) found in chat. `;
            FoundBots[channel].forEach(bot => {
                botString += `${bot[0]} : ${bot[1]} channels, `;
            })

            await sleep();
            client.say(channel, botString);
        }
}

Init();