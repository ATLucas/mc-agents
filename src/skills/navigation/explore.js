// explore.js located in ./skills/navigation

const Vec3 = require('vec3');

const { findSurfaceLevel } = require('../navigation/findSurfaceLevel.js');
const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');

async function explore(bot, validateBlock, moveCallback, maxDistance = 256, stepSize = 16) {
    let direction = 2; // 0: North, 1: East, 2: South, 3: West
    let steps = 1;
    let stepCounter = 0;
    let turnCounter = 0;
    let currentPos = bot.entity.position.clone();

    while (currentPos.distanceTo(bot.entity.position) < maxDistance) {

        // Check surrounding area for a block that validates
        const foundBlock = bot.findBlock({
            point: currentPos,
            matching: validateBlock,
            // maxDistance: 16,
            count: 1,
        });

        if (foundBlock) {
            console.log(`Found exploration target: ${foundBlock.position}`);
            return returnSkillSuccess({ found: true, position: foundBlock.position });
        }

        console.log("Exploring...");

        // Define moveVector based on the current direction
        let moveVector;
        switch (direction) {
            case 0: moveVector = new Vec3(0, 0, -stepSize); break;
            case 1: moveVector = new Vec3(-stepSize, 0, 0); break;
            case 2: moveVector = new Vec3(0, 0, stepSize); break;
            case 3: moveVector = new Vec3(stepSize, 0, 0); break;
        }

        // Move in the current direction by stepSize blocks
        let previousPos = currentPos.clone();
        currentPos.add(moveVector);

        // Find surface level for 'y' value
        let result = await findSurfaceLevel(bot, currentPos.x, currentPos.z, currentPos.y + 16);

        if (!result.success) {
            console.info(`Failed to find surface level at (${currentPos}): ${JSON.stringify(result)}`);
            currentPos = previousPos;
        } else {
            // Set y to surface level
            currentPos.y = result.surfaceY;

            if (bot.blockAt(currentPos).name.includes('water') && _isWaterArea(bot, currentPos)) {
                console.info(`Avoiding water at (${currentPos})`);
                currentPos = previousPos;
            }
    
            // Move the bot to the new position
            result = await moveCallback(bot, currentPos, 2);
    
            if (!result.success) {
                currentPos = previousPos;
                console.info(`Move failed: ${JSON.stringify(result)}`);
            }
        }

        stepCounter++;
        if (stepCounter === steps) {
            stepCounter = 0;
            direction = (direction + 1) % 4; // Change direction
            turnCounter++;
            if (turnCounter === 2) {
                turnCounter = 0;
                steps++; // Increase step size every full cycle
            }
        }
    }
    return returnSkillError('No suitable blocks found within range.');
}

// Check if the area is primarily composed of water-related blocks
function _isWaterArea(bot, centerPos, radius = 5) {
    let waterBlocks = 0;
    let totalBlocks = 0;
    for (let x = -radius; x <= radius; x++) {
        for (let z = -radius; z <= radius; z++) {
            const pos = new Vec3(centerPos.x + x, centerPos.y, centerPos.z + z);
            const block = bot.blockAt(pos);
            if (block) {
                totalBlocks++;
                if (block.name.includes('water')) {
                    waterBlocks++;
                }
            }
        }
    }
    return (waterBlocks / totalBlocks) > 0.5; // More than half of the blocks are water
}


module.exports = {
    explore
};
