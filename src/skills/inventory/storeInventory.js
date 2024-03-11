// storeInventory.js located in ./skills/inventory

const { goNear } = require('../navigation/goNear.js');
const Vec3 = require('vec3');
const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

async function storeInventory(bot) {
    // Find the nearest chest within a specified radius
    const chestBlock = bot.findBlock({
        point: bot.entity.position,
        matching: block => block.name === 'chest',
        maxDistance: 64,
        minCount: 1,
    });

    if (!chestBlock) {
        return returnSkillError("No chest found within range.");
    }

    // Convert the chest block position to Vec3 for goNear
    const chestPosition = new Vec3(chestBlock.position.x, chestBlock.position.y, chestBlock.position.z);

    // Go near the chest
    await goNear(bot, chestPosition);

    // Open the chest
    const chest = await bot.openChest(chestBlock);
    console.log("INFO: Chest opened.");

    // Deposit each inventory item into the chest
    for (const item of bot.inventory.items()) {
        try {
            await chest.deposit(item.type, null, item.count);
            console.log(`INFO: Deposited ${item.count} of ${item.name}.`);
        } catch (err) {
            // Attempt to close the chest before exiting the function due to an error
            await chest.close();

            console.error(err.stack);
            return returnSkillError(`Failed to deposit ${item.name}: ${err.message}`);
        }
    }

    // Read the chest contents after depositing items
    const chestContents = {};
    chest.containerItems().forEach(item => {
        if (chestContents[item.name]) {
            chestContents[item.name] += item.count;
        } else {
            chestContents[item.name] = item.count;
        }
    });

    // Close the chest after depositing items
    await chest.close();
    console.log("INFO: Chest closed.");

    return returnSkillSuccess({ chestContents });
}

module.exports = {
    storeInventory
};
