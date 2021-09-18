require('dotenv').config();

const BanManager = require('./BanManager');
const Viewers = require('./GetViewerList');

/*** Command Handlers ***/

module.exports.CommandHandler = CommandHandler;
module.exports.MessageHandler = MessageHandler;


function CommandHandler(channel, tags, message) {
    let CMDstart = process.env.COMMAND_START;
	const args = message.slice( CMDstart.length ).split(' ');
    const command = args.shift();

    ModCommandHandler(channel, tags, command, args);
    ViewerCommandHandler(channel, tags, command, args);
}

function ModCommandHandler(channel, tags, command, args) {
    if (tags.mod !== true) return;

    if (isEcho(command)) {
        echo(channel, args);

    } else if (isAddBan(command)) {
        addBan(channel, args);

    } else if (isRmBan(command)) {
        rmBan(channel, args);

    } else if (isLsAlts(command)) {
        lsAlts(channel, args);

    } else if (isIsBanned(command)) {
        isBanned(channel, args);

    } else if (isRaid(command)) {
        raid(channel);
    }
}

function ViewerCommandHandler(channel, tags, command, args) {
    if (isOPlonkBot(command)) {
        OPlonkBot(channel);

    } else if (isMic(command)) {
        mic(channel);

    } else if (isInternet(command)) {
        internet(channel);

    } else if (isScreen(command)) {
        screen(channel);

    } else if (isTentacles(command)) {
        tentacles(channel);

    } else if (isToxic(command)) {
        toxic(channel);

    } else if (isShoot(command)) {
        shoot(channel, tags.username, args);
    } else if (isCrossword(command)) {
        crossword(channel)

    } else if (isHydrate(command)) {
        hydrate(channel);
        
    } else if (command === 'bonk') {
        bonk(channel, args);
        
    }
}

function MessageHandler(channel, tags, message) {
    if (isModCheck(message)) {
        modCheck(channel, tags);

    } else if (isChatBlind(message)) {
        chatBlind(channel);

    } else if (isDDReminder(message)) {
        ddReminder(channel);

    } else if (isNotToday(message)) {
        notToday(channel);

    } else if (isAimAssist(message)) {
        aimAssist(channel);

    } else if (isSmort(message)) {
        smort(channel);

    } else if (isStronk(message)) {
        stronk(channel);

    } else if (isRip(message)) {
        rip(channel);

    } else if (isBadaboom(message)) {
        badaboom(channel);

    }
}

/*** Mod Command Handler ***/

//Echo
function isEcho(command) {
    return command === 'echo';
}

function echo(channel, args) {
    client.say(channel, `${args.join(' ')}`);
}

//AddBan
function isAddBan(command) {
    return command === 'addban';
}

function addBan(channel, args) {
    if (args.length == 0) return;

    user = args.shift();
    if (BanManager.IsBanned(user)[0]) return;

    if (args.length != 0)
        reason = args.join(' ');
    else
        reason = '';
    
    let numAlts = BanManager.AddToWatchlist(user, reason);
    client.say(channel, `${user} has been added to the watchlist with ${numAlts} generated alt names.`);
}

//RmBan
function isRmBan(command) {
    return command === 'rmban';
}

function rmBan(channel, args) {
    if (args.length == 0) return;

    user = args.shift();
    BanManager.RmWatchlist(user);
    
    client.say(channel, `${user} has been removed from the watchlist`);
}

//lsAlts
function isLsAlts(command) {
    return command === 'lsalts';
}

function lsAlts(channel, args) {
    if (args.length == 0) return;

    username = args.shift();

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

//isBanned
function isIsBanned(command) {
    return command === 'isbanned';
}

function isBanned(channel, args) {
    if (args.length == 0) return;

    username = args.shift();

    let user = BanManager.GetBannedUser(username);

    if (user !== null)
        client.say(channel, `${username} is on the watchlist. ${user.AccountAlts.length - 1} alts generated for this user.`);
    else
        client.say(channel, `${username} is not on the watchlist.`);
}

//raid
function isRaid(command) {
    return command === 'raid';
}

function raid(channel) {
    client.say(channel, `TombRaid TombRaid Welcome Raiders!! TombRaid TombRaid `);
}

/*** Viewer Command Handler ***/

//oplonkbot
function isOPlonkBot(command) {
    return command === 'oplonkbot';
}

function OPlonkBot(channel) {
    client.say(channel, `I am a bot created by OPlonker1. I am trying to fight the bad bots!! MrDestructoid\n I also add some fun commands GlitchCat  `);
}

//mic
function isMic(command) {
    return command === 'mic';
}

function mic(channel) {
    client.say(channel, `Mic got tired. Have to wake it up. BOP`);
}

//internet
function isInternet(command) {
    return command === 'internet';
}

function internet(channel) {
    client.say(channel, `All the ether is leaking out of the ethernet cables!! panicBasket`);
}

//screen
function isScreen(command) {
    return command === 'screen';
}

function screen(channel) {
    client.say(channel, `I must keep my gameplay secret BrainSlug `);
}

//tentacles
function isTentacles(command) {
    return command === 'tentacles';
}

function tentacles(channel) {
    client.say(channel, `All the tentacles!!!\nSquid1 Squid2 Squid3 Squid2 Squid4`);
}

//toxic
function isToxic(command) {
    return command === 'toxic';
}

function toxic(channel) {
    client.say(channel, `Wait.... is that a ToxicSpud? PJSalt cvHazmat`);
}

//shoot
function isShoot(command) {
    return command === 'shoot';
}

async function shoot(channel, username, args) {
    channel = channel.slice(1, channel.length);

    let viewers = Viewers.GetViewerList(channel);

    let AllViewers = [...viewers.chatters.moderators, ...viewers.chatters.viewers, ...viewers.chatters.broadcaster];

    AllViewers = Viewers.FilterKnownBotsFromList(AllViewers);

    console.log(AllViewers);

    let selectedViewer;
    if (args.length != 0) {

        selectedViewer = args.shift();
        if (user.charAt(0) === '@')
            selectedViewer = selectedViewer.slice(1, selectedViewer.length);
 
    } else {
        let index = Math.floor(Math.random() * AllViewers.length);
        selectedViewer = AllViewers[index];
    }

    if (AllViewers.includes(selectedViewer)) {
        if (selectedViewer == username)
            client.say(channel, `@${username}\'s gun has jammed!!`);
        else if (selectedViewer == process.env.TWITCH_USERNAME)
            client.say(channel, `@${username} has shot at @${selectedViewer}, How rude!!`);
        else
            client.say(channel, `@${username} has shot at @${selectedViewer}`);
    } else {
        client.say(channel, `@${username} has shot at @${selectedViewer}, but they aren't there.`);
    }
}

//crossword
function isCrossword(command) {
    return command === 'crossword';
}

function crossword(channel) {
    client.say(channel, `Crossword is love, Crossword is life. duDudu <3 `);
}

//hydrate
function isHydrate(command) {
    return command === 'hydrate';
}

function hydrate(channel) {
    client.say(channel, `Drink cactus juice!!\n It'll quench ya!!\n Nothing's quenchier!!\n It's the quenchiest!! HSCheers`);
}

//bonk
function isBonk(command) {
    return command === 'bonk';
}

function bonk(channel, args) {
    let str = '';
    if (args.length != 0) {

        let user = args.shift();
        if (user.charAt(0) === '@')
            user = user.slice(1, user.length);
        
        str += `@${user} `;
    }
    
    str += 'Bonk, to jail with you! FootYellow StinkyCheese';
    client.say(channel, str);  
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
    client.say(channel, `Chat blind confirmed`);
}

//ddReminder
function isDDReminder(message) {
    return message === 'ddreminder';
}

function ddReminder(channel) {
    client.say(channel, `"Remind yourself that overconfidence is a slow and insidious killer" - Darkest Dungeon`);
}

//notToday
function isNotToday(message) {
    return message === 'not today';
}

function notToday(channel) {
    client.say(channel, `"Many Fall In The Face Of Chaos, But Not This One. Not Today." - Darkest Dungeon`);
}

//aimAssist
function isAimAssist(message) {
    return message === 'aim assist';
}

function aimAssist(channel) {
    client.say(channel, `My aim is usually better than this I swear, too much aim assist in this game!`);
}

//smort
function isSmort(message) {
    return message === 'smort';
}

function smort(channel) {
    client.say(channel, `That's a lot of brain cells!`);
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
    return message.includes('rip ') || message.includes(' rip') || message == 'rip';
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