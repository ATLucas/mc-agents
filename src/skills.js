// skills.js located in ./

// bots
const { getBotData } = require('./skills/bots/getBotData.js');
const { setSpawn } = require('./skills/bots/setSpawn.js');

// building
const { levelTerrain } = require('./skills/building/levelTerrain.js');

// crafting
const { craftCraftingTable } = require('./skills/crafting/craftCraftingTable.js');
const { craftPlanks } = require('./skills/crafting/craftPlanks.js');
const { craftSticks } = require('./skills/crafting/craftSticks.js');
const { craftWoodenPickaxe } = require('./skills/crafting/craftWoodenPickaxe.js');

// inventory
const { queryInventory } = require('./skills/inventory/queryInventory.js');
const { storeInventory } = require('./skills/inventory/storeInventory.js');

// mining
const { harvestGrass } = require('./skills/mining/harvestGrass.js');
const { harvestTree } = require('./skills/mining/harvestTree.js');

// navigation
const { come } = require('./skills/navigation/come.js');
const { teleportToWaypoint } = require('./skills/navigation/teleportToWaypoint.js');

// waypoints
const { setWaypoint } = require('./skills/waypoints/setWaypoint.js');
const { delWaypoint } = require('./skills/waypoints/delWaypoint.js');
const { getWaypoint } = require('./skills/waypoints/getWaypoint.js');
const { listWaypoints } = require('./skills/waypoints/listWaypoints.js');

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
