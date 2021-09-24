const fetch = require('node-fetch');

const Viewers = require('./GetViewerList');

const KnownBots = ['soundalerts', 'commanderroot', 'anotherttvviewer', 'nightbot', 'streamelements'];

let BotList = null;

module.exports.GetBotList = GetBotList;
async function GetBotList() {
    if (BotList !== null)
        return BotList;
    
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
            if(!KnownBots.includes(bot[0]))
                result.push([bot[0], bot[1]]);
        });

        //result.sort((a,b) => (a[1] < b[1]) ? 1 : ((b[1] < a[1]) ? -1 : 0))
    } catch(e) {
        console.log('error', e);
    }
    
    BotList = result;
    return result;
}

module.exports.GetViewerBots = GetViewerBots;

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
function IsBot(username) {
    let found = false;
    let botList = await GetBotList();
    botList.forEach( bot => {
        if (bot[0] === username)
            found = true;
    });

    return found;
}