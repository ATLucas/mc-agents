// digBlock.js located in ./skills/mining

const { sleep } = require('../../utils.js');
const { returnSkillError, returnSkillSuccess } = require('../../utils.js');

async function digBlock(bot, block) {

    if (!block) {
        return returnSkillError(`Block not supplied`);
    }

    if (!bot.canDigBlock(block)) {
        return returnSkillError(`Cannot dig this block: ${block.name}`);
    }

    const droppedItem = await new Promise((resolve, reject) => {

        let item = null;

        // Listen for any item that drops as a result of the dig
        const itemDropCallback = (entity) => {
            if (entity.position.distanceTo(block.position) <= 2) {
                item = entity;
            }
        };
        bot.on('itemDrop', itemDropCallback);

        // Listen for the diggingCompleted event to resolve the promise
        diggingCompletedCallback = async (completedBlock) => {
            if (completedBlock.position.equals(block.position)) {
                // Wait for item drop
                await sleep(100);
                bot.removeListener('itemDrop', itemDropCallback);
                resolve(item);
            }
        }

        bot.once('diggingCompleted', diggingCompletedCallback);

        // Start digging the block
        bot.dig(block, err => {
            bot.removeListener('itemDrop', itemDropCallback);
            bot.removeListener('diggingCompleted', diggingCompletedCallback);
            if (err) {
                console.log("INFO: Failed to dig block:", block.name, err);
                reject(err);
            }
        });
    });

    return returnSkillSuccess({ droppedItem });
}

module.exports = {
    digBlock
};
