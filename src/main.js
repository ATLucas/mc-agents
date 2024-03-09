// main.js located in ./

const fs = require('fs');
const path = require('path');
const { worldBotUsername } = require('./config.js');
const { skillFunctions } = require('./skills/skills.js');
const { spawnBot } = require('./skills/botSpawn/spawnBot.js');

async function spawnAllBots() {

    const botsDataDir = path.join(__dirname, 'data/bots');

    try {
        // Read the list of bot data files
        const files = fs.readdirSync(botsDataDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        if (jsonFiles.length === 0) {
            // If no JSON files are found, spawn the world bot
            await spawnBot(null, worldBotUsername, skillFunctions);
            return;
        }

        for (const file of jsonFiles) {
            const botName = path.basename(file, '.json');
            await spawnBot(null, botName, skillFunctions);
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Directory not found, spawn world bot
            await spawnBot(null, worldBotUsername, skillFunctions);
        } else {
            // Log other errors
            console.error(error.message, error.stack);
        }
    }
}

(async () => {
    await spawnAllBots();
})();