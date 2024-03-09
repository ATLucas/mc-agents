// main.js located in ./

const { spawnBot } = require('./bots/bots.js');
const { botConfig, worldBotUsername } = require('./config.js');

// Spawn the world bot
(async () => {
    await spawnBot({username: worldBotUsername, ...botConfig});
})();