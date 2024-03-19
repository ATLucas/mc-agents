// findSurfaceLevel.js located in ./skills/environment

const Vec3 = require('vec3');

const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

/**
 * Finds the surface level at a given x, z coordinate.
 * @param {Object} bot - The bot instance.
 * @param {Object} x - 'x' position at which to find surface level
 * @param {Object} z - 'z' position at which to find surface level
 * @param {Object} startHeight - height at which to begin searching for surface level
 * @returns The y coordinate of the surface level or an error.
 */
async function findSurfaceLevel(bot, x, z, startHeight) {
    if (!x) {
        return returnSkillError(`'x' value not supplied`);
    }

    if (!z) {
        return returnSkillError(`'z' value not supplied`);
    }

    if (!startHeight) {
        return returnSkillError(`'z' value not supplied`);
    }

    try {
        // Start at the provided y height and go downward until a non-air, non-leaf block is found.
        for (let y = startHeight; y >= 0; y--) {
            const block = bot.blockAt(new Vec3({ x, y, z }));

            // Check if the block is not air and not leaves.
            if (block && block.name !== 'air' && !block.name.includes('leaves')) {
                // Surface block found, return its y value.
                return returnSkillSuccess({ surfaceY: y });
            }
        }

        // If no surface block is found, return an error. Should never happen.
        return returnSkillError('Surface block not found');
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to find surface level: ${error.message}`);
    }
}

module.exports = {
    findSurfaceLevel
};
