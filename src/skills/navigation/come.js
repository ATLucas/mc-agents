// come.js located in ./skills/navigation

const { goNear } = require('./goNear.js');
const { getPlayer, returnSkillError } = require('../../utils.js');

async function come(bot) {
    const player = getPlayer(bot);
    if (!player) {
        return returnSkillError("Player not found");
    }
    return await goNear(bot, player.position);
}

module.exports = {
    come
};
