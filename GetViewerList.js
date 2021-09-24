const fetch = require('node-fetch');

module.exports.GetViewerList = GetViewerList;
module.exports.FilterKnownBotsFromList = FilterKnownBotsFromList;

const KnownBots = ['business_daddy', 'ehrabz', 'soundalerts', 'commanderroot', 'anotherttvviewer', 'nightbot', 'streamelements', 'gowithhim', 'apparentlyher'];

async function GetViewerList(channelName) {
    let url = `https://tmi.twitch.tv/group/user/${channelName}/chatters`;
    let data = null;

    const start = new Date().getTime();

    try {
        const response = await fetch(url);
        data = await response.json();
    } catch(e) {
        console.log('error', e);
    }

    const end = new Date().getTime();
    console.log(end - start);

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