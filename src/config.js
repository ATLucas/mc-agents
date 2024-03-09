const minecraftHost = "localhost";
const minecraftPort = "3001";

const playerName = "atlucas";

const botConfig = {
    address: minecraftHost,
    port: minecraftPort,
    version: "1.20.1",
    viewDistance: "tiny",
};

const worldBotUsername = "world";

const waypointTypes = ['spawn', 'base', 'mine', 'tree_farm', 'wheat_farm'];

module.exports = {
    playerName,
    botConfig,
    waypointTypes,
    worldBotUsername,
};