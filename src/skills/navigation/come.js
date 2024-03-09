// come.js located in ./skills/navigation

const { goNear } = require('./goNear.js');
const { PLAYER_NAME } = require('../../config.js');
const { returnSkillError } = require('../../utils.js');

async function come(bot) {
    const player = bot.players[PLAYER_NAME]?.entity;
    if (!player) {
        return returnSkillError(`Player ${PLAYER_NAME} not found`);
    }
    return await goNear(bot, player.position);
}

module.exports = {
    come
};
