// skills.js located in ./skills

// bots
const { getBotData } = require('./bots/getBotData.js');
const { setSpawn } = require('./bots/setSpawn.js');

// building
const { levelTerrain } = require('./building/levelTerrain.js');

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

// waypoints
const { setWaypoint } = require('./waypoints/setWaypoint.js');
const { delWaypoint } = require('./waypoints/delWaypoint.js');
const { getWaypoint } = require('./waypoints/getWaypoint.js');
const { listWaypoints } = require('./waypoints/listWaypoints.js');

const skillFunctions = {
    // bots
    getBotData,
    setSpawn,

    // building
    levelTerrain,

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

    // waypoints
    setWaypoint,
    delWaypoint,
    getWaypoint,
    listWaypoints,
};

module.exports = {
    skillFunctions
};
