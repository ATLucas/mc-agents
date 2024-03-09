// chat.js located in ./bots

const { spawnBot, getBot } = require('./bots.js');
const { botConfig } = require('../config.js');
const { resetGPTThread, performGPTCommand } = require('./gpt.js');
const { isAlphanumeric, isWorldBot } = require('../utils.js');
const { performSlashCommand } = require('./commands.js');

async function onBotChat(bot, username, message) {

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

        // Check for spawn command
        if (isWorldBot(bot) && command.startsWith("/spawn")) {
            const [_, botName] = command.split(' ');
            if (!isAlphanumeric(botName)) {
                console.error(`Bot name must be alphanumeric: ${botName}`);
                return;
            }
            if (getBot(botName)) {
                console.error(`Bot already exists: ${botName}`);
                return;
            }
            const newBotConfig = { username: botName, ...botConfig };
            await spawnBot(newBotConfig);
            return;
        }

        // Process some other command
        await performSlashCommand(bot, command);
    } else {

        // Send command to GPT
        bot.chat("Thinking...");
        const response = await performGPTCommand(bot, command);
        bot.chat(response);

        // World bot does not track context
        if (isWorldBot(bot)) {
            await resetGPTThread(bot);
        }
    }
}

module.exports = {
    onBotChat,
};
