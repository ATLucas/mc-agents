// main.js located in ./

const { spawnAllBots } = require('./bots/bots.js');
const { onBotChat } = require('./bots/chat.js');
const { onBotSpawn } = require('./bots/spawn.js');

(async () => {
    await spawnAllBots(onBotSpawn, onBotChat);
})();