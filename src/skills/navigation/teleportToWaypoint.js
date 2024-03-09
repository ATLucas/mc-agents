// teleportToWaypoint.js located in ./skills/navigation

const { returnSkillError, returnSkillSuccess } = require('../../utils/utils.js');
const { getWaypoint } = require('../waypoints/getWaypoint.js');

async function teleportToWaypoint(bot, waypointName) {

    if (!waypointName) {
        return returnSkillError(`Waypoint name not supplied`);
    }

    // Use the getWaypoint skill to retrieve the waypoint information
    const result = await getWaypoint(bot, waypointName);
    if (!result.success) {
        return returnSkillError(`Waypoint not found: waypointName=${waypointName}, error=${result.error}`);
    }

    const waypoint = result.waypoint;

    try {
        bot.chat(`/tp ${waypoint.x} ${waypoint.y} ${waypoint.z}`);
        return returnSkillSuccess({ teleportedTo: waypoint });
    } catch (error) {
        console.error(error.stack);
        return returnSkillError(`Failed to teleport to waypoint '${waypointName}': ${error.message}`);
    }
}

module.exports = {
    teleportToWaypoint
};
