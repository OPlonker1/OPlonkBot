const fetch = require('node-fetch');

const Viewers = require('./GetViewerList');

let BotList = null;

module.exports.GetBotList = GetBotList;
module.exports.GetViewerBots = GetViewerBots;
module.exports.UpdateBotList = UpdateBotList;

async function GetBotList() {
    if (BotList !== null)
        return BotList;
    
    BotList = await RequestBotList();
    
    return BotList;
}

async function GetViewerBots(channel) {
    let FoundBots = [];
    let viewersList = await Viewers.GetViewerList(channel);

    let AllViewers = [...viewersList.chatters.moderators, ...viewersList.chatters.viewers, ...viewersList.chatters.broadcaster];
    
    let botList = await GetBotList();
    botList.forEach( bot => {
        AllViewers.forEach(User => {
            if (bot[0] === User)
                FoundBots.push(bot);
        });
    });
    
    return FoundBots;
}

module.exports.IsBot = IsBot;
async function IsBot(username) {
    let found = false;
    let foundBot;
    let botList = await GetBotList();
    botList.forEach( bot => {
        if (bot[0] === username) {
            found = true;
            foundBot = bot;
        }
    });

    return [found, foundBot];
}

let SixtyMinutes = 3600000;
async function UpdateBotList() {
    BotList = await RequestBotList();
    setTimeout( UpdateBotList, SixtyMinutes);
}

async function RequestBotList() {
    let result = [];

    try {
        const response = await fetch('https://api.twitchinsights.net/v1/bots/all', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const dataJson = await response.json();
        const bots = dataJson.bots;

        bots.forEach( (bot) => {
            if(!Viewers.Bots.includes(bot[0]))
                result.push([bot[0], bot[1]]);
        });

    } catch(e) {
        console.log('error', e);
    }

    return result;
}