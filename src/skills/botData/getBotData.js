// getBotData.js located in ./skills/botData

const path = require('path');
const { returnSkillError, returnSkillSuccess, fileExists, readJsonFile } = require('../../utils/utils.js');

async function getBotData(bot) {
    // Define the path for the bot-specific data file
    const botDataFilePath = path.join(__dirname, '..', '..', 'data', 'bots', `${bot.username}.json`);

    let botData;
    try {
        // Ensure the bot's data file exists
        if (!fileExists(botDataFilePath)) {
            return returnSkillError('No bot data found.');
        }

        // Read existing data from the bot's file
        botData = readJsonFile(botDataFilePath);
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to read bot data file: ${error.message}`);
    }

    // Check if there is any data to return
    if (Object.keys(botData).length === 0) {
        return returnSkillError('No bot data has been created.');
    }

    return returnSkillSuccess({ botData });
}

module.exports = {
    getBotData
};
