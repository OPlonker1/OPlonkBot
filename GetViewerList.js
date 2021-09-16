const fetch = require('sync-fetch');

module.exports = GetViewerList;

function GetViewerList(channelName) {
    let url = `https://tmi.twitch.tv/group/user/${channelName}/chatters`;
    let data = null;

    const start = new Date().getTime();

    try {
        const response = fetch(url);
        data = response.json();
    } catch(e) {
        console.log('error', e);
    }

    const end = new Date().getTime();
    console.log(end - start);

    return data;
}