const minecraftHost = "localhost";
const minecraftPort = "3001";

const playerName = "atlucas";

const botConfig = {
    address: minecraftHost,
    port: minecraftPort,
    version: "1.20.1",
    viewDistance: "tiny",
};

const BotTypes = {
	common: "common",
	world: "world",
	craftsman: "craftsman",
	woodsman: "woodsman",
}

const _botSkillsByType = {
    common: ["getBotData", "wipeBotMemory", "setSpawn", "come", "teleportToWaypoint", "queryInventory", "storeInventory"],
    world: ["spawnBot", "despawnBot", "deleteBot", "listWaypoints", "setWaypoint", "getWaypoint", "delWaypoint"],
    craftsman: ["craftCraftingTable", "craftPlanks", "craftSticks", "craftWoodenPickaxe"],
    woodsman: ["harvestTree", "harvestGrass", "levelTerrain"]
}

function getBotSkills(botType) {
    return _botSkillsByType[botType];
}

const worldBotUsername = "world";

module.exports = {
    playerName,
    botConfig,
    BotTypes,
    getBotSkills,
    worldBotUsername,
};