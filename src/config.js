const MINECRAFT_HOST = "localhost";
const MINECRAFT_PORT = "3001";

const PLAYER_NAME = "atlucas";

const BOT_CONFIG = {
    username: "world",
    address: MINECRAFT_HOST,
    port: MINECRAFT_PORT,
    version: "1.20.1",
    viewDistance: "tiny",
};

const START_POINT = { x: 353, y: 69, z: 282 }; // base
// const START_POINT = { x: 356, y: 64, z: 64 }; // Forest
// const START_POINT = { x: 256, y: 63, z: 6 }; // Beach

const WAYPOINT_TYPES = ['base', 'mine', 'tree_farm', 'wheat_farm'];

module.exports = {
    MINECRAFT_HOST,
    MINECRAFT_PORT,
    PLAYER_NAME,
    BOT_CONFIG,
    START_POINT,
    WAYPOINT_TYPES,
};