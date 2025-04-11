const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;

const messageLimits = new Map(); // Anti-spam

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200);
        res.end('OK');
        return;
    }

    res.writeHead(404);
    res.end();
});

const wss = new WebSocket.Server({ server });

// 🔒 Anti-spam : max 10 messages toutes les 10 secondes
function isRateLimited(ws) {
    const now = Date.now();
    const timestamps = messageLimits.get(ws) || [];
    const recent = timestamps.filter(ts => now - ts < 10000);
    recent.push(now);
    messageLimits.set(ws, recent);
    return recent.length > 10;
}

wss.on('connection', (ws) => {
    console.log('Client connecté');

    ws.on('message', (message) => {
        if (typeof message === 'string' && message.startsWith('ping-')) {
            ws.send(message);
            return;
        }

        if (isRateLimited(ws)) {
            ws.send("⛔ Vous envoyez trop de messages !");
            return;
        }

        console.log('Reçu: %s', message);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        messageLimits.delete(ws);
        console.log('Client déconnecté');
    });
});

server.listen(PORT, () => {
    console.log(`Serveur WebSocket & HTTP sur le port ${PORT}`);
});
