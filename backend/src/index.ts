import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import {
  ClientMessage,
  MatchMode,
  ServerMessage,
  TX_STATUS_LABELS,
  isClientMessage,
} from "@veilbound/sdk";
import { config, DISCLAIMER } from "./config";
import { RoomManager } from "./lobby/roomManager";
import { PracticeBot } from "./bot/practiceBot";
import { PracticeMatch } from "./match/practiceMatch";
import { EventWatcher } from "./indexer/eventWatcher";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const roomManager = new RoomManager();
const practiceBot = new PracticeBot();
const practiceMatches = new Map<string, PracticeMatch>();
const clients = new Set<WebSocket>();

app.use(express.json());

/* ---------------------------------- HTTP ---------------------------------- */

app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    project: "Veilbound Arcana Game Service",
    practiceBotAddress: practiceBot.botAddress,
    rooms: roomManager.listRooms().length,
    clients: clients.size,
    txStatusLabels: TX_STATUS_LABELS,
    disclaimer: DISCLAIMER,
  });
});

app.get("/api/rooms", (_req, res) => {
  res.json({ rooms: roomManager.listRooms() });
});

app.post("/api/bot/challenge", (req, res) => {
  const { matchId } = req.body ?? {};
  res.json({
    message: "Practice Bot ready to duel — open the Lobby tab and press 'Practice Match'.",
    botAddress: practiceBot.botAddress,
    matchId: matchId ?? null,
    starterDeck: practiceBot.getStarterDeck(),
    starterDeckCost: practiceBot.deckCost(practiceBot.getStarterDeck()),
  });
});

/* ---------------------------------- WS ------------------------------------ */

function send(ws: WebSocket, message: ServerMessage): void {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
}

function sendError(ws: WebSocket, code: string, message: string): void {
  send(ws, { type: "ERROR", code, message });
}

function roomOf(address: string) {
  return roomManager.getRoomByAddress(address);
}

function broadcastRoom(roomId: string, message: ServerMessage, except?: WebSocket): void {
  roomManager.broadcast(roomId, message, except);
}

function toPracticeState(match: PracticeMatch): ServerMessage {
  const s = match.state;
  return {
    type: "PRACTICE_STATE",
    round: s.round,
    scoreA: s.scoreA,
    scoreB: s.scoreB,
    playerEnergy: s.playerEnergy,
    botEnergy: s.botEnergy,
    hand: match.getPlayerHand().map(({ card, orientation }) => ({
      cardId: card.id,
      name: card.name,
      suit: card.suit,
      rarity: card.rarity,
      cost: card.cost,
      basePower: card.basePower,
      orientation,
    })),
    finished: s.finished,
    winner: s.finished ? (s.scoreA > s.scoreB ? "A" : s.scoreB > s.scoreA ? "B" : "draw") : undefined,
  };
}

function startPracticeMatch(ws: WebSocket, address: string, deckDefIds?: number[]): void {
  const room = roomManager.createRoom("practice", address);
  roomManager.joinRoom(room.roomId, practiceBot.botAddress);
  const matchId = Date.now() % 1_000_000;
  const started = roomManager.setMatch(room.roomId, matchId)!;

  const match = new PracticeMatch(deckDefIds ?? PracticeBot.STARTER_DECK);
  practiceMatches.set(room.roomId, match);
  roomManager.subscribe(room.roomId, ws);

  send(ws, { type: "ROOM_CREATED", room: started });
  send(ws, { type: "MATCH_STARTED", room: started, matchId });
  send(ws, {
    type: "OPPONENT_DECK_LOCKED",
    address: practiceBot.botAddress,
  });
  send(ws, toPracticeState(match));
}

function handlePracticeCommit(ws: WebSocket, address: string, msg: Extract<ClientMessage, { type: "ROUND_COMMIT" }>): void {
  const room = roomOf(address);
  if (!room || room.mode !== "practice" || !room.roomId) {
    return sendError(ws, "NO_ROOM", "Join or start a practice match first.");
  }

  const match = practiceMatches.get(room.roomId);
  if (!match) return sendError(ws, "NO_MATCH", "Practice match state not found — restart the match.");

  if (match.state.finished) return sendError(ws, "MATCH_OVER", "Match already finished.");
  if (msg.round !== match.state.round) {
    return sendError(ws, "ROUND_MISMATCH", `Expected round ${match.state.round}, received ${msg.round}.`);
  }
  if (roomManager.hasCommitted(room.roomId, msg.round, address)) {
    return sendError(ws, "ALREADY_COMMITTED", "Round already committed.");
  }

  roomManager.recordCommit(room.roomId, msg.round, address);

  // Bot answers after a human-paced delay so the reveal animation reads naturally.
  setTimeout(() => {
    try {
      // Signal the bot's commit only once it has actually locked its move.
      broadcastRoom(room.roomId, { type: "OPPONENT_COMMITTED", round: msg.round, address: practiceBot.botAddress });

      const outcome = match.playRound({ slot: msg.slot, energy: msg.energy });
      const updated = roomManager.applyResolution(room.roomId, outcome.resolution);
      if (!updated) return;

      broadcastRoom(room.roomId, { type: "ROUND_RESOLVED", resolution: outcome.resolution });
      send(ws, toPracticeState(match));

      if (outcome.finished) {
        broadcastRoom(room.roomId, {
          type: "MATCH_FINISHED",
          scoreA: outcome.resolution.scoreA,
          scoreB: outcome.resolution.scoreB,
          winner: outcome.winner,
        });
      } else {
        broadcastRoom(room.roomId, { type: "ROOM_UPDATE", room: updated });
      }
    } catch (err) {
      sendError(ws, "RESOLVE_FAILED", (err as Error).message);
    }
  }, config.botMoveDelayMs);
}

function handleMessage(ws: WebSocket, msg: ClientMessage): void {
  switch (msg.type) {
    case "HELLO": {
      send(ws, {
        type: "HELLO_ACK",
        serverTime: Date.now(),
        botAddress: practiceBot.botAddress,
      });
      send(ws, { type: "ROOM_LIST", rooms: roomManager.listRooms() });
      break;
    }

    case "LIST_ROOMS":
      send(ws, { type: "ROOM_LIST", rooms: roomManager.listRooms() });
      break;

    case "CREATE_ROOM": {
      if (!msg.address) return sendError(ws, "NO_ADDRESS", "Wallet address required.");
      const room = roomManager.createRoom(msg.mode as MatchMode, msg.address);
      roomManager.subscribe(room.roomId, ws);
      send(ws, { type: "ROOM_CREATED", room });
      break;
    }

    case "JOIN_ROOM": {
      if (!msg.address) return sendError(ws, "NO_ADDRESS", "Wallet address required.");
      const room = roomManager.joinRoom(msg.roomId, msg.address);
      if (!room) return sendError(ws, "JOIN_FAILED", "Room unavailable (missing, full, or already started).");

      roomManager.subscribe(room.roomId, ws);

      // Practice rooms: the "guest" is the bot — kick off the solo match flow.
      if (room.mode === "practice") {
        const matchId = room.matchId ?? Date.now() % 1_000_000;
        const started = roomManager.setMatch(room.roomId, matchId)!;
        const match = new PracticeMatch(PracticeBot.STARTER_DECK);
        practiceMatches.set(room.roomId, match);
        send(ws, { type: "ROOM_JOINED", room: started });
        send(ws, { type: "MATCH_STARTED", room: started, matchId });
        send(ws, toPracticeState(match));
        break;
      }

      const matchId = room.matchId ?? Date.now() % 1_000_000;
      const started = roomManager.setMatch(room.roomId, matchId)!;
      send(ws, { type: "ROOM_JOINED", room: started });
      broadcastRoom(room.roomId, { type: "MATCH_STARTED", room: started, matchId });
      break;
    }

    case "PRACTICE_CHALLENGE": {
      if (!msg.address) return sendError(ws, "NO_ADDRESS", "Wallet address required.");
      startPracticeMatch(ws, msg.address);
      break;
    }

    case "LEAVE_ROOM": {
      const room = roomOf(msg.address);
      roomManager.leaveRoom(msg.address);
      if (room) {
        practiceMatches.delete(room.roomId);
        broadcastRoom(room.roomId, {
          type: "ROOM_UPDATE",
          room: { ...room, state: "finished", guest: room.guest, host: room.host },
        });
      }
      break;
    }

    case "DECK_LOCKED": {
      const room = roomOf(msg.address);
      if (!room) return sendError(ws, "NO_ROOM", "Not in a room.");
      roomManager.recordDeck(room.roomId, msg.address, msg.deckDefIds);
      broadcastRoom(room.roomId, { type: "OPPONENT_DECK_LOCKED", address: msg.address });

      if (room.mode === "practice") {
        // Re-deal the practice match with the player's real deck (pre-round 1 only).
        const existing = practiceMatches.get(room.roomId);
        if (existing && existing.state.round === 1 && existing.state.scoreA === 0 && existing.state.scoreB === 0) {
          const match = new PracticeMatch(msg.deckDefIds);
          practiceMatches.set(room.roomId, match);
          send(ws, toPracticeState(match));
        }
      }
      break;
    }

    case "ROUND_COMMIT": {
      const room = roomOf(msg.address);
      if (!room) return sendError(ws, "NO_ROOM", "Not in a room.");

      if (room.mode === "practice") {
        handlePracticeCommit(ws, msg.address, msg);
        break;
      }

      // Friendly / stake: relay commit status only — resolution happens on-chain
      // and reaches clients through the CHAIN_EVENT indexer feed (RoundResolved).
      if (roomManager.hasCommitted(room.roomId, msg.round, msg.address)) {
        return sendError(ws, "ALREADY_COMMITTED", "Round already committed.");
      }
      roomManager.recordCommit(room.roomId, msg.round, msg.address);
      broadcastRoom(room.roomId, { type: "OPPONENT_COMMITTED", round: msg.round, address: msg.address }, ws);
      break;
    }

    case "REQUEST_STATE": {
      const room = roomOf(msg.address);
      send(ws, { type: "STATE_SNAPSHOT", room: room ?? null, commits: [] });
      if (room?.mode === "practice") {
        const match = practiceMatches.get(room.roomId);
        if (match) send(ws, toPracticeState(match));
      }
      break;
    }

    case "PING":
      send(ws, { type: "PONG", serverTime: Date.now() });
      break;

    default:
      sendError(ws, "UNKNOWN_TYPE", "Unsupported message type.");
  }
}

wss.on("connection", (ws: WebSocket) => {
  clients.add(ws);

  ws.on("message", (raw: Buffer) => {
    try {
      const data = JSON.parse(raw.toString());
      if (!isClientMessage(data)) {
        sendError(ws, "BAD_PAYLOAD", "Invalid payload");
        return;
      }
      handleMessage(ws, data as ClientMessage);
    } catch {
      sendError(ws, "BAD_PAYLOAD", "Invalid JSON payload");
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    roomManager.unsubscribeAll(ws);
  });

  ws.on("error", () => clients.delete(ws));
});

/* ------------------------------- Chain indexer ------------------------------ */

const eventWatcher = new EventWatcher();
eventWatcher.onEvent((event) => {
  const payload: ServerMessage = { type: "CHAIN_EVENT", ...event };
  const encoded = JSON.stringify(payload);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) client.send(encoded);
  }
  console.log(`[ChainEvent] ${event.name} @ ${event.txHash.slice(0, 18)}…`);
});

/* --------------------------------- Startup --------------------------------- */

const pruneTimer = setInterval(() => roomManager.pruneStale(), 10 * 60 * 1000);

const PORT = config.port;
server.listen(PORT, "0.0.0.0", async () => {
  console.log(`[Veilbound Backend] Service running on http://localhost:${PORT}`);
  console.log(`[Practice Bot (FR-20)] Standby at address: ${practiceBot.botAddress}`);
  console.log(`[Disclaimer] ${DISCLAIMER}`);

  if (config.indexerEnabled) {
    try {
      await eventWatcher.start();
    } catch (err) {
      console.warn("[EventWatcher] Disabled:", (err as Error).message);
    }
  }
});

function shutdown(): void {
  console.log("[Veilbound Backend] Shutting down…");
  eventWatcher.stop();
  clearInterval(pruneTimer);
  for (const client of clients) client.close();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
