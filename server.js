require('dotenv').config();
const tmi = require('tmi.js');

const options = {
    options: { debug: true },

    connection: {
        reconnect: true,
        secure: true
    },

    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_PASSWORD
    },

    channels: [process.env.TARGET_CHANNEL]
};

const client = new tmi.client(options);

const CMDstart = process.env.COMMAND_START;

client.on('connected', ( address, port ) => {
    client.action( process.env.TARGET_CHANNEL, 'OPlonkBot has started.' );
});

client.connect();

client.on('join', (channel, username, self) => {
    if (self) return;

    console.log(username);
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    if (message.startsWith(CMDstart))
        CommandHandler(channel, tags, message);
    else
        MessageHandler(channel, tags, message);
});

function CommandHandler(channel, tags, message) {
	const args = message.slice( CMDstart.length ).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'echo') {
		client.say(channel, `@${tags.username}, you said: "${args.join(' ')}"`);
	}
}

function MessageHandler(channel, tags, message) {
    if (message.toLowerCase() === 'modcheck')
        client.say(channel, `@${tags.username} modCheck? Do you really want to incur the wrath of the all powerful mods?`);
}