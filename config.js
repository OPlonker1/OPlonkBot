require('dotenv').config();

/**
 * @typedef EnvironmentConfiguration
 * @prop {string} COMMAND_START Character set used to denote a command.
 * @prop {string} TWITCH_USERNAME Client Username for the Twitch app.
 * @prop {string} TWITCH_PASSWORD Client OAuth Code for the Twitch app.
*/

/**
 * @type {EnvironmentConfiguration}
 */
const config = {
    ...process.env,
};

module.exports = config;