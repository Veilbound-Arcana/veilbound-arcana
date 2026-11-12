"use client";

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  ClientMessage,
  MatchMode,
  PracticeHandCard,
  RoomSnapshot,
  RoundCommitPublicStatus,
  RoundResolution,
  ServerMessage,
} from "@veilbound/sdk";
import { BACKEND_WS_URL } from "./env";

export interface PracticeUpdate {
  round: number;
  scoreA: number;
  scoreB: number;
  playerEnergy: number;
  botEnergy: number;
  hand: PracticeHandCard[];
  finished: boolean;
  winner?: "A" | "B" | "draw";
}

export interface MatchResult {
  scoreA: number;
  scoreB: number;
  winner: "A" | "B" | "draw";
}

export interface ChainEventItem {
  name: string;
  txHash: string;
  blockNumber: number;
  args: Record<string, string | number | boolean>;
}

export interface LobbyState {
  status: "idle" | "connecting" | "open" | "closed";
  botAddress: string | null;
  rooms: RoomSnapshot[];
  room: RoomSnapshot | null;
  commits: RoundCommitPublicStatus[];
  practice: PracticeUpdate | null;
  lastResolution: RoundResolution | null;
  finished: MatchResult | null;
  opponentCommitted: number[];
  error: string | null;
  chainEvents: ChainEventItem[];
}

const INITIAL: LobbyState = {
  status: "idle",
  botAddress: null,
  rooms: [],
  room: null,
  commits: [],
  practice: null,
  lastResolution: null,
  finished: null,
  opponentCommitted: [],
  error: null,
  chainEvents: [],
};

const SESSION_KEY = "veilbound.lobby.session";

/**
 * Singleton lobby socket: one WebSocket for the whole app, state published via
 * useSyncExternalStore so the Lobby tab and Duel Arena share the same match.
 */
class LobbyStore {
  private state: LobbyState = INITIAL;
  private ws: WebSocket | null = null;
  private listeners = new Set<() => void>();
  private address: string | null = null;
  private attempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private intentionalClose = false;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = (): LobbyState => this.state;

  private set(patch: Partial<LobbyState>): void {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  connect(address: string): void {
    if (this.address === address && this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.address = address;
    this.intentionalClose = false;
    this.open();
  }

  disconnect(): void {
    this.intentionalClose = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.pingTimer) clearInterval(this.pingTimer);
    this.reconnectTimer = null;
    this.pingTimer = null;
    this.ws?.close();
    this.ws = null;
    this.set({ ...INITIAL });
  }

  private open(): void {
    if (!this.address) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.set({ status: "connecting", error: null });
    let ws: WebSocket;
    try {
      ws = new WebSocket(BACKEND_WS_URL);
    } catch {
      this.set({ status: "closed", error: "Gagal koneksi ke lobby server." });
      this.scheduleReconnect();
      return;
    }
    this.ws = ws;

    ws.onopen = () => {
      this.attempt = 0;
      this.set({ status: "open" });
      this.send({ type: "HELLO", address: this.address!, clientVersion: "frontend-1.0" });
      this.send({ type: "REQUEST_STATE", address: this.address! });
      if (this.pingTimer) clearInterval(this.pingTimer);
      this.pingTimer = setInterval(() => this.send({ type: "PING" }), 25_000);
    };

    ws.onmessage = (ev: MessageEvent<string>) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(ev.data) as ServerMessage;
      } catch {
        return;
      }
      this.handle(msg);
    };

    ws.onclose = () => {
      if (this.pingTimer) clearInterval(this.pingTimer);
      this.pingTimer = null;
      if (this.intentionalClose) return;
      this.set({ status: "closed" });
      this.scheduleReconnect();
    };

    ws.onerror = () => {
      // onclose will follow; reconnect is handled there.
    };
  }

  private scheduleReconnect(): void {
    if (this.intentionalClose || !this.address) return;
    this.attempt += 1;
    const delay = Math.min(10_000, 1000 * 2 ** Math.min(this.attempt, 4));
    this.reconnectTimer = setTimeout(() => this.open(), delay);
  }

  private handle(msg: ServerMessage): void {
    switch (msg.type) {
      case "HELLO_ACK":
        this.set({ botAddress: msg.botAddress });
        break;
      case "ROOM_LIST":
        this.set({ rooms: msg.rooms });
        break;
      case "ROOM_CREATED":
      case "ROOM_JOINED":
      case "ROOM_UPDATE": {
        const room = msg.room;
        if (room.host?.toLowerCase() === this.address?.toLowerCase() || room.guest?.toLowerCase() === this.address?.toLowerCase()) {
          sessionStorage.setItem(SESSION_KEY, room.roomId);
        }
        this.set({
          room,
          rooms: this.state.rooms.some((r) => r.roomId === room.roomId)
            ? this.state.rooms.map((r) => (r.roomId === room.roomId ? room : r))
            : [...this.state.rooms, room],
        });
        break;
      }
      case "MATCH_STARTED":
        this.set({ room: msg.room, finished: null, lastResolution: null, opponentCommitted: [], practice: null });
        break;
      case "OPPONENT_DECK_LOCKED":
        break;
      case "OPPONENT_COMMITTED":
        if (!this.state.opponentCommitted.includes(msg.round)) {
          this.set({ opponentCommitted: [...this.state.opponentCommitted, msg.round] });
        }
        break;
      case "ROUND_RESOLVED":
        this.set({ lastResolution: msg.resolution });
        break;
      case "MATCH_FINISHED":
        this.set({ finished: { scoreA: msg.scoreA, scoreB: msg.scoreB, winner: msg.winner } });
        break;
      case "PRACTICE_STATE": {
        const { type: _t, ...practice } = msg;
        this.set({ practice });
        break;
      }
      case "STATE_SNAPSHOT":
        this.set({ room: msg.room, commits: msg.commits });
        break;
      case "ERROR":
        this.set({ error: msg.message });
        break;
      case "CHAIN_EVENT": {
        const { type: _t, ...event } = msg;
        this.set({ chainEvents: [...this.state.chainEvents.slice(-49), event] });
        break;
      }
      case "PRACTICE_BOT_MOVE":
      case "PONG":
        break;
    }
  }

  send(message: ClientMessage): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  clearError(): void {
    if (this.state.error) this.set({ error: null });
  }
}

export const lobbyStore = new LobbyStore();

export interface LobbyApi {
  state: LobbyState;
  send: (message: ClientMessage) => boolean;
  clearError: () => void;
  listRooms: () => void;
  createRoom: (mode: MatchMode) => void;
  joinRoom: (roomId: string) => void;
  practiceChallenge: () => void;
  leaveRoom: () => void;
  lockDeck: (deckDefIds: number[]) => void;
  commitRound: (round: number, slot: number, energy: number) => void;
  requestState: () => void;
}

export function useLobby(address?: string): LobbyApi {
  const state = useSyncExternalStore(lobbyStore.subscribe, lobbyStore.getState, () => INITIAL);

  useEffect(() => {
    if (address) lobbyStore.connect(address);
    else lobbyStore.disconnect();
    return () => {
      // Keep the socket alive across tab switches; app-level unmount tears it down.
    };
  }, [address]);

  const send = useCallback((message: ClientMessage) => lobbyStore.send(message), []);
  const api = useMemo<LobbyApi>(
    () => ({
      state,
      send,
      clearError: () => lobbyStore.clearError(),
      listRooms: () => send({ type: "LIST_ROOMS" }),
      createRoom: (mode: MatchMode) => address && send({ type: "CREATE_ROOM", mode, address }),
      joinRoom: (roomId: string) => address && send({ type: "JOIN_ROOM", roomId, address }),
      practiceChallenge: () => address && send({ type: "PRACTICE_CHALLENGE", address }),
      leaveRoom: () => {
        address && send({ type: "LEAVE_ROOM", address });
        sessionStorage.removeItem(SESSION_KEY);
      },
      lockDeck: (deckDefIds: number[]) => address && send({ type: "DECK_LOCKED", address, deckDefIds }),
      commitRound: (round: number, slot: number, energy: number) =>
        address && send({ type: "ROUND_COMMIT", address, round, slot, energy }),
      requestState: () => address && send({ type: "REQUEST_STATE", address }),
    }),
    [state, send, address]
  );
  return api;
}
