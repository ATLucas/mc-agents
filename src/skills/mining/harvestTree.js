// harvestTree.js located in ./skills/mining

const { digBlock } = require('./digBlock.js');
const { goNear } = require('../navigation/goNear.js');
const { goTo } = require('../navigation/goTo.js');
const { queryInventory } = require('../inventory/queryInventory.js');
const { sleep } = require('../../utils/utils.js');
const { returnSkillError } = require('../../utils/utils.js');
const Vec3 = require('vec3');

const LOG_BLOCKS = ['oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'dark_oak_log'];

async function harvestTree(bot) {

    // Find the closest tree
    const treeBase = await findClosestTree(bot);
    if (!treeBase) {
        return returnSkillError("No tree found within range.");
    }

    // Go to the tree
    await goNear(bot, treeBase);

    // Harvest the tree
    const droppedItems = [];
    await harvestAdjacentTreeBlocks(bot, droppedItems, treeBase);

    // Wait for last item to fall to the ground.
    await sleep(1000);

    // Collect the dropped logs
    for (const item of droppedItems) {
        await goTo(bot, item.position);
    }
    
    return queryInventory(bot);
}

async function findClosestTree(bot) {
    const treeBlocks = LOG_BLOCKS;
    const maxDistance = 64; // Maximum search radius for trees
    const block = bot.findBlock({
        point: bot.entity.position,
        matching: block => treeBlocks.includes(block.name),
        maxDistance: maxDistance,
        minCount: 1,
    });

    if (block) {
        // Return the base of the tree (assuming the lowest log block is the base)
        return new Vec3(block.position.x, block.position.y, block.position.z);
    } else {
        // Return null if no tree is found within the search radius
        return null;
    }
}

async function harvestAdjacentTreeBlocks(bot, droppedItems, position, visited = new Set()) {

    const directions = [];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                directions.push(new Vec3(dx, dy, dz));
            }
        }
    }

    for (const direction of directions) {
        const newPos = position.clone().add(direction);
        const key = newPos.toString();

        if (!visited.has(key)) {
            visited.add(key);
            const block = bot.blockAt(newPos);
            if (block && LOG_BLOCKS.includes(block.name)) {
                // Harvest the log
                await goNear(bot, block.position);
                const result = await digBlock(bot, block);
                if (result.success && result.droppedItem) {
                    droppedItems.push(result.droppedItem);
                }

                // Continue harvesting
                await harvestAdjacentTreeBlocks(bot, droppedItems, newPos, visited);
            }
        }
    }
}

module.exports = {
    harvestTree
};
