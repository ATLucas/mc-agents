// levelTerrain.js located in ./skills/terraforming

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

    async function levelColumn(dx, dz) {
        // Calculate the position to check
        const x = botPosition.x + dx;
        const z = botPosition.z + dz;

        // Define a whitelist of block names
        const levelableBlocks = ['dirt', 'grass_block', 'sand', 'stone', 'gravel'];

        // Gather all blocks higher than surface level that are in the whitelist
        const blocksToDig = [];
        for (let y = botY + 5; y >= botY; y--) {
            let block = bot.blockAt(new Vec3(x, y, z));
            if (block && levelableBlocks.includes(block.name)) {
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
                    try {
                        await goNear(bot, referenceBlock.position);
                        await bot.placeBlock(referenceBlock, new Vec3(0, 1, 0));
                    } catch(error) {
                        console.error(error.message, error.stack);
                    }
                }
            }
        }
    }

    await traverseSpiral(radius, levelColumn);

    // Wait for last item to drop
    await sleep(500);

    // Collect the dropped items
    for (const item of droppedItems) {
        try {
            await goTo(bot, item.position);
        } catch(error) {
            console.error(error.message, error.stack);
        }
    }

    return returnSkillSuccess();
}

async function traverseSpiral(radius, levelColumn) {
    let dx = 0, dz = 0;
    let step = 0;
    let direction = 0; // 0: right, 1: down, 2: left, 3: up
    let stepsChange = 1; // Number of steps before changing direction

    // Total steps in the spiral, square of the side length minus center block
    const totalSteps = (radius * 2 + 1) ** 2 - 1;

    for (let i = 0; i < totalSteps; i++) {
        switch (direction) {
            case 0: dx++; break;
            case 1: dz++; break;
            case 2: dx--; break;
            case 3: dz--; break;
        }

        await levelColumn(dx, dz);

        if (++step == stepsChange) {
            step = 0;
             // Change direction
            direction = (direction + 1) % 4;
             // Increase stepsChange every full cycle (right/left)
            if (direction == 0 || direction == 2) stepsChange++;
        }
    }
}

module.exports = {
    levelTerrain
};
