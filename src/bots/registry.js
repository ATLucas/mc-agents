// registry.js located in ./bots

const botRegistry = {};

function registerBot(botName, bot) {
    botRegistry[botName] = bot;
}

function getBot(botName) {
    return botRegistry[botName];
}

function unregisterBot(botName) {
    delete botRegistry[botName];
}

module.exports = {
    registerBot,
    getBot,
    unregisterBot,
};