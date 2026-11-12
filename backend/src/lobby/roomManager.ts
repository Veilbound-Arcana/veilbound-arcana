import type { WebSocket } from "ws";
import {
  MatchMode,
  RoomSnapshot,
  RoomState,
  RoundCommitPublicStatus,
  RoundResolution,
  ServerMessage,
} from "@veilbound/sdk";

interface RoomInternal {
  snapshot: RoomSnapshot;
  subscribers: Set<WebSocket>;
  commits: RoundCommitPublicStatus[];
  decks: Record<string, number[]>;
}

function generateRoomId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)];
  return id;
}

/**
 * In-memory duel lobby: room lifecycle, fan-out broadcast, commit tracking.
 * Rooms survive client refresh via REQUEST_STATE snapshots.
 */
export class RoomManager {
  private rooms: Map<string, RoomInternal> = new Map();
  private byAddress: Map<string, string> = new Map();

  public createRoom(mode: MatchMode, hostAddress: string): RoomSnapshot {
    this.leaveRoom(hostAddress);
    let roomId = generateRoomId();
    while (this.rooms.has(roomId)) roomId = generateRoomId();

    const room: RoomInternal = {
      snapshot: {
        roomId,
        mode,
        host: hostAddress,
        guest: null,
        state: "waiting",
        matchId: null,
        createdAt: Date.now(),
        round: 1,
        scoreA: 0,
        scoreB: 0,
      },
      subscribers: new Set(),
      commits: [],
      decks: {},
    };
    this.rooms.set(roomId, room);
    this.byAddress.set(hostAddress.toLowerCase(), roomId);
    return room.snapshot;
  }

  public joinRoom(roomId: string, guestAddress: string): RoomSnapshot | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.snapshot.state !== "waiting") return null;
    if (room.snapshot.host?.toLowerCase() === guestAddress.toLowerCase()) return null;

    this.leaveRoom(guestAddress);
    room.snapshot.guest = guestAddress;
    room.snapshot.state = "locked";
    this.byAddress.set(guestAddress.toLowerCase(), roomId);
    return room.snapshot;
  }

  public getRoom(roomId: string): RoomSnapshot | undefined {
    return this.rooms.get(roomId)?.snapshot;
  }

  public getRoomByAddress(address: string): RoomSnapshot | undefined {
    const roomId = this.byAddress.get(address.toLowerCase());
    return roomId ? this.rooms.get(roomId)?.snapshot : undefined;
  }

  public listRooms(): RoomSnapshot[] {
    return [...this.rooms.values()]
      .map((r) => r.snapshot)
      .filter((r) => r.state === "waiting")
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  public setMatch(roomId: string, matchId: number): RoomSnapshot | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;
    room.snapshot.matchId = matchId;
    room.snapshot.state = "dueling";
    room.snapshot.round = 1;
    room.snapshot.scoreA = 0;
    room.snapshot.scoreB = 0;
    room.commits = [];
    return room.snapshot;
  }

  public recordDeck(roomId: string, address: string, deckDefIds: number[]): void {
    const room = this.rooms.get(roomId);
    if (room) room.decks[address.toLowerCase()] = deckDefIds;
  }

  public getDeck(roomId: string, address: string): number[] | undefined {
    return this.rooms.get(roomId)?.decks[address.toLowerCase()];
  }

  /** Returns true when both players have committed for this round. */
  public recordCommit(roomId: string, round: number, address: string): { bothCommitted: boolean; commits: RoundCommitPublicStatus[] } {
    const room = this.rooms.get(roomId);
    if (!room) return { bothCommitted: false, commits: [] };

    const already = room.commits.find((c) => c.round === round && c.player.toLowerCase() === address.toLowerCase());
    if (!already) {
      room.commits.push({ round, player: address, committedAt: Date.now() });
    }
    const forRound = room.commits.filter((c) => c.round === round);
    return { bothCommitted: forRound.length >= 2, commits: room.commits };
  }

  public hasCommitted(roomId: string, round: number, address: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    return room.commits.some((c) => c.round === round && c.player.toLowerCase() === address.toLowerCase());
  }

  public applyResolution(roomId: string, resolution: RoundResolution): RoomSnapshot | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    if (resolution.winner === "A") room.snapshot.scoreA = resolution.scoreA;
    if (resolution.winner === "B") room.snapshot.scoreB = resolution.scoreB;

    const decided = room.snapshot.scoreA >= 2 || room.snapshot.scoreB >= 2 || resolution.round >= 3;
    if (decided) {
      room.snapshot.state = "finished";
    } else {
      room.snapshot.round = resolution.round + 1;
      room.commits = room.commits.filter((c) => c.round !== resolution.round);
    }
    return room.snapshot;
  }

  public subscribe(roomId: string, ws: WebSocket): void {
    const room = this.rooms.get(roomId);
    if (room) room.subscribers.add(ws);
  }

  public unsubscribeAll(ws: WebSocket): void {
    for (const room of this.rooms.values()) room.subscribers.delete(ws);
  }

  public broadcast(roomId: string, message: ServerMessage, except?: WebSocket): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const payload = JSON.stringify(message);
    for (const client of room.subscribers) {
      if (client !== except && client.readyState === 1) client.send(payload);
    }
  }

  public leaveRoom(address: string): void {
    const key = address.toLowerCase();
    const roomId = this.byAddress.get(key);
    if (!roomId) return;
    const room = this.rooms.get(roomId);
    this.byAddress.delete(key);
    if (!room) return;

    const isHost = room.snapshot.host?.toLowerCase() === key;
    const isGuest = room.snapshot.guest?.toLowerCase() === key;

    if (room.snapshot.state === "waiting" || room.snapshot.state === "locked") {
      // Pre-match: drop the room entirely so invite codes never dangle.
      if (isHost) {
        this.rooms.delete(roomId);
        if (room.snapshot.guest) this.byAddress.delete(room.snapshot.guest.toLowerCase());
      } else if (isGuest) {
        room.snapshot.guest = null;
        room.snapshot.state = "waiting";
      }
      return;
    }

    // Mid-match: keep the room so the opponent can claim timeout win / reconnect.
    if (isHost) room.snapshot.host = null;
    if (isGuest) room.snapshot.guest = null;
  }

  public pruneStale(maxAgeMs = 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [id, room] of this.rooms) {
      if (now - room.snapshot.createdAt > maxAgeMs && room.snapshot.state === "waiting") {
        this.rooms.delete(id);
      }
    }
  }
}
