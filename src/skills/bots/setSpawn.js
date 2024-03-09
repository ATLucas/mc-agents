// setSpawn.js located in ./skills/bots

const { returnSkillError } = require('../../utils/utils.js');
const { writeBotData } = require('../bots/writeBotData.js');
const { getWaypoint } = require('../waypoints/getWaypoint.js');

async function setSpawn(bot, waypointName) {
    if (!waypointName) {
        return returnSkillError('Waypoint name not supplied');
    }

    // Ensure the waypoint exists
    const result = await getWaypoint(bot, waypointName);
    if (!result.success) {
        return returnSkillError(`Waypoint not found: waypointName=${waypointName}, error=${result.error}`);
    }

    return await writeBotData(bot, {spawnWaypoint: waypointName});
}

module.exports = {
    setSpawn
};
