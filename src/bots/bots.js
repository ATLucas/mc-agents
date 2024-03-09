// bots.js located in ./bots

const mineflayer = require('mineflayer');
const { botConfig } = require('../config.js');

const botRegistry = {};

// TODO: async function spawnAllBots(onBotSpawn, onBotChat) // NOTE: If none exist, spawn the world bot

async function spawnBot(botName, onBotSpawn, onBotChat) {
    try {
        const bot = mineflayer.createBot({username: botName, ...botConfig});

        bot.on('spawn', async () => {
            try {
                await onBotSpawn(bot);
            } catch (error) {
                console.error(error.message, error.stack);
            }
        });

        bot.on('chat', async (username, message) => {
            try {
                await onBotChat(bot, username, message);
            } catch (error) {
                console.error(error.message, error.stack);
            }
        });

        botRegistry[botName] = bot;
    } catch (error) {
        console.error(error.message, error.stack);
    }
}

function getBot(botName) {
    return botRegistry[botName];
}

// TODO: async function despawnBot(botName)

// TODO: async function deleteBot(botName)

module.exports = {
    spawnBot,
    getBot,
};
