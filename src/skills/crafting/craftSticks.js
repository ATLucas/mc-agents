// craftSticks.js located in ./skills/crafting

const { returnSkillError } = require('../../utils/utils.js');

const STICKS_PER_SET = 4;
const REQUIRED_PLANKS = 2;

async function craftSticks(bot, count=STICKS_PER_SET) {
    // Check if the bot has the necessary items to craft sticks (2 wooden planks for 4 sticks)
    const requiredPlanks = Math.ceil(count / STICKS_PER_SET) * REQUIRED_PLANKS;
    const plankItem = bot.inventory.items().find(item => item.name.includes('plank'));

    if (!plankItem || plankItem.count < requiredPlanks) {
        let plankCount = 0;
        if (plankItem) {
            plankCount = plankItem.count;
        }
        return returnSkillError(`Insufficient wooden planks to craft ${count} sticks: ${plankCount} planks available`);
    }

    // Get the stick recipe
    const sticksRecipe = bot.recipesFor(bot.mcData.itemsByName.stick.id)[0];
    if (!sticksRecipe) {
        return returnSkillError("No recipe found for sticks.");
    }

    // Calculate how many times the bot needs to craft to get the desired number of sticks
    const craftSets = Math.ceil(count / STICKS_PER_SET);

    // Attempt to craft the sticks
    try {
        await bot.craft(sticksRecipe, craftSets, null);
        return queryInventory(bot);
    } catch (error) {
        // Return error if crafting fails
        console.error(error.stack);
        return returnSkillError(`Error crafting sticks: ${error.message}`);
    }
}

module.exports = {
    craftSticks
};
