// bots.js located in ./bots

const mineflayer = require('mineflayer');
const { onBotChat } = require('./chat.js');
const { onBotSpawn } = require('./spawn.js');

const botRegistry = {};

async function spawnBot(botConfig) {
    try {
        const bot = mineflayer.createBot(botConfig);

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

        botRegistry[botConfig.username] = bot;
    } catch (error) {
        console.error(error.message, error.stack);
    }
}

async function getBot(botName) {
    return botRegistry[botName];
}

module.exports = {
    spawnBot,
    getBot,
};
