import { Server } from 'ws';

let wss: Server | null = null;

export default function handler(req: any, res: any) {
  if (!res.socket.server.wss) {
    const server = res.socket.server;
    wss = new Server({ server });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        wss?.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(message.toString());
          }
        });
      });

      ws.send("Connected to TinyChat");
    });

    res.socket.server.wss = wss;
    console.log("WebSocket server started");
  }
  res.end();
}

