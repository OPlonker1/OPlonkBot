require('dotenv').config();

const tmi = require('tmi.js');

const BotFinder = require('./BotFinder');
const BanManager = require('./BanManager');
const Commands = require('./CommandFunctions');
const { sleep } = require('./Utils');

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

    //channels: [process.env.TARGET_CHANNELS]
    
};

const client = new tmi.client(options);

const CMDstart = process.env.COMMAND_START;

let FoundBots = {};

function Init(){
    BanManager.Init();
    Commands.Init(client);

    client.connect();
}

client.on('connected', (address, port) => {
    let channelList = process.env.TARGET_CHANNELS.split(',');

    channelList.forEach(async (channel) => {
        try {
            client.join(channel);
        } catch (err) {
            console.log('Error joining channel:\n' + err)
        }
        FoundBots[channel] = await BotFinder.GetViewerBots(channel);;
        let Bots = await BotFinder.GetBotList();

        client.action(channel, `v1.1.0 has started. Aware of ${Bots.length} bots currently.`);

        if (FoundBots[channel].length > 0) {
            let botString = `${FoundBots[channel].length} possible bot(s) found in chat. `;
            FoundBots[channel].forEach(bot => {
                botString += `${bot[0]} : ${bot[1]} channels, `;
            })

            await sleep();
            client.say(channel, botString);
        }
    });
});

client.on('join', async (channel, username, self) => {
    if (self) return;

    let [isBanned, banIndex] = BanManager.IsBanned(username);
    if (isBanned) {
        client.ban(channel, username);
        client.whisper(`${TARGET_MOD}`, `${username} has been banned.`);
        //client.say(channel, `@${TARGET_MOD} There is a possible ban bypasser.\n ${username} : ${Alts[banIndex].BanReason}`);
        return;
    }

    let found = false;
    FoundBots[channel.slice(1,channel.length)].forEach(bot => {
        if (bot[0] === username)
            found = true;
    })

    if (found) return;
    [isBot, BotDetails] = await BotFinder.IsBot(username);
    if (isBot) {
        client.say(channel, `${username} is a potential bot, in ${BotDetails[1]} channels`);
        if (BotDetails[1] > 100)
            client.ban(channel, username, 'Accused of being a bot.');
    }
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    if (message.startsWith(CMDstart))
        Commands.CommandHandler(channel, tags, message);
    else
        Commands.MessageHandler(channel, tags, message);
});

Init();