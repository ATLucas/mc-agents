// bots.js located in ./bots

const fs = require('fs');
const path = require('path');
const mineflayer = require('mineflayer');
const { botConfig, worldBotUsername } = require('../config.js');

const botRegistry = {};

function getBot(botName) {
    return botRegistry[botName];
}

async function spawnAllBots(onBotSpawn, onBotChat) {

    const botsDataDir = path.join(__dirname, '../data/bots');

    try {
        const files = fs.readdirSync(botsDataDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        if (jsonFiles.length === 0) {
            // If no JSON files are found, spawn the world bot
            await spawnBot(worldBotUsername, onBotSpawn, onBotChat);
            return;
        }

        for (const file of jsonFiles) {
            const botName = path.basename(file, '.json');
            await spawnBot(botName, onBotSpawn, onBotChat);
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Directory not found, spawn world bot
            await spawnBot(worldBotUsername, onBotSpawn, onBotChat);
        } else {
            // Log other errors
            console.error(error.message, error.stack);
        }
    }
}

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

// TODO: async function despawnBot(botName)

// TODO: async function deleteBot(botName)

module.exports = {
    getBot,
    spawnAllBots,
    spawnBot,
};
