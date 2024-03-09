// craftWoodenPickaxe.js located in ./skills/crafting

const { goNear } = require('../navigation/goNear.js');
const { returnSkillError } = require('../../utils/utils.js');

const REQUIRED_PLANKS = 3;
const REQUIRED_STICKS = 2;
const PLANK_TYPES = ['oak_planks', 'spruce_planks', 'birch_planks', 'jungle_planks', 'acacia_planks', 'dark_oak_planks'];

async function craftWoodenPickaxe(bot) {
    // Find any plank type with enough quantity in inventory
    let sufficientPlankItem = bot.inventory.items().find(item => PLANK_TYPES.includes(item.name) && item.count >= REQUIRED_PLANKS);

    if (!sufficientPlankItem) {
        return returnSkillError(`Insufficient planks to craft a wooden pickaxe. Need: ${REQUIRED_PLANKS}`);
    }

    // Check that bot has enough sticks
    let sufficientSticksItem = bot.inventory.items().find(item => item.name == "stick" && item.count >= REQUIRED_STICKS);

    if (!sufficientSticksItem) {
        return returnSkillError(`Insufficient sticks to craft a wooden pickaxe. Need: ${REQUIRED_STICKS}`);
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

    // Get the wooden pickaxe recipe
    const woodenPickaxeRecipe = bot.recipesFor(bot.mcData.itemsByName.wooden_pickaxe.id, null, 1, craftingTableBlock)[0];
    if (!woodenPickaxeRecipe) {
        return returnSkillError("No recipe found for wooden pickaxe.");
    }

    // Attempt to craft the wooden pickaxe
    try {
        await bot.craft(woodenPickaxeRecipe, 1, craftingTableBlock);
        return returnSkillSuccess();
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to craft wooden pickaxe: ${error.message}`);
    }
}

module.exports = {
    craftWoodenPickaxe
};
