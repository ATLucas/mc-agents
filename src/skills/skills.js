// skills.js located in ./skills

const fs = require('fs');
const path = require('path');

const skillsDirectory = path.join(__dirname);

// This function will load all skills from the files and return an object
function loadSkills(directory) {
    const skillFunctions = {};
    // Read all the subdirectories in the skills directory (each represents a category)
    const skillCategories = fs.readdirSync(directory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    // Iterate over each category to load its skills
    for (const category of skillCategories) {
        const categoryPath = path.join(directory, category);
        const skillFiles = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
            .map(dirent => dirent.name);

        // Import each skill function and add it to the skillFunctions object
        for (const file of skillFiles) {
            const skillName = path.basename(file, '.js');
            const skillPath = path.join(categoryPath, file);
            skillFunctions[skillName] = require(skillPath)[skillName];
        }
    }

    return skillFunctions;
}

// Wrapper function for special cases like spawnBot
async function spawnBotWrapper(_, botName, botType) {
    const { spawnBot } = require('./botSpawn/spawnBot.js');
    await spawnBot(_, botName, botType, skillFunctions);
}

// Load all skill functions
const skillFunctions = loadSkills(skillsDirectory);

// Apply any necessary wrappers or modifications
skillFunctions.spawnBot = spawnBotWrapper;

// Export the skill functions
module.exports = {
    skillFunctions
};
