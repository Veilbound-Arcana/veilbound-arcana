/**
 * Shared WebSocket lobby protocol between frontend and backend.
 * Adding a message type here is the single source of truth for both sides.
 */

export type MatchMode = "friendly" | "practice" | "stake";

export type RoomState = "waiting" | "locked" | "dueling" | "finished";

export interface RoomSnapshot {
  roomId: string;
  mode: MatchMode;
  host: string | null;
  guest: string | null;
  state: RoomState;
  matchId: number | null;
  createdAt: number;
  round: number;
  scoreA: number;
  scoreB: number;
}

export interface RoundCommitPublicStatus {
  round: number;
  player: string;
  committedAt: number;
}

export interface RoundResolution {
  round: number;
  winner: "tie" | "A" | "B";
  scoreA: number;
  scoreB: number;
  powerA?: number;
  powerB?: number;
  breakdownA?: string;
  breakdownB?: string;
}

export interface PracticeHandCard {
  cardId: number;
  name: string;
  suit: string;
  rarity: string;
  cost: number;
  basePower: number;
  orientation: "upright" | "reversed";
}

/* ------------------------------ client -> server ------------------------------ */

export type ClientMessage =
  | { type: "HELLO"; address: string; clientVersion?: string }
  | { type: "LIST_ROOMS" }
  | { type: "CREATE_ROOM"; mode: MatchMode; address: string }
  | { type: "JOIN_ROOM"; roomId: string; address: string }
  | { type: "PRACTICE_CHALLENGE"; address: string }
  | { type: "LEAVE_ROOM"; address: string }
  | { type: "DECK_LOCKED"; address: string; deckDefIds: number[] }
  | { type: "ROUND_COMMIT"; address: string; round: number; slot: number; energy: number; handle?: string }
  | { type: "REQUEST_STATE"; address: string }
  | { type: "PING" };

/* ------------------------------ server -> client ------------------------------ */

export type ServerMessage =
  | { type: "HELLO_ACK"; serverTime: number; botAddress: string | null }
  | { type: "ROOM_LIST"; rooms: RoomSnapshot[] }
  | { type: "ROOM_UPDATE"; room: RoomSnapshot }
  | { type: "ROOM_CREATED"; room: RoomSnapshot }
  | { type: "ROOM_JOINED"; room: RoomSnapshot }
  | { type: "MATCH_STARTED"; room: RoomSnapshot; matchId: number }
  | { type: "OPPONENT_DECK_LOCKED"; address: string }
  | { type: "OPPONENT_COMMITTED"; round: number; address: string }
  | { type: "ROUND_RESOLVED"; resolution: RoundResolution }
  | { type: "MATCH_FINISHED"; scoreA: number; scoreB: number; winner: "A" | "B" | "draw" }
  | {
      type: "PRACTICE_STATE";
      round: number;
      scoreA: number;
      scoreB: number;
      playerEnergy: number;
      botEnergy: number;
      hand: PracticeHandCard[];
      finished: boolean;
      winner?: "A" | "B" | "draw";
    }
  | { type: "STATE_SNAPSHOT"; room: RoomSnapshot | null; commits: RoundCommitPublicStatus[] }
  | { type: "PRACTICE_BOT_MOVE"; round: number; committed: boolean }
  | { type: "ERROR"; code: string; message: string }
  | {
      type: "CHAIN_EVENT";
      name: string;
      address: string;
      txHash: string;
      blockNumber: number;
      args: Record<string, string | number | boolean>;
    }
  | { type: "PONG"; serverTime: number };

export function isClientMessage(value: unknown): value is ClientMessage {
  return typeof value === "object" && value !== null && typeof (value as { type?: unknown }).type === "string";
}

/** Human-readable status labels for encrypted actions (PRD NFR: no blank screens). */
export const TX_STATUS_LABELS = {
  idle: "Siap",
  pending_signature: "Menunggu tanda tangan di wallet…",
  submitted: "Transaksi terkirim — menunggu konfirmasi Sepolia…",
  confirming: "Konfirmasi blok…",
  decrypting: "Men-dekripsi hasil secara lokal…",
  ready: "Selesai — siap ditindaklanjuti",
  error: "Terjadi kesalahan",
} as const;

export type TxStatusLabel = keyof typeof TX_STATUS_LABELS;
