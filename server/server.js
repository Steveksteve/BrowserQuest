const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');
const World = require('./js/worldserver');
const config = require('./config.json');

const app = express();
const PORT = config.port || 8000;

// Sert statiquement le dossier client
app.use(express.static(path.join(__dirname, '../client')));

// Sert aussi le dossier shared si besoin
app.use('/shared', express.static(path.join(__dirname, '../shared')));

// ✅ Route spéciale pour éviter "Cannot GET /none"
app.get('/config/config_build.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/config/config_build.json'));
});

// 🧠 Redirige toutes les autres routes vers l'index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Endpoint santé
app.get('/health', (_, res) => res.sendStatus(200));

// Démarre le serveur HTTP
const server = app.listen(PORT, () => {
  console.log(`✅ HTTP server running on http://localhost:${PORT}`);
});

// Lance le WebSocket Server en utilisant le serveur HTTP
const wss = new WebSocketServer({ server });

// Initialise le monde
const world = new World('world-1', 100, wss);
world.run(path.join(__dirname, './maps/world_server.json'));