const tmi = require('tmi.js');

const Config = require('../config');
const BotFinder = require('./BotFinder');
const BanManager = require('./BanManager');
const Commands = require('./CommandFunctions');
const { sleep } = require('../lib/Utils');

const TARGET_CHANNELS = ['oplonker1', 'tornadopotato99', 'somegingergirl'];

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

    ChatFilter(channel, tags, message);

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

function ChatFilter(channel, tags, message) {
    //console.log(tags);

    if (tags.username === 'oplonker1' || (tags.mod === true || tags.subscriber === true) || (!(tags.badges === null) && tags.badges["broadcaster"] !== undefined)) return;

    if (CheckBigFollows(message)) {
        client.ban(channel, tags.username, 'BigFollows bot').then((data) => {
            console.log(`${data[1]} has been banned on ${data[0]}. Reason: ${data[2]}`);
        }).catch((err) => {
            console.log(err);
        });
    } else if (CheckDogeHype(message)) {
        client.ban(channel, tags.username, 'DogeHype bot').then((data) => {
            console.log(`${data[1]} has been banned on ${data[0]}. Reason: ${data[2]}`);
        }).catch((err) => {
            console.log(err);
        });
    }

}

function CheckBigFollows(message) {
    message = message.toLowerCase();

    let markers = ['become', 'famous', 'buy'];
    let BypassMarkers = ['Buy', 'follower', 'viewer'];
    let BypassMarkers2 = ['Buy', 'follower', 'prime'];

    let result = true;
    markers.forEach(marker => {
        if (!message.includes(marker))
            result = false;
    })

    let BypassResult = true;
    BypassMarkers.forEach(marker => {
        if (!message.includes(marker))
            BypassResult = false;
    })

    let BypassResult2 = true;
    BypassMarkers2.forEach(marker => {
        if (!message.includes(marker))
            BypassResult2 = false;
    })

    let RegExMarker = /\b(b *i *g *f *o *l *l *o *w *s *([\*\s\.\,]|\B) *c *o *m)+/g;
    let RegExBypassLinkMarker = /\b(c *l *c *k *([\*\s\.\,]|\B) *r *u)+/g;
    let RegExBypassLinkMarker2 = /\b(v *k *([\*\s\.\,]|\B) *c *c)+/g

    return (RegExMarker.test(message) || RegExBypassLinkMarker.test(message) || RegExBypassLinkMarker2.test(message)) && (result || BypassResult || BypassMarkers2);
}

function CheckDogeHype(message) {
    message = message.toLowerCase();

    let markers = ['engage', 'community'];
    let BypassMarkers = ['become', 'famous'];


    let result = true;
    markers.forEach(marker => {
        if (!message.includes(marker))
            result = false;
    })

    let BypassResult = true;
    BypassMarkers.forEach(marker => {
        if (!message.includes(marker))
            BypassResult = false;
    })

    let RegExMarker = /\b(d *o *g *e *h *y *p *e *([\*\s\.\,]|\B) *c *o *m)+/g;

    return RegExMarker.test(message) && (result || BypassResult);
}

module.exports = Run;