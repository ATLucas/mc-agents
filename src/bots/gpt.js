// gpt.js located in ./bots

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { skillFunctions } = require('../skills/skills.js');
const { sleep } = require('../utils/utils.js');
const { writeBotData } = require('../skills/bots/writeBotData.js');

const openai = new OpenAI();

async function createGPTAssistant(bot, botData) {

    if (!botData) {
        console.error("No bot data provided");
        return
    }

    if (botData.gptAssistant) {
        console.log(`INFO: Using existing GPT: bot=${bot.username}`);
        bot.gptAssistant = botData.gptAssistant;
        bot.gptThread = botData.gptThread;
        return;
    }

    console.log(`INFO: Creating GPT: bot=${bot.username}`);

    const instrPath = path.join(__dirname, "../gpt/instructions.md");
    const toolsPath = path.join(__dirname, "../gpt/tools.json");

    let instructions;
    let toolsData;
    
    try {
        instructions = fs.readFileSync(instrPath, 'utf8');
        const rawToolsData = fs.readFileSync(toolsPath, 'utf8');
        toolsData = JSON.parse(rawToolsData);
    } catch (error) {
        console.error('Error reading files:', error.message, error.stack);
        return;
    }

    try {
        bot.gptAssistant = (await openai.beta.assistants.create({
            name: bot.username,
            instructions: instructions,
            tools: toolsData["tools"],
            model: "gpt-4-turbo-preview"
        })).id;

        bot.gptThread = (await openai.beta.threads.create()).id;
    } catch (error) {
        console.error('Error creating GPT assistant:', error.message, error.stack);
        return;
    }

    const result = await writeBotData(bot, { gptAssistant: bot.gptAssistant, gptThread: bot.gptThread });

    if (!result.success) {
        console.error(`Failed to write GPT data to file: ${result.error}`);
        return;
    }
}

async function deleteGPTAssistant(bot) {
    console.log(`INFO: Deleting GPT: bot=${bot.username}`);
    if (bot.gptAssistant) {
        try {
            await openai.beta.assistants.del(bot.gptAssistant);

            bot.gptAssistant = null;
            bot.gptThread = null;

            const result = await writeBotData(bot, { gptAssistant: null, gptThread: null });
            if (!result.success) {
                console.error(`Failed to clear GPT data: ${result.error}`);
                return;
            }
        } catch (error) {
            console.error('Error deleting GPT assistant:', error.message, error.stack);
            return;
        }
    }
}

async function resetGPTThread(bot) {
    console.log(`INFO: Reseting GPT thread: bot=${bot.username}`);
    if (bot.gptThread) {
        try {
            await openai.beta.threads.del(bot.gptThread);
            
            bot.gptThread = (await openai.beta.threads.create()).id;

            const result = await writeBotData(bot, { gptThread: bot.gptThread });
            if (!result.success) {
                console.error(`Failed to clear GPT data: ${result.error}`);
                return;
            }
        } catch (error) {
            console.error('Error reseting GPT thread:', error.message, error.stack);
            return;
        }
    }
}

async function performGPTCommand(bot, command) {

    const userMessage = await openai.beta.threads.messages.create(
        bot.gptThread, { role: "user", content: command }
    );

    let run = await openai.beta.threads.runs.create(
        bot.gptThread, { assistant_id: bot.gptAssistant }
    );

    while(run.status != "completed") {
        await sleep(1000);

        run = await openai.beta.threads.runs.retrieve(bot.gptThread, run.id);

        if (run.status == "requires_action") {
            const toolOutputs = await _handleToolCalls(
                bot, run.required_action.submit_tool_outputs.tool_calls
            );

            run = await openai.beta.threads.runs.submitToolOutputs(
                bot.gptThread, run.id, { tool_outputs: toolOutputs }
            );
        }
    }

    const threadMessages = await openai.beta.threads.messages.list(bot.gptThread, after=userMessage.id);
    return threadMessages.data[0].content[0].text.value;
}

async function _handleToolCalls(bot, toolCalls) {

    const toolOutputs = [];

    for (const call of toolCalls) {
        const funcName = call.function.name;
        const args = JSON.parse(call.function.arguments);
        if (!skillFunctions[funcName]) {
            console.error(`ERROR: Function ${funcName} not found.`);
            return toolOutputs;
        }
        console.log(`INFO: Calling ${funcName}(${JSON.stringify(args)})`);
        const result = await skillFunctions[funcName](bot, ...Object.values(args));
        const resultJson = JSON.stringify(result);
        console.log(`INFO: Result of ${funcName}() call: ${resultJson}`);
        toolOutputs.push({tool_call_id: call.id, output: resultJson});
    }

    return toolOutputs;
}

module.exports = {
    createGPTAssistant,
    deleteGPTAssistant,
    resetGPTThread,
    performGPTCommand,
};
