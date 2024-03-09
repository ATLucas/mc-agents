// goTo.js located in ./skills

const { goals: { GoalBlock } } = require('mineflayer-pathfinder');
const { returnSkillError, returnSkillSuccess } = require('../../utils.js');

async function goTo(bot, target) {

    if (!target) {
        return returnSkillError(`Target not supplied`);
    }
    
    try {
        await bot.pathfinder.goto(new GoalBlock(target.x, target.y, target.z));
        return returnSkillSuccess();
    } catch( error ) {
        console.error(error.stack);
        return returnSkillError(`Failed to go to location '${target}': ${error.message}`);
    }
}

module.exports = {
    goTo
};
