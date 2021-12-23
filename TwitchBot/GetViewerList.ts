import axios from 'axios';

const KnownBots = ['soundalerts', 'commanderroot', 'nightbot', 'streamelements', 'streamlabs', 'moobot', 'sery_bot'];

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

function ExtractAllViewers(viewerList) {
    const viewers = [...viewerList.broadcaster, ...viewerList.vips, ...viewerList.moderators,
    ...viewerList.staff, ...viewerList.admins, ...viewerList.global_mods, ...viewerList.viewers];

    return viewers;
}

function FilterKnownBotsFromList(viewers) {
    let filteredViewers = [];

    viewers.forEach(viewer => {
        if (!KnownBots.includes(viewer))
            filteredViewers.push(viewer);
    })

    return filteredViewers;
}

export default {
    GetViewerList,
    FilterKnownBotsFromList,
    ExtractAllViewers,
    Bots: KnownBots
}