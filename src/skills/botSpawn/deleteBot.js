// deleteBot.js located in ./skills/botSpawn

const { deleteGPTAssistant } = require('../../bots/gpt.js');
const { getBot } = require('../../bots/registry.js');
const { despawnBot } = require('./despawnBot.js');
const { deleteBotData } = require('../botData/deleteBotData.js');
const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

async function deleteBot(_, botName) {
    try {
        const bot = getBot(botName);

        if (!bot) {
            return returnSkillError(`Bot does not exist: bot=${botName}`);
        }

        // First delete the bot's data
        await deleteGPTAssistant(bot);
        await deleteBotData(bot);
    
        // And then despawn
        await despawnBot(_, botName);
        return returnSkillSuccess();
        
    } catch (error) {
        console.error(error.message, error.stack);
        return returnSkillError(`Failed to delete bot: bot=${botName}, error=${error.message}`);
    }
}

module.exports = {
    deleteBot
};
