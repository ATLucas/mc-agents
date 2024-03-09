// writeBotData.js located in ./skills/bots

const path = require('path');
const { returnSkillError, returnSkillSuccess, fileExists, readJsonFile, writeJsonFile } = require('../../utils.js');

async function writeBotData(bot, data) {

    // Define the path for the bot-specific data file
    const botDataFilePath = path.join(__dirname, '..', '..', 'data', 'bots', `${bot.username}.json`);

    let oldBotData;
    try {
        // Read existing data from the bot's file, or start with an empty object if the file doesn't exist
        oldBotData = fileExists(botDataFilePath) ? readJsonFile(botDataFilePath) : {};
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to read bot data file: ${error.message}`);
    }

    // Save the updated data back to the bot's data file
    writeJsonFile(botDataFilePath, {...oldBotData, ...data});

    return returnSkillSuccess();
}

module.exports = {
    writeBotData
};
