// wipeBotMemory.js located in ./skills/botData

const { resetGPTThread } = require('../../bots/gpt.js');
const { getBot } = require('../../bots/registry.js');
const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

async function wipeBotMemory(_, botName) {
    try {
        const bot = getBot(botName);

        if (!bot) {
            return returnSkillError(`Bot does not exist: bot=${botName}`);
        }

        await resetGPTThread(bot);
        return returnSkillSuccess();
        
    } catch (error) {
        console.error(error.message, error.stack);
        return returnSkillError(`Failed to delete bot: bot=${botName}, error=${error.message}`);
    }
}

module.exports = {
    wipeBotMemory
};
