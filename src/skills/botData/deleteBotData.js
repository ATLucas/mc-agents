// deleteBotData.js located in ./skills/botData

const fs = require('fs');
const path = require('path');
const { returnSkillError, returnSkillSuccess, fileExists } = require('../../utils/utils.js');

async function deleteBotData(bot) {
    // Define the path for the bot-specific data file
    const botDataFilePath = path.join(__dirname, '..', '..', 'data', 'bots', `${bot.username}.json`);

    try {
        // Ensure the bot's data file exists before attempting to delete
        if (!fileExists(botDataFilePath)) {
            return returnSkillError('No bot data file exists to delete.');
        }

        // Delete the bot's data file
        fs.unlinkSync(botDataFilePath);

    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to delete bot data file: ${error.message}`);
    }

    return returnSkillSuccess();
}

module.exports = {
    deleteBotData
};
