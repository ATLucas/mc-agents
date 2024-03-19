// utils.js located in ./utils

const fs = require('fs');
const path = require('path');
const { getBot } = require('../bots/registry.js');
const { playerName, worldBotUsername } = require('../config.js');

function getPlayer() {
    return getWorldBot().players[playerName]?.entity;
}

function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

function getWorldBot() {
    return getBot(worldBotUsername);
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

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
}

function writeJsonFile(filePath, content) {
    const directoryPath = path.dirname(filePath);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), { encoding: 'utf8' });
}

module.exports = {
    getPlayer,
    isAlphanumeric,
    getWorldBot,
    isWorldBot,
    returnSkillError,
    returnSkillSuccess,
    sleep,
    fileExists,
    readJsonFile,
    writeJsonFile,
};