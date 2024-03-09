// setSpawn.js located in ./skills/bots

const fs = require('fs');
const path = require('path');
const { returnSkillError, returnSkillSuccess } = require('../../utils.js');

async function setSpawn(bot, waypointName) {
    if (!waypointName) {
        return returnSkillError('Waypoint name not supplied');
    }

    // Define the path for the bot-specific data file
    const botDataFilePath = path.join(__dirname, '..', '..', 'data', 'bots', `${bot.username}.json`);

    let botData;
    try {
        // Read existing data from the bot's file, or start with an empty object if the file doesn't exist
        botData = fs.existsSync(botDataFilePath) ? JSON.parse(fs.readFileSync(botDataFilePath, { encoding: 'utf8' })) : {};
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to read bot data file: ${error.message}`);
    }

    // Update the spawn waypoint name for the bot
    botData.spawnWaypoint = waypointName;

    // Save the updated data back to the bot's data file
    fs.writeFileSync(botDataFilePath, JSON.stringify(botData, null, 2), { encoding: 'utf8' });

    return returnSkillSuccess();
}

module.exports = {
    setSpawn
};
