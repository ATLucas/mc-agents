// utils.js located in ./

const { playerName, worldBotUsername } = require('./config.js');

function getPlayer(bot) {
    return bot.players[playerName]?.entity;
}

function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

function isWorldBot(bot) {
    return bot.username == worldBotUsername;
}

function returnSkillError(errMsg) {
    return {success: false, error: errMsg};
}

function returnSkillSuccess(data) {
    return {success: true, ...data};
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    getPlayer,
    isAlphanumeric,
    isWorldBot,
    returnSkillError,
    returnSkillSuccess,
    sleep,
};