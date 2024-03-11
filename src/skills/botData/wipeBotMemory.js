// wipeBotMemory.js located in ./skills/botData

const { resetGPTThread } = require('../../bots/gpt.js');
const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

async function wipeBotMemory(bot) {
    try {
        await resetGPTThread(bot);
        return returnSkillSuccess();
        
    } catch (error) {
        console.error(error.message, error.stack);
        return returnSkillError(`Failed to wipe bot memory: error=${error.message}`);
    }
}

module.exports = {
    wipeBotMemory
};
