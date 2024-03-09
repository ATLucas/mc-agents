// deleteWaypoint.js located in ./skills/waypoints

const path = require('path');
const { returnSkillError, returnSkillSuccess, readJsonFile, writeJsonFile } = require('../../utils/utils.js');

const waypointsFilePath = path.join(__dirname, '..', '..', 'data', 'waypoints.json');

async function delWaypoint(bot, waypointName) {

    if (!waypointName) {
        return returnSkillError(`Waypoint name not supplied`);
    }

    let waypoints;
    try {
        waypoints = readJsonFile(waypointsFilePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return returnSkillError('No waypoints found.'); // File not found means no waypoints exist
        } else {
            console.error(error.stack);
            return returnSkillError(`Failed to read waypoints file: ${error.message}`);
        }
    }

    // Check if the waypoint exists
    if (!waypoints[waypointName]) {
        return returnSkillError(`Waypoint '${waypointName}' does not exist.`);
    }

    // Delete the waypoint
    delete waypoints[waypointName];

    // Save the updated waypoints back to the file
    writeJsonFile(waypointsFilePath, waypoints);

    return returnSkillSuccess();
}

module.exports = {
    delWaypoint
};
