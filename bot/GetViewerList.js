const axios = require('axios');

const KnownBots = ['soundalerts', 'commanderroot', 'nightbot', 'streamelements', 'streamlabs', 'moobot', 'sery_bot'];

module.exports.GetViewerList = GetViewerList;
module.exports.FilterKnownBotsFromList = FilterKnownBotsFromList;
module.exports.Bots = KnownBots;


async function GetViewerList(channelName) {
    let url = `https://tmi.twitch.tv/group/user/${channelName}/chatters`;
    let data = null;

    try {
        const response = await axios.get(url);
        data = response.data;
    } catch (e) {
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