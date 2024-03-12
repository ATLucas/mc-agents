// setWaypoint.js located in ./skills/waypoints

const path = require('path');
const { getPlayer, returnSkillError, returnSkillSuccess, readJsonFile, writeJsonFile } = require('../../utils/utils.js');

const waypointsFilePath = path.join(__dirname, '..', '..', 'data', 'waypoints.json');

async function setWaypoint(bot, waypointName) {

    if (!waypointName) {
        return returnSkillError(`Waypoint name not supplied`);
    }

    const player = getPlayer(bot);
    if (!player) {
        return returnSkillError("Player not found");
    }

    // Read the existing waypoints or start with an empty object
    let waypoints;
    try {
        waypoints = readJsonFile(waypointsFilePath);
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
        x: Math.floor(player.position.x),
        y: Math.floor(player.position.y),
        z: Math.floor(player.position.z),
    };

    // Add and save the new waypoint
    waypoints[waypointName] = newWaypoint;
    writeJsonFile(waypointsFilePath, waypoints);

    return returnSkillSuccess();
}

module.exports = {
    setWaypoint
};
