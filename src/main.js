// main.js located in ./

const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { BOT_CONFIG, START_POINT } = require('./config.js');
const { skillFunctions } = require('./skills.js');
const { createGPTAssistant, deleteGPTAssistant, performGPTCommand } = require('./gpt.js');

const botRegistry = {};

async function createBot(botConfig) {
    try {
        const bot = mineflayer.createBot(botConfig);

        bot.on('spawn', async () => {
            try {
                await onBotSpawn(bot);
            } catch (error) {
                await handleError(error);
            }
        });

        bot.on('chat', async (username, message) => {
            try {
                await onBotChat(bot, username, message);
            } catch (error) {
                await handleError(error);
            }
        });

        return bot;
    } catch (error) {
        await handleError(error);
    }
}

async function onBotSpawn(bot) {
    console.log(`@${bot.username} has spawned.`);

    // Create a GPT for this bot
    await createGPTAssistant(bot);

    // Pathfinder setup
    bot.loadPlugin(pathfinder);
    const defaultMove = new Movements(bot, require('minecraft-data')(bot.version));
    bot.pathfinder.setMovements(defaultMove);

    // MC Data setup
    bot.mcData = require('minecraft-data')(bot.version);

    // Teleport to starting location
    console.log(`INFO: Teleporting to (x=${START_POINT.x}, y=${START_POINT.y}, z=${START_POINT.z})`);
    bot.chat(`/tp ${START_POINT.x} ${START_POINT.y} ${START_POINT.z}`);
}

async function onBotChat(bot, username, message) {

    const isWorldBot = bot.username == BOT_CONFIG["username"];

    let regex = null;
    if (message.startsWith("@ ") && isWorldBot) {
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
        if (isWorldBot && command.startsWith("/spawn")) {
            const [_, botName] = command.split(' ');
            if (botRegistry[botName]) {
                console.log(`Bot ${botName} already exists.`);
                return;
            }
            const newBotConfig = { ...BOT_CONFIG, username: botName };
            botRegistry[botName] = await createBot(newBotConfig);
            return;
        }

        // Process some other command
        await performCommand(bot, command);
    } else {

        // Send command to GPT
        bot.chat("Thinking...");
        const response = await performGPTCommand(bot, command);
        bot.chat(response);
    }
}

async function performCommand(bot, command) {

    if (command.startsWith('/reset')) {

        if (bot.gptAssistant) {
            await deleteGPTAssistant(bot);
        }
        await createGPTAssistant(bot);
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

async function handleError(error) {
    console.error(`ERROR: ${error}`);
    await cleanupBots();
    console.log('INFO: Exiting');
    process.exit(1);
}

async function cleanupBots() {
    console.log('INFO: Deleting GPTs before exiting');

    const deletePromises = Object.keys(botRegistry).map(botName => deleteGPTAssistant(botRegistry[botName]));
    await Promise.all(deletePromises);

    console.log('INFO: Cleanup complete');
}

// Modify the SIGINT handler to call cleanupBots
process.on('SIGINT', async () => {
    await cleanupBots();
    console.log('INFO: Exiting');
    process.exit();
});

// Initialize the bot
(async () => {
    botRegistry[BOT_CONFIG["username"]] = await createBot(BOT_CONFIG);
})();