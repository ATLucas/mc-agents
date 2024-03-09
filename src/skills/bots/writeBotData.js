// writeBotData.js located in ./skills/bots

const fs = require('fs');
const path = require('path');
const { returnSkillError, returnSkillSuccess } = require('../../utils.js');

async function writeBotData(bot, data) {

    // Define the path for the bot-specific data file
    const botDataFilePath = path.join(__dirname, '..', '..', 'data', 'bots', `${bot.username}.json`);

    let oldBotData;
    try {
        // Read existing data from the bot's file, or start with an empty object if the file doesn't exist
        oldBotData = fs.existsSync(botDataFilePath) ?
            JSON.parse(fs.readFileSync(botDataFilePath, { encoding: 'utf8' })) :
            {};
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to read bot data file: ${error.message}`);
    }

    // Save the updated data back to the bot's data file
    fs.writeFileSync(
        botDataFilePath,
        JSON.stringify({...oldBotData, ...data}, null, 2),
        { encoding: 'utf8' }
    );

    return returnSkillSuccess();
}

module.exports = {
    writeBotData
};
