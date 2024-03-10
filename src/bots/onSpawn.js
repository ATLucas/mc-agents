// onSpawn.js located in ./bots

const { pathfinder, Movements } = require('mineflayer-pathfinder');

const { createGPTAssistant } = require('./gpt.js');
const { getBotData } = require('../skills/botData/getBotData.js');
const { setSpawn } = require('../skills/botData/setSpawn.js');
const { writeBotData } = require('../skills/botData/writeBotData.js');
const { teleportToWaypoint } = require('../skills/navigation/teleportToWaypoint.js');
const { setWaypoint } = require('../skills/waypoints/setWaypoint.js');

async function onSpawn(bot, botType) {
    console.log(`Bot spawned: bot=${bot.username}`);

    // Mineflayer setup
    bot.loadPlugin(pathfinder);
    const defaultMove = new Movements(bot, require('minecraft-data')(bot.version));
    bot.pathfinder.setMovements(defaultMove);
    bot.mcData = require('minecraft-data')(bot.version);

    // Bot data
    let result = await getBotData(bot);

    if (!result.success) {
        // First time this bot has spawned (no data yet)

        if (!botType) {
            console.error("Bot type not specified");
            return;
        }

        // Write bot type
        await writeBotData(bot, { botType });

        // Create the default spawn waypoint for the new bot
        // using the player's current position
        const spawnWaypointName = `${bot.username}BotSpawn`;
        result = await setWaypoint(bot, spawnWaypointName);

        if (!result.success) {
            console.error(`Failed to create spawn waypoint: ${JSON.stringify(result)}`);
            return;
        }

        // Set spawn for the bot to the default
        result = await setSpawn(bot, spawnWaypointName);

        if (!result.success) {
            console.error(`Failed to set bot's spawn: ${JSON.stringify(result)}`);
            return;
        }
    } else if (botType && botType != result.botData.botType) {
        console.warning(
            "Specified spawn bot type, but bot already has a different type: " +
            `requested=${botType}, actual=${result.botData.botType}`
        );
    } else {
        botType = result.botData.botType;
    }

    // Save the bot type for easy access
    console.log(`Bot type: bot=${bot.username}, botType=${botType}`);
    bot.botType = botType;

    result = await getBotData(bot);

    if (!result.success) {
        console.error(`Failed to get bot data: ${JSON.stringify(result)}`);
        return;
    }

    await createGPTAssistant(bot, result.botData);
    await teleportToWaypoint(bot, result.botData.spawnWaypoint);
}

module.exports = {
    onSpawn,
};
