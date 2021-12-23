import axios from 'axios';
import Viewers from './GetViewerList';

let BotList = null;

export async function GetBotList() {
    if (BotList !== null)
        return BotList;

    BotList = await RequestBotList();

    return BotList;
}

export async function GetViewerBots(channel) {
    let FoundBots = [];
    let viewersList = await Viewers.GetViewerList(channel);

    let AllViewers = [...viewersList.chatters.moderators, ...viewersList.chatters.viewers, ...viewersList.chatters.broadcaster];

    let botList = await GetBotList();
    botList.forEach(bot => {
        AllViewers.forEach(User => {
            if (bot[0] === User)
                FoundBots.push(bot);
        });
    });

    return FoundBots;
}

export async function IsBot(username) {
    let found = false;
    let foundBot;
    let botList = await GetBotList();
    botList.forEach(bot => {
        if (bot[0] === username) {
            found = true;
            foundBot = bot;
        }
    });

    return [found, foundBot];
}

let SixtyMinutes = 3600000;
export async function UpdateBotList() {

    let bots = await RequestBotList();
    if (bots.length > 0) {
        BotList = bots;
        console.log('\nBot List Updated\n');
    } else {
        console.log('\nError: Bot List Not Updated\n');
    }

    setTimeout(UpdateBotList, SixtyMinutes);
}

export async function RequestBotList() {
    let result = [];

    let Exemptions = ['wombatcombatprime'];

    try {
        const response = await axios.get('https://api.twitchinsights.net/v1/bots/all');
        const dataJson: {bots: [string, string][]} = <any> await response.data;
        const bots = dataJson.bots;

        bots.forEach((bot) => {
            if (!Viewers.Bots.includes(bot[0]) && !(Exemptions.includes(bot[0])))
                result.push([bot[0], bot[1]]);
        });

    } catch (e) {
        console.log('error', e);
    }

    return result;
}

export default {
    GetBotList,
    GetViewerBots,
    UpdateBotList,
    IsBot
};