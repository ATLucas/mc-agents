// levelTerrain.js located in ./skills/building

const { digBlock } = require('../mining/digBlock.js');
const { goNear } = require('../navigation/goNear.js');
const { goTo } = require('../navigation/goTo.js');
const { sleep } = require('../../utils/utils.js');
const Vec3 = require('vec3');
const { returnSkillSuccess } = require('../../utils/utils.js');

async function levelTerrain(bot, radius=4) {
    // Save the bot's current position
    const botPosition = bot.entity.position.floor();
    const botY = botPosition.y;

    const droppedItems = [];

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
            // Calculate the position to check
            const x = botPosition.x + dx;
            const z = botPosition.z + dz;

            // Gather all blocks higher than surface level
            const blocksToDig = [];
            for (let y = botY + 5; y >= botY; y--) {
                let block = bot.blockAt(new Vec3(x, y, z));
                if (block && block.name !== "air") {
                    blocksToDig.push(block);
                }
            }

            // Dig all blocks stored in blocksToDig array.
            for (const blockToDig of blocksToDig) {
                await goNear(bot, blockToDig);
                const result = await digBlock(bot, blockToDig);
                if (result.success && result.droppedItem) {
                    droppedItems.push(result.droppedItem);
                }
            }

            // After digging, find the new surface level
            let newSurfaceY = botY;
            block = bot.blockAt(new Vec3(x, newSurfaceY, z));
            while (newSurfaceY >= botY - 6 && block.name === "air") {
                newSurfaceY--;
                block = bot.blockAt(new Vec3(x, newSurfaceY, z));
            }

            // If the new surface level is lower than the bot but not more than 3 blocks beneath
            if (newSurfaceY < botY && newSurfaceY >= botY - 3) {
                // Place dirt blocks until the surface is level with the bot's y level
                for (let y = newSurfaceY + 1; y < botY; y++) {
                    const positionToPlace = new Vec3(x, y, z);
                    const referenceBlock = bot.blockAt(positionToPlace.offset(0, -1, 0))
                    const dirtBlock = bot.inventory.items().find(item => item.name === 'dirt');
                    if (dirtBlock) { // Check if we have dirt to place
                        await bot.equip(dirtBlock, 'hand');
                        await bot.placeBlock(referenceBlock, Vec3(0, 1, 0)); // Offset because we place against the block below
                    }
                }
            }
        }
    }

    // Wait for last item to drop
    await sleep(500);

    // Collect the dropped items
    for (const item of droppedItems) {
        await goTo(bot, item.position);
    }

    return returnSkillSuccess();
}

module.exports = {
    levelTerrain
};
