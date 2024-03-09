// spawn.js located in ./bots

const { pathfinder, Movements } = require('mineflayer-pathfinder');

const { createGPTAssistant } = require('./gpt.js');
const { getBotData } = require('../skills/bots/getBotData.js');
const { setSpawn } = require('../skills/bots/setSpawn.js');
const { teleportToWaypoint } = require('../skills/navigation/teleportToWaypoint.js');
const { setWaypoint } = require('../skills/waypoints/setWaypoint.js');

async function onBotSpawn(bot) {
    console.log(`@${bot.username} has spawned.`);

    // Mineflayer setup
    bot.loadPlugin(pathfinder);
    const defaultMove = new Movements(bot, require('minecraft-data')(bot.version));
    bot.pathfinder.setMovements(defaultMove);
    bot.mcData = require('minecraft-data')(bot.version);

    // Bot data
    let result = await getBotData(bot);

    if (!result.success) {
        // First time this bot has spawned (no data yet)

        const spawnWaypointName = `${bot.username}BotSpawn`;
        
        // Create the default spawn waypoint for the new bot
        // using the player's current position
        result = await setWaypoint(bot, "spawn", spawnWaypointName);

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
    }

    result = await getBotData(bot);

    if (!result.success) {
        console.error(`Failed to get bot data: ${JSON.stringify(result)}`);
        return;
    }

    await createGPTAssistant(bot, result.botData);
    await teleportToWaypoint(bot, result.botData.spawnWaypoint);
}

module.exports = {
    onBotSpawn,
};
