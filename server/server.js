const WebSocketServer = require('ws').Server;
const World = require('./js/worldserver');
const config = require('./config.json');

const wss = new WebSocketServer({ port: config.port || 3000 });
const world = new World('world-1', 100, wss);

world.run('./server/maps/world_server.json');
