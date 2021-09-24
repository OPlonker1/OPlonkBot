const fetch = require('node-fetch');

module.exports.GetViewerList = GetViewerList;
module.exports.FilterKnownBotsFromList = FilterKnownBotsFromList;

const KnownBots = ['business_daddy', 'ehrabz', 'soundalerts', 'commanderroot', 'anotherttvviewer', 'nightbot', 'streamelements', 'gowithhim', 'apparentlyher'];

async function GetViewerList(channelName) {
    let url = `https://tmi.twitch.tv/group/user/${channelName}/chatters`;
    let data = null;

    try {
        const response = await fetch(url);
        data = await response.json();
    } catch(e) {
        console.log('error', e);
    }

    return data;
}

function FilterKnownBotsFromList(viewers) {
    let filteredViewers = [];

    viewers.forEach(viewer => {
        if (!KnownBots.includes(viewer))
            filteredViewers.push(viewer);
    })

    return filteredViewers;
}