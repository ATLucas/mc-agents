// harvestGrass.js located in ./skills/mining

const { digBlock } = require('./digBlock.js');
const { goNear } = require('../navigation/goNear.js');
const { goTo } = require('../navigation/goTo.js');
const { queryInventory } = require('../inventory/queryInventory.js');
const { sleep } = require('../../utils/utils.js');
const Vec3 = require('vec3');
const { returnSkillError } = require('../../utils/utils.js');

async function harvestGrass(bot, radius=4) {
    // Scan for grass blocks within the radius
    const grassBlocks = findGrassBlocks(bot, bot.entity.position, radius);
    if (grassBlocks.length === 0) {
        return returnSkillError("No tall grass found within range");
    }

    // Harvest the grass
    const droppedItems = [];
    for (const block of grassBlocks) {
        await goNear(bot, block.position);
        const result = await digBlock(bot, block);
        if (result.success && result.droppedItem) {
            droppedItems.push(result.droppedItem);
        }
    }

    // Wait for last item to drop
    await sleep(500);

    // Collect the dropped items
    for (const item of droppedItems) {
        await goTo(bot, item.position);
    }

    return queryInventory(bot);
}

function findGrassBlocks(bot, center, radius) {
    const grassBlocks = [];
    const startPos = center.clone().subtract(new Vec3(radius, radius, radius));
    const endPos = center.clone().add(new Vec3(radius, radius, radius));

    for (let x = startPos.x; x <= endPos.x; x++) {
        for (let y = startPos.y; y <= endPos.y; y++) {
            for (let z = startPos.z; z <= endPos.z; z++) {
                const position = new Vec3(x, y, z);
                const block = bot.blockAt(position);
                if (block && (block.name === 'tall_grass' || block.name === 'grass')) {
                    grassBlocks.push(block);
                }
            }
        }
    }
    return grassBlocks;
}

module.exports = {
    harvestGrass
};
