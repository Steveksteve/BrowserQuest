const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');
const World = require('./js/worldserver');
const config = require('./config.json');

const app = express();
const PORT = config.port || 8000;

const clientPath = path.join(__dirname, '../client');
const sharedPath = path.join(__dirname, '../shared');

// Sert statiquement les dossiers client et shared
app.use(express.static(clientPath));
app.use('/shared', express.static(sharedPath));

// Endpoint santé - doit être placé AVANT catch-all
app.get('/health', (_, res) => res.sendStatus(200));

// Route spéciale pour config_build.json
app.get('/config/config_build.json', (req, res) => {
  res.sendFile(path.join(clientPath, 'config/config_build.json'));
});

// Redirige toutes les autres routes vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Lance serveur HTTP
const server = app.listen(PORT, () => {
  console.log(`✅ HTTP server running on http://localhost:${PORT}`);
});

// Lance WebSocket server
const wss = new WebSocketServer({ server });

// Initialise le monde
const world = new World('world-1', 100, wss);
world.run(path.join(__dirname, './maps/world_server.json'));
