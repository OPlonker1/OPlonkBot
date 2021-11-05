const tmi = require('tmi.js');

const Config = require('../config');
const BotFinder = require('./BotFinder');
const BanManager = require('./BanManager');
const Commands = require('./CommandFunctions');
const { sleep } = require('../lib/Utils');

const TARGET_CHANNELS = ['oplonker1'];//, 'tornadopotato99', 'somegingergirl'];

const options = {
    options: { debug: true },

    connection: {
        reconnect: true,
        secure: true
    },

    identity: {
        username: Config.TWITCH_USERNAME,
        password: Config.TWITCH_PASSWORD
    },

    channels: TARGET_CHANNELS
};

const client = new tmi.client(options);

let FoundBots = {};

function Run() {
    BanManager.Init();
    Commands.Init(client);
    BotFinder.UpdateBotList();

    client.connect();
}

client.on('join', async (channel, username, self) => {
    if (self) {
        GreetingMessage(channel);
        BotCheck(channel);
        return;
    }

    let [isBanned, banIndex] = BanManager.IsBanned(username);
    if (isBanned) {
        client.ban(channel, username).then((data) => {
            console.log(`${data[1]} has been banned on ${data[0]}. Reason: ${data[2]}`);
        }).catch((err) => {
            console.log(err);
        });
        return;
    }

    let found = false;
    FoundBots[channel].forEach(bot => {
        if (bot[0] === username)
            found = true;
    })

    if (found) return;
    let [isBot, BotDetails] = await BotFinder.IsBot(username);
    if (isBot) {
        client.say(channel, `${username} is a potential bot, found in ${BotDetails[1]} channels`);

        if (BotDetails[1] > 100)
            client.ban(channel, username, 'Accused of being a bot').then((data) => {
                console.log(`${data[1]} has been banned on ${data[0]}. Reason: ${data[2]}`);
            }).catch((err) => {
                console.log(err);
            });
    }
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    Commands.ChatHandler(channel, tags, message);
});

async function GreetingMessage(channel) {
    let Bots = await BotFinder.GetBotList();

    client.action(channel, `v1.2.0 has started. Aware of ${Bots.length} bots currently.`);
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

module.exports = Run;