// utils.js located in ./

const { playerName, worldBotUsername } = require('./config.js');

function getPlayer(bot) {
    return bot.players[playerName]?.entity;
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
    isWorldBot,
    returnSkillError,
    returnSkillSuccess,
    sleep,
};