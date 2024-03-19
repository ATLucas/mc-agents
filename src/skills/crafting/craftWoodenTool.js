// craftWoodenTool.js located in ./skills/crafting

const { goNear } = require('../navigation/goNear.js');
const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

const WOODEN_ITEMS = {
    wooden_axe: { planks: 3, sticks: 2 },
    wooden_pickaxe: { planks: 3, sticks: 2 },
    wooden_shovel: { planks: 1, sticks: 2 },
    wooden_sword: { planks: 2, sticks: 1 },
    wooden_hoe: { planks: 2, sticks: 2 }
};

async function craftWoodenTool(bot, itemName) {
    if (!WOODEN_ITEMS.hasOwnProperty(itemName)) {
        return returnSkillError(`Invalid wooden item name: ${itemName}`);
    }

    const { planks: requiredPlanks, sticks: requiredSticks } = WOODEN_ITEMS[itemName];

    // Check for required planks and sticks in inventory
    let sufficientPlankItem = bot.inventory.items().find(item => item.name.endsWith('_planks') && item.count >= requiredPlanks);
    let sufficientSticksItem = bot.inventory.items().find(item => item.name == "stick" && item.count >= requiredSticks);

    if (!sufficientPlankItem) {
        return returnSkillError(`Insufficient planks to craft ${itemName}. Need: ${requiredPlanks}`);
    }

    if (!sufficientSticksItem) {
        return returnSkillError(`Insufficient sticks to craft ${itemName}. Need: ${requiredSticks}`);
    }

    // Find the nearest crafting table within a specified radius
    const craftingTableBlock = bot.findBlock({
        point: bot.entity.position,
        matching: bot.mcData.blocksByName.crafting_table.id,
        maxDistance: 64,
        minCount: 1,
    });

    if (!craftingTableBlock) {
        return returnSkillError("No crafting table found within range.");
    }

    // Go near the crafting table
    await goNear(bot, craftingTableBlock.position);

    // Get the recipe for the requested wooden item
    const itemRecipe = bot.recipesFor(bot.mcData.itemsByName[itemName].id, null, 1, craftingTableBlock)[0];
    if (!itemRecipe) {
        return returnSkillError(`No recipe found for ${itemName}.`);
    }

    // Attempt to craft the wooden item
    try {
        await bot.craft(itemRecipe, 1, craftingTableBlock);
        return returnSkillSuccess();
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to craft ${itemName}: ${error.message}`);
    }
}

module.exports = {
    craftWoodenTool
};
