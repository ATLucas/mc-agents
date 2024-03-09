// spawnBot.js located in ./skills/botSpawn

const mineflayer = require('mineflayer');
const { botConfig } = require('../../config.js');
const { onChat } = require('../../bots/onChat.js');
const { onSpawn } = require('../../bots/onSpawn.js');
const { registerBot } = require('../../bots/registry.js');
const { isAlphanumeric, returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

async function spawnBot(_, botName, skillFunctions) {
    try {
        if (!isAlphanumeric(botName)) {
            return returnSkillError(`Bot name is not alphanumeric: bot=${botName}`);
        }

        const bot = mineflayer.createBot({username: botName, ...botConfig});

        bot.on('spawn', async () => {
            try {
                await onSpawn(bot);
            } catch (error) {
                console.error(error.message, error.stack);
            }
        });

        bot.on('chat', async (username, message) => {
            try {
                await onChat(bot, username, message, skillFunctions);
            } catch (error) {
                console.error(error.message, error.stack);
            }
        });

        registerBot(botName, bot);
        return returnSkillSuccess();
    } catch (error) {
        console.error(error.message, error.stack);
        return returnSkillError(`Failed to spawn bot: bot=${botName}, error=${error.message}`);
    }
}

module.exports = {
    spawnBot
};
