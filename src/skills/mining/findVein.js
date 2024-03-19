// findVein.js located in ./skills/mining

const Vec3 = require('vec3');
const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

/**
 * Recursively finds all blocks in a vein that match a given condition.
 * @param {Object} bot - The bot instance.
 * @param {Object} startPos - The starting position for the vein search.
 * @param {Function} matchBlock - A function that takes a block and returns true if it matches the vein criteria.
 * @returns {Object} An object containing a success flag and the list of blocks that form the vein.
 */
async function findVein(bot, startPos, matchBlock) {
    if (!startPos || typeof startPos.x !== 'number' || typeof startPos.y !== 'number' || typeof startPos.z !== 'number') {
        return returnSkillError('Invalid start position supplied');
    }
    if (!matchBlock || typeof matchBlock !== 'function') {
        return returnSkillError('Invalid block matching function');
    }

    // Define directions to check around the current block
    const directions = [];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                directions.push(new Vec3(dx, dy, dz));
            }
        }
    }

    // Array to hold matching blocks in the vein
    let veinBlocks = [];

    // Track blocks already visited
    const visited = new Set()

    // Recursive function to explore the vein
    async function exploreVein(currentPos) {
        const key = currentPos.toString();

        // Skip if already visited
        if (visited.has(key)) return;
        visited.add(key);

        const block = bot.blockAt(currentPos);
        if (block && matchBlock(block)) {
            // Add the block to the vein if it matches
            veinBlocks.push(block);

            // Recurse in all directions
            for (const direction of directions) {
                const newPos = currentPos.clone();
                newPos.add(direction);
                await exploreVein(newPos);
            }
        }
    }

    // Start exploring from the initial position
    await exploreVein(startPos);

    // Sort the veinBlocks by y value, then x value, then z value
    veinBlocks.sort((a, b) => {
        if (a.position.y !== b.position.y) {
            return a.position.y - b.position.y; // Ascending order by y
        } else if (a.position.x !== b.position.x) {
            return a.position.x - b.position.x; // Ascending order by x
        } else {
            return a.position.z - b.position.z; // Ascending order by z
        }
    });


    // Return the list of blocks in the vein
    return returnSkillSuccess({ veinBlocks });
}

module.exports = {
    findVein
};
