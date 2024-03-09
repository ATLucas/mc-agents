// listWaypoints.js located in ./skills/waypoints

const fs = require('fs');
const path = require('path');
const { returnSkillError, returnSkillSuccess } = require('../../utils.js');

const waypointsFilePath = path.join(__dirname, '..', '..', 'data', 'waypoints.json');

async function listWaypoints(bot) {
    let waypoints;
    try {
        waypoints = JSON.parse(fs.readFileSync(waypointsFilePath, { encoding: 'utf8' }));
    } catch (error) {
        if (error.code === 'ENOENT') { // No such file or directory
            return returnSkillError('No waypoints found.');
        } else {
            console.error(error.stack);
            return returnSkillError(`Failed to read waypoints file: ${error.message}`);
        }
    }

    // Check if there are no waypoints
    if (Object.keys(waypoints).length === 0) {
        return returnSkillError('No waypoints have been created.');
    }

    return returnSkillSuccess({ waypoints });
}

module.exports = {
    listWaypoints
};