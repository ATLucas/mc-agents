// setWaypoint.js located in ./skills/waypoints

const fs = require('fs');
const path = require('path');
const { PLAYER_NAME, WAYPOINT_TYPES } = require('../../config.js');
const { returnSkillError, returnSkillSuccess } = require('../../utils.js');

const waypointsFilePath = path.join(__dirname, '..', '..', 'data', 'waypoints.json');

async function setWaypoint(bot, waypointType, waypointName) {

    if (!waypointType) {
        return returnSkillError(`Waypoint type not supplied`);
    }

    if (!waypointName) {
        return returnSkillError(`Waypoint name not supplied`);
    }

    const player = bot.players[PLAYER_NAME]?.entity;
    if (!player) {
        return returnSkillError(`Player ${PLAYER_NAME} not found`);
    }

    // Validate the waypoint type
    if (!WAYPOINT_TYPES.includes(waypointType)) {
        return returnSkillError(`Invalid waypoint type '${waypointType}'.`);
    }

    // Read the existing waypoints or start with an empty object
    let waypoints;
    try {
        waypoints = JSON.parse(fs.readFileSync(waypointsFilePath, { encoding: 'utf8' }));
    } catch (error) {
        if (error.code === 'ENOENT') { // No such file or directory
            waypoints = {}; // Start with an empty object if file does not exist
        } else {
            console.error(error.stack);
            return returnSkillError(`Failed to read waypoints file: ${error.message}`);
        }
    }

    // Ensure the waypoint does not already exist
    if (waypoints[waypointName]) {
        return returnSkillError(`Waypoint '${waypointName}' already exists.`);
    }

    // Capture the bot's current position as the waypoint
    const newWaypoint = {
        x: player.position.x.toFixed(2),
        y: player.position.y.toFixed(2),
        z: player.position.z.toFixed(2),
        type: waypointType
    };

    // Add and save the new waypoint
    waypoints[waypointName] = newWaypoint;
    fs.writeFileSync(waypointsFilePath, JSON.stringify(waypoints, null, 2), { encoding: 'utf8' });

    console.log(`INFO: Waypoint '${waypointName}' of type '${waypointType}' created.`);
    return returnSkillSuccess({ created: {waypointName, ...newWaypoint} });
}

module.exports = {
    setWaypoint
};
