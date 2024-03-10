// skills.js located in ./skills

// botData
const { getBotData } = require('./botData/getBotData.js');
const { setSpawn } = require('./botData/setSpawn.js');
const { wipeBotMemory } = require('./botData/wipeBotMemory.js');

// botSpawn
const { spawnBot } = require('./botSpawn/spawnBot.js');
const { despawnBot } = require('./botSpawn/despawnBot.js');
const { deleteBot } = require('./botSpawn/deleteBot.js');

// crafting
const { craftCraftingTable } = require('./crafting/craftCraftingTable.js');
const { craftPlanks } = require('./crafting/craftPlanks.js');
const { craftSticks } = require('./crafting/craftSticks.js');
const { craftWoodenPickaxe } = require('./crafting/craftWoodenPickaxe.js');

// inventory
const { queryInventory } = require('./inventory/queryInventory.js');
const { storeInventory } = require('./inventory/storeInventory.js');

// mining
const { harvestGrass } = require('./mining/harvestGrass.js');
const { harvestTree } = require('./mining/harvestTree.js');

// navigation
const { come } = require('./navigation/come.js');
const { teleportToWaypoint } = require('./navigation/teleportToWaypoint.js');

// terraforming
const { levelTerrain } = require('./terraforming/levelTerrain.js');

// waypoints
const { setWaypoint } = require('./waypoints/setWaypoint.js');
const { delWaypoint } = require('./waypoints/delWaypoint.js');
const { getWaypoint } = require('./waypoints/getWaypoint.js');
const { listWaypoints } = require('./waypoints/listWaypoints.js');

async function spawnBotWrapper(_, botName, botType) {
    await spawnBot(_, botName, botType, skillFunctions);
}

const skillFunctions = {
    // botData
    getBotData,
    setSpawn,
    wipeBotMemory,

    // botSpawn
    "spawnBot": spawnBotWrapper,
    despawnBot,
    deleteBot,

    // crafting
    craftCraftingTable,
    craftPlanks,
    craftSticks,
    craftWoodenPickaxe,

    // inventory
    queryInventory,
    storeInventory,

    // mining
    harvestGrass,
    harvestTree,

    // navigation
    come,
    teleportToWaypoint,

    // terraforming
    levelTerrain,

    // waypoints
    setWaypoint,
    delWaypoint,
    getWaypoint,
    listWaypoints,
};

module.exports = {
    skillFunctions
};
