import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { RoomManager } from "./lobby/roomManager";
import { PracticeBot } from "./bot/practiceBot";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const roomManager = new RoomManager();
const practiceBot = new PracticeBot();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    project: "Veilbound Arcana Game Service",
    practiceBotAddress: practiceBot.botAddress,
    disclaimer: "This project is not audited, endorsed or operated by Zama. Use at your own risk."
  });
});

app.post("/api/bot/challenge", (req, res) => {
  const { matchId } = req.body;
  const botDeck = practiceBot.getStarterDeck();
  res.json({
    message: "Practice Bot ready to duel",
    botAddress: practiceBot.botAddress,
    matchId,
    starterDeck: botDeck
  });
});

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "CREATE_ROOM") {
        const room = roomManager.createRoom(data.roomId, data.playerAddress);
        ws.send(JSON.stringify({ type: "ROOM_CREATED", room }));
      } else if (data.type === "JOIN_ROOM") {
        const room = roomManager.joinRoom(data.roomId, data.playerAddress);
        ws.send(JSON.stringify({ type: "ROOM_JOINED", room }));
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: "ERROR", message: "Invalid payload" }));
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`[Veilbound Backend] Service running on http://localhost:${PORT}`);
  console.log(`[Practice Bot (FR-20)] Standby at address: ${practiceBot.botAddress}`);
});
