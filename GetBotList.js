const fetch = require('node-fetch');

const url = 'https://twitchinsights.net/bots';

const KnownBots = ['soundalerts', 'commanderroot', 'anotherttvviewer', 'nightbot', 'streamelements'];

module.exports = GetBotList();

async function GetBotList() {
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

        result.sort((a,b) => (a[1] < b[1]) ? 1 : ((b[1] < a[1]) ? -1 : 0))
    } catch(e) {
        console.log('error', e);
    }

    return result;
}
