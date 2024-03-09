// commands.js located in ./bots

const { deleteGPTAssistant, resetGPTThread } = require('./gpt.js');
const { skillFunctions } = require('../skills.js');

async function performSlashCommand(bot, command) {

    if (command.startsWith('/reset')) {

        await resetGPTThread(bot);
        return;

    } else if (command.startsWith('/delete')) {

        await deleteGPTAssistant(bot);
        return;
    }

    // Normalize command: remove leading '/' and split by spaces
    const parts = command.slice(1).split(' ');
    const commandName = parts[0].toLowerCase(); // The first part is the command name
    const args = parts.slice(1); // The rest are arguments
    
    // Find the closest matching skill function
    let closestMatch = null;
    let closestMatchLength = Infinity;

    for (const skillName of Object.keys(skillFunctions)) {
        const lowerSkillName = skillName.toLowerCase();
        if (lowerSkillName.startsWith(commandName)) {
            const matchLength = lowerSkillName.length - commandName.length;
            if (matchLength < closestMatchLength) {
                closestMatch = skillName;
                closestMatchLength = matchLength;
            }
        }
    }

    // Execute the matched skill function, if any
    if (closestMatch) {
        try {
            console.log(`INFO: Command: ${closestMatch}(${args.join(', ')})`);
            // Convert arguments to required types. Example: parseInt for numbers
            // Assuming all skills accept 'bot' as their first parameter and then the arguments
            const result = await skillFunctions[closestMatch](bot, ...args.map(arg => isNaN(arg) ? arg : parseInt(arg)));
            console.log(`INFO: Command result: ${JSON.stringify(result)}`);
        } catch (error) {
            console.error(`Error executing command: ${error.stack}`);
        }
    } else {
        console.log(`INFO: No matching skill found for command: ${command}`);
    }
}

module.exports = {
    performSlashCommand,
};
