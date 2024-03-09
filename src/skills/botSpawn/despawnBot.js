// despawnBot.js located in ./skills/botSpawn

const { getBot, unregisterBot } = require('../../bots/registry.js');
const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

async function despawnBot(_, botName) {
    try {
        const bot = getBot(botName);

        if (!bot) {
            return returnSkillError(`Bot does not exist: bot=${botName}`);
        }

        bot.end();
        unregisterBot(botName);
        return returnSkillSuccess();
    } catch (error) {
        console.error(error.message, error.stack);
        return returnSkillError(`Failed to despawn bot: bot=${botName}, error=${error.message}`);
    }
}

module.exports = {
    despawnBot
};
