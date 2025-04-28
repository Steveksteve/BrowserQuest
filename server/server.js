const express = require('express');
const path = require('path');
const WebSocketServer = require('ws').Server;
const World = require('./js/worldserver');
const config = require('./config.json');

const app = express();
const PORT = config.port || 8000;

// Sert statiquement le dossier client
app.use(express.static(path.join(__dirname, '../client')));

// Sert aussi le dossier shared si besoin
app.use('/shared', express.static(path.join(__dirname, '../shared')));

// ✅ Point d'entrée par défaut pour éviter l'erreur "Cannot GET /none"
app.get('/config/config_build.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/config/config_build.json'));
});


// 🧠 Redirige vers l'index si quelqu'un tape une URL qui ne correspond pas à une route connue
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Endpoint to healthcheck 
app.get('/health', (_, res) => res.sendStatus(200));

// Démarre le serveur HTTP
const server = app.listen(PORT, () => {
  console.log(`✅ HTTP server running on http://localhost:${PORT}`);
});

// Lance le WebSocket
const wss = new WebSocketServer({ server });
const world = new World('world-1', 100, wss);
world.run('./server/maps/world_server.json');
