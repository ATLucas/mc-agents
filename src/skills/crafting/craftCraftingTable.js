// craftCraftingTable.js located in ./skills/crafting

const { returnSkillError, returnSkillSuccess } = require('../../utils.js');

async function craftCraftingTable(bot) {
    // Check if the bot has the necessary items to craft a crafting table (4 wooden planks)
    const plankItem = bot.inventory.items().find(item => item.name.includes('plank'));
    if (!plankItem || plankItem.count < 4) {
        let plankCount = 0;
        if (plankItem) {
            plankCount = plankItem.count;
        }
        return returnSkillError(`Insufficient wood planks to craft a crafting table: ${plankCount}`);
    }

    // Get the crafting table recipe
    const craftingTableRecipe = bot.recipesFor(bot.mcData.itemsByName.crafting_table.id)[0];
    if (!craftingTableRecipe) {
        return returnSkillError("No recipe found for crafting table.");
    }

    // Attempt to craft the crafting table
    try {
        await bot.craft(craftingTableRecipe, 1, null);
        console.log("Crafted a crafting table.");
        return returnSkillSuccess();
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Error crafting crafting table: ${error}`);
    }
}

module.exports = {
    craftCraftingTable
};
