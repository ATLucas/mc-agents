// onChat.js located in ./bots

const { isWorldBot } = require('../utils/utils.js');
const { resetGPTThread, performGPTCommand } = require('./gpt.js');

async function onChat(bot, username, message, skillFunctions) {

    let regex = null;
    if (message.startsWith("@ ") && isWorldBot(bot)) {
        regex = new RegExp(`^@`, 'i');
    } else if(message.toLowerCase().startsWith(`@${bot.username.toLowerCase()}`)) {
        regex = new RegExp(`^@${bot.username}`, 'i');
    } else {
        // Message is not meant for this bot
        return;
    }

    const command = message.replace(regex, '').trim();
    console.log(`${username}: @${bot.username}: ${command}`);

    // Check for command strings
    if (command.startsWith('/')) {
        await _performSlashCommand(bot, command, skillFunctions);
    } else {

        // Send command to GPT
        bot.chat("Thinking...");
        const response = await performGPTCommand(bot, command, skillFunctions);
        bot.chat(response);

        // World bot does not track context
        if (isWorldBot(bot)) {
            await resetGPTThread(bot);
        }
    }
}

async function _performSlashCommand(bot, command, skillFunctions) {

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
    onChat,
};
