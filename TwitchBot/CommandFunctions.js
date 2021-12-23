const Config = require('../config');

const BanManager = require('./BanManager');
const Viewers = require('./GetViewerList');

/*** Command Handlers ***/

module.exports.Init = Init;
module.exports.ChatHandler = ChatHandler;

let MessageFunctions = {};
let ViewerFunctions = {};
let ModFunctions = {};

let client;

function Init(_client) {
    client = _client;
}

function ChatHandler(channel, tags, message) {
    if (message.startsWith(Config.COMMAND_START))
        CommandHandler(channel, tags, message);
    else
        MessageHandler(channel, tags, message);
}

function CommandHandler(channel, tags, message) {
    let CMDstart = Config.COMMAND_START;
    const args = message.slice(CMDstart.length).split(' ');
    const command = args.shift().toLowerCase();

    ModCommandHandler(channel, tags, command, args);
    ViewerCommandHandler(channel, tags, command, args);
}

function ModCommandHandler(channel, tags, command, args) {
    if ((tags.mod !== true && tags.badges["broadcaster"] === undefined) && tags.username !== 'oplonker1') return;

    let func = ModFunctions[command];
    if (func === undefined) return;

    func(channel, args);
}

function ViewerCommandHandler(channel, tags, command, args) {
    let func = ViewerFunctions[command];
    if (func === undefined) return;

    func(channel, args, tags);
}

function MessageHandler(channel, tags, message) {
    message = message.toLowerCase();

    if (isModCheck(message)) {
        modCheck(channel, tags);

    } else if (isChatBlind(message)) {
        chatBlind(channel);

    } else if (isClueBlind(message)) {
        clueBlind(channel);

    } else if (isSmort(message)) {
        smort(channel);

    } else if (isStronk(message)) {
        stronk(channel);

    } else if (isRip(message)) {
        rip(channel);

    } else if (isBadaboom(message)) {
        badaboom(channel);

    } else if (isTwss(message)) {
        twss(channel);

    }
}

/*** Mod Command Handler ***/

ModFunctions["echo"] = echo;
ModFunctions["addban"] = addBan;
ModFunctions["rmban"] = rmBan;
ModFunctions["lsalts"] = lsAlts;
ModFunctions["isbanned"] = isBanned;
ModFunctions["raid"] = raid;
ModFunctions["ban"] = ban;
ModFunctions["unban"] = unban;

function echo(channel, args) {
    client.say(channel, `${args.join(' ')}`);
}

function addBan(channel, args) {
    if (args.length == 0) return;

    user = args.shift().toLowerCase();
    if (BanManager.IsBanned(user)[0]) return;

    if (args.length != 0)
        reason = args.join(' ');
    else
        reason = '';

    let numAlts;
    if (args.length == 0) {
        numAlts = BanManager.AddToWatchlist(user, reason);
    } else {
        let boolArg = args.shift().toLowerCase();
        numAlts = BanManager.AddToWatchlist(user, reason, boolArg === 'true');
    }

    client.say(channel, `${user} has been added to the watchlist with ${numAlts} generated alt names.`);
}

function rmBan(channel, args) {
    if (args.length == 0) return;

    user = args.shift().toLowerCase();
    BanManager.RmWatchlist(user);

    client.say(channel, `${user} has been removed from the watchlist`);
}

function lsAlts(channel, args) {
    if (args.length == 0) return;

    username = args.shift().toLowerCase();

    let user = BanManager.GetBannedUser(username);
    if (user === null) return;

    let startIndex = 1;
    if (args.length != 0) {
        startIndex = parseInt(args.shift());

        if (startIndex > 10)
            startIndex = 10;

        if (startIndex > user.AccountAlts.length - 1)
            startIndex = user.AccountAlts.length - 1;
    }

    let numberToRetrieve = 1;
    if (args.length != 0) {
        numberToRetrieve = parseInt(args.shift());
        if ((startIndex + numberToRetrieve) > user.AccountAlts.length - 1)
            startIndex = (user.AccountAlts.length - 1) - numberToRetrieve;
    }

    let altList = [];
    for (let index = startIndex; index < startIndex + numberToRetrieve; index++) {
        altList.push(user.AccountAlts[index]);
    }

    client.say(channel, `${altList.join('\n')}`);
}

function isBanned(channel, args) {
    if (args.length == 0) return;

    username = args.shift().toLowerCase();

    let user = BanManager.GetBannedUser(username);

    if (user !== null)
        client.say(channel, `${username} is on the watchlist. ${user.AccountAlts.length - 1} alts generated for this user.`);
    else
        client.say(channel, `${username} is not on the watchlist.`);
}

function raid(channel) {
    client.say(channel, `TombRaid TombRaid Welcome Raiders!! TombRaid TombRaid `);
}

function ban(channel, args) {
    if (args.length == 0) return;

    let username = args.shift().toLowerCase();
    let reason = '';

    if (args.length !== 0)
        reason = args.join(' ');

    client.ban(channel, username, reason)
        .then((data) => {
            console.log(`${data[1]} has been banned on ${data[0]}. Reason: ${data[2]}`);
        }).catch((err) => {
            console.log(err);
        });
}

function unban(channel, args) {
    if (args.length == 0) return;

    let username = args.shift().toLowerCase();

    client.unban(channel, username)
        .then((data) => {
            console.log(`${data[1]} has been unbanned on ${data[0]}.}`);
        }).catch((err) => {
            console.log(err);
        });
}

/*** Viewer Command Handler ***/
ViewerFunctions["oplonkbot"] = OPlonkBot;
ViewerFunctions["mic"] = mic;
ViewerFunctions["internet"] = internet;
ViewerFunctions["screen"] = screen;
ViewerFunctions["tentacles"] = tentacles;
ViewerFunctions["toxic"] = toxic;
ViewerFunctions["shoot"] = shoot;
ViewerFunctions["crossword"] = crossword;
ViewerFunctions["hydrate"] = hydrate;
ViewerFunctions["bonk"] = bonk;
ViewerFunctions["tunes"] = tunes;
ViewerFunctions["catjams"] = catJams;
ViewerFunctions["jammies"] = jammies;
ViewerFunctions["driving"] = driving;
ViewerFunctions["steerassist"] = steerAssist;
ViewerFunctions["children"] = children;
ViewerFunctions["ddreminder"] = ddReminder;
ViewerFunctions["nottoday"] = notToday;
ViewerFunctions["hope"] = hope;
ViewerFunctions["alexa"] = alexa;
ViewerFunctions["micdeath"] = micDeath;
ViewerFunctions["aimassist"] = aimAssist;
ViewerFunctions["talking"] = talking;

function OPlonkBot(channel) {
    client.say(channel, `I am a bot created by OPlonker1. I add some fun commands GlitchCat, I am also trying to fight the bad bots!! MrDestructoid `);
}

function mic(channel) {
    client.say(channel, `Mic got tired. Have to wake it up. BOP`);
}

function internet(channel) {
    client.say(channel, `All the ether is leaking out of the ethernet cables!! panicBasket`);
}

function screen(channel) {
    client.say(channel, `I must keep my gameplay secret BrainSlug `);
}

function tentacles(channel) {
    client.say(channel, `All the tentacles!!!`);
    client.say(channel, `Squid1 Squid2 Squid3 Squid2 Squid4`);
}

function toxic(channel) {
    client.say(channel, `Wait.... is that a ToxicSpud? PJSalt cvHazmat`);
}

async function shoot(channel, args, tags) {
    channel = channel.slice(1, channel.length);

    let viewers = await Viewers.GetViewerList(channel);

    let AllViewers = [...viewers.chatters.moderators, ...viewers.chatters.viewers, ...viewers.chatters.broadcaster];

    AllViewers = Viewers.FilterKnownBotsFromList(AllViewers);

    console.log(AllViewers);

    let selectedViewer;
    if (args.length != 0) {

        selectedViewer = args.shift().toLowerCase();
        if (selectedViewer.charAt(0) === '@')
            selectedViewer = selectedViewer.slice(1, selectedViewer.length);

    } else {
        let index = Math.floor(Math.random() * AllViewers.length);
        selectedViewer = AllViewers[index];
    }

    if (AllViewers.includes(selectedViewer)) {
        if (selectedViewer == tags.username)
            client.say(channel, `@${tags.username}\'s gun has jammed!!`);
        else if (selectedViewer == Config.TWITCH_USERNAME.toLowerCase())
            client.say(channel, `@${tags.username} has shot at @${selectedViewer}, How rude!!`);
        else
            client.say(channel, `@${tags.username} has shot at @${selectedViewer}`);
    } else {
        client.say(channel, `@${tags.username} has shot at @${selectedViewer}, but they aren't there.`);
    }
}

function crossword(channel) {
    client.say(channel, `Crossword is love, Crossword is life. duDudu <3 `);
}

function hydrate(channel) {
    client.say(channel, `Drink cactus juice!! It'll quench ya!! Nothing's quenchier!! It's the quenchiest!! HSCheers`);
}

function bonk(channel, args) {
    let str = '';
    if (args.length != 0) {

        let user = args.shift().toLowerCase();
        if (user.charAt(0) === '@')
            user = user.slice(1, user.length);

        str += `@${user} `;
    }

    str += 'Bonk, to jail with you! FootYellow StinkyCheese';
    client.say(channel, str);
}

function tunes(channel) {
    client.say(channel, `PepoDance blobDance pepeJAM catJAM`);
}

function catJams(channel, args) {
    let length = 4;

    if (args.length !== 0 && isNaN(args[0]) == false)
        length = args.shift();

    if (length > 60)
        length = 60;

    let output = '';

    for (let i = 0; i < length; i++)
        output += 'catJAM ';

    client.say(channel, output);
}

function jammies(channel, args) {
    let length = 4;

    if (args.length !== 0 && isNaN(args[0]) == false)
        length = args.shift();

    if (length > 60)
        length = 60;

    let output = '';

    for (let i = 0; i < length; i++)
        output += 'Jammies ';

    client.say(channel, output);
}

function driving(channel) {
    client.say(channel, `Driving is easy!! monkaSTEER `);
}

function steerAssist(channel) {
    client.say(channel, `Steer assist is on, no monkaSTEER for me!!`);
}

function children(channel) {
    client.say(channel, `"They're all mistakes, children. Filthy, nasty things. Glad I never was one." - Miss Trunchbull, Matilda`);
}

function ddReminder(channel) {
    client.say(channel, `"Remind yourself that overconfidence is a slow and insidious killer" - Darkest Dungeon`);
}

function notToday(channel) {
    client.say(channel, `"Many Fall In The Face Of Chaos, But Not This One. Not Today." - Darkest Dungeon`);
}

function hope(channel) {
    client.say(channel, `"A little hope, however desperate is never without worth." - Darkest Dungeon`);
}

function alexa(channel) {
    client.say(channel, `I wasn't talking to you!`);
}

function micDeath(channel) {
    client.say(channel, `Mic murder in progress!!`);
}

function aimAssist(channel) {
    client.say(channel, `My aim is usually better than this I swear, too much aim assist in this game! PepegaAim `);
}

function talking(channel, args) {
    client.say(channel, 'Don\'t Talking Chat!!');
}

/*** Message Handler ***/

//modCheck
function isModCheck(message) {
    return message === 'modcheck' || message === 'modcheck?' || message === 'modcheck!';
}

function modCheck(channel, tags) {
    client.say(channel, `@${tags.username} modCheck? Do you really want to incur the wrath of the all powerful mods?`);
}

//chatBlind
function isChatBlind(message) {
    return message.includes('chat blind?');
}

function chatBlind(channel) {
    client.say(channel, `Chat blind confirmed! peepoLeave`);
}

//clueBlind
function isClueBlind(message) {
    return message.includes('clue blind?');
}

function clueBlind(channel) {
    client.say(channel, `Clue blind confirmed! PunOko`);
}

//smort
function isSmort(message) {
    return message === 'smort';
}

function smort(channel) {
    client.say(channel, `That's a lot of brain cells! 5Head`);
}

//stronk
function isStronk(message) {
    return message === 'stronk';
}

function stronk(channel) {
    client.say(channel, `Got them big stronk muscles!`);
}

//rip
function isRip(message) {
    let words = message.split(' ');
    return words.includes('rip');
}

function rip(channel) {
    client.say(channel, `riPepperonis riPepperonis`);
}

//badaboom
function isBadaboom(message) {
    return message === 'badaboom?';
}

function badaboom(channel) {
    client.say(channel, `Big BadaBoom!!`);
}

//!twss
function isTwss(message) {
    return message === '!twss';
}

function twss(channel) {
    client.say(channel, `That is definitely what she said! KEKW`);
}