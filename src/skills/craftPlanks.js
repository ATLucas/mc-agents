// craftPlanks.js located in ./skills

const { queryInventory } = require('./queryInventory');

async function craftPlanks(bot) {
    const logTypes = ['oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'dark_oak_log'];
    let logItem = null;

    // Check if the bot has any type of logs in its inventory
    for (const logType of logTypes) {
        logItem = bot.inventory.items().find(item => item.name.includes(logType));
        if (logItem) {
            break; // Found a log, exit loop
        }
    }

    // If no logs found, return failure
    if (!logItem) {
        return { success: false, error: 'No logs found in inventory.' };
    }

    try {
        // Find the recipe for planks
        const recipe = bot.recipesFor(bot.mcData.itemsByName["oak_planks"].id, null, 1, logItem)[0];
        if (!recipe) {
            return { success: false, error: 'No recipe found for planks.' };
        }

        // Craft the planks
        await bot.craft(recipe, 1, null); // Crafts one set of planks (usually 4 planks)
        return { success: true, inventory: queryInventory(bot) };
    } catch (error) {
        // Return error if crafting fails
        return { success: false, error: `Error crafting planks: ${error.stack}` };
    }
}

module.exports = {
    craftPlanks
};
