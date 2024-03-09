// goNear.js located in ./skills

const { goals: { GoalNear } } = require('mineflayer-pathfinder');
const { returnSkillError, returnSkillSuccess } = require('../../utils.js');

async function goNear(bot, target, range=4) {

    if (!target) {
        return returnSkillError(`Target not supplied`);
    }

    try {
        const distance = bot.entity.position.distanceTo(target);
        if (distance <= range) {
            return returnSkillSuccess();
        }

        await bot.pathfinder.goto(new GoalNear(target.x, target.y, target.z, range));
        return returnSkillSuccess();
    } catch( error ) {
        console.error(error.stack);
        return returnSkillError(`Failed to go near location '${target}': ${error.message}`);
    }
}

module.exports = {
    goNear
};
