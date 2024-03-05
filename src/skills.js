// skills.js located in ./

const { come } = require('./skills/come.js');
const { queryInventory } = require('./skills/queryInventory.js');
const { storeInventory } = require('./skills/storeInventory.js');
const { harvestTree } = require('./skills/harvestTree.js');
const { craftPlanks } = require('./skills/craftPlanks.js');

const skillFunctions = {
    come,
    queryInventory,
    storeInventory,
    harvestTree,
    craftPlanks,
};

module.exports = {
    skillFunctions
};
