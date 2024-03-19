// craftPlanks.js located in ./skills/crafting

const { queryInventory } = require('../inventory/queryInventory.js');
const { returnSkillError } = require('../../utils/utils.js');

const PLANKS_PER_SET = 4;
const LOG_TO_PLANK = {
    'oak_log': 'oak_planks',
    'spruce_log': 'spruce_planks',
    'birch_log': 'birch_planks',
    'jungle_log': 'jungle_planks',
    'acacia_log': 'acacia_planks',
    'dark_oak_log': 'dark_oak_planks',
}

async function craftPlanks(bot, count=PLANKS_PER_SET) {

    let logItem = null;
    let plankName = null;

    // Check if the bot has any type of logs in its inventory and determine corresponding plank type
    for (const [logType, plankType] of Object.entries(LOG_TO_PLANK)) {
        logItem = bot.inventory.items().find(item => item.name === logType);
        if (logItem) {
            plankName = plankType; // Set the corresponding plank name
            break; // Found a log, exit loop
        }
    }

    // If no logs found, return failure
    if (!logItem || !plankName) {
        return returnSkillError("No suitable logs found in inventory.");
    }

    // Calculate how many sets of planks
    const craftSets = Math.ceil(count / PLANKS_PER_SET);

    console.log(`Crafting ${craftSets} sets of planks.`);

    try {
        // Find the recipe for the corresponding planks
        const recipe = bot.recipesFor(bot.mcData.itemsByName[plankName].id, null, craftSets, logItem)[0];
        if (!recipe) {
            return returnSkillError(`No recipe found to craft ${craftSets} sets of planks.`);
        }

        // Craft the planks
        await bot.craft(recipe, craftSets, null);

        return queryInventory(bot);
    } catch (error) {
        // Return error if crafting fails
        console.error(error.stack);
        return returnSkillError(`Error crafting ${craftSets} sets of ${plankName}: ${error}`);
    }
}

module.exports = {
    craftPlanks
};
