// main.js located in ./

const { worldBotUsername } = require('./config.js');
const { spawnBot } = require('./bots/bots.js');
const { onBotChat } = require('./bots/chat.js');
const { onBotSpawn } = require('./bots/spawn.js');

// Spawn the world bot
(async () => {
    await spawnBot(worldBotUsername, onBotSpawn, onBotChat);
})();