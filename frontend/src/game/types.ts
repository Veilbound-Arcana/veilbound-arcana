export type Aspect =
  | "ember"
  | "tide"
  | "verdant"
  | "volt"
  | "umbra"
  | "lumen"
  | "iron"
  | "aether";

export type Rarity =
  | "rune1"
  | "rune2"
  | "rune3"
  | "rune4"
  | "moon1"
  | "moon2"
  | "moon3"
  | "veil";

export type Effect = {
  type: "draw" | "heal" | "benchDamage" | "status" | "coinFlip";
  amount?: number;
  status?: "wither" | "slumber";
  heads?: Effect;
  tails?: Effect;
};

export interface Ability {
  name: string;
  cost: Aspect[];
  damage?: number;
  text?: string;
  effect?: Effect;
}

export interface Card {
  id: string;
  number: number;
  setId: string;
  name: string;
  kind: "veilborn" | "tool" | "ally" | "item";
  stage?: "basic" | "stage1" | "stage2";
  evolvesFrom?: string;
  aspect?: Aspect;
  vitality?: number;
  power?: number;
  crowned?: boolean;
  abilities?: Ability[];
  weakness?: Aspect;
  retreat?: number;
  retreatCost?: number;
  flavor?: string;
  description?: string;
  tarotArchetype?: string;
  artist?: string;
  rarity: Rarity;
  immersive?: boolean;
}

export interface SetDef {
  id: string;
  badge: string;
  title: string;
  featuredCardId: string;
  cardIds: string[];
  dropTable: Record<Rarity, number>;
}

export interface Deck {
  id: string;
  name: string;
  cardIds: string[];
}

export interface PlayerSave {
  version: number;
  level: number;
  xp: number;
  wardenName: string;
  playerName?: string;
  tutorialDone: boolean;
  currencies: {
    shards: number;
    echoes: number;
    candles: number;
    candleNextAt: number;
  };
  owned: Record<string, number>;
  cards: Record<string, number>;
  decks: Record<string, Deck>;
  activeDeckId: string;
  unlocks: {
    folio: boolean;
    shrine: boolean;
  };
  settings: {
    language: "en" | "id";
    musicVolume: number;
    sfxVolume: number;
    fxVolume: number;
    reducedMotion: boolean;
    reduceMotion: boolean;
    muted: boolean;
    tutorialCompleted: boolean;
  };
  shrineCards: string[];
  folioPages: Record<number, string[]>;
  lastOmenDate: string;
  vigils: Array<{ id: string; progress: number; claimed: boolean }>;
}

export interface Slot {
  cardId: string;
  vitality: number;
  attached: Aspect[];
  tool?: string;
  status?: "wither" | "slumber";
  playedOnTurn: number;
}

export interface Side {
  deck: string[];
  hand: string[];
  discard: string[];
  active?: Slot;
  bench: Slot[];
  points: number;
  aetherWell?: Aspect;
  supportPlayed: boolean;
  retreated: boolean;
}

export type GameEvent =
  | { type: "damage"; target: string; amount: number }
  | { type: "ko"; target: string; points: number }
  | { type: "draw"; player: "a" | "b"; cardId?: string }
  | { type: "coinFlip"; result: "heads" | "tails" }
  | { type: "statusApplied"; target: string; status: "wither" | "slumber" }
  | { type: "pointGained"; player: "a" | "b"; total: number };

export interface MatchState {
  seed: number;
  turn: number;
  current: "a" | "b";
  a: Side;
  b: Side;
  log: GameEvent[];
  over?: "a" | "b" | "draw";
  winner?: "a" | "b" | "draw";
}

export type Action =
  | { type: "PlayBasic"; cardId: string; target: "active" | "bench" }
  | { type: "Attach"; target: "active" | "bench"; benchIndex?: number }
  | { type: "Evolve"; cardId: string; target: "active" | "bench"; benchIndex?: number }
  | { type: "PlayAlly"; cardId: string }
  | { type: "PlayTool"; cardId: string; target: "active" | "bench"; benchIndex?: number }
  | { type: "Retreat"; benchIndex: number }
  | { type: "Attack"; abilityIndex: number }
  | { type: "EndTurn" };

export interface Mission {
  id: string;
  kind: "daily" | "weekly";
  titleKey: string;
  goal: number;
  progress: number;
  reward: Reward;
  claimed: boolean;
  resetsAt: number;
}

export interface Reward {
  shards?: number;
  echoes?: number;
  candles?: number;
  packs?: { setId: string; count: number }[];
  cardIds?: string[];
}

export interface ShopItem {
  id: string;
  kind: "pack" | "echoExchange" | "bundle";
  setId?: string;
  price: { currency: "shards" | "echoes"; amount: number };
  grants: Reward;
  demoOnly?: boolean;
}

export interface Friend {
  id: string;
  name: string;
  code: string;
  level: number;
  featuredCardIds: string[];
  tradableCardIds: string[];
}

export interface TradeOffer {
  id: string;
  fromFriendId: string;
  give: string;
  want: string;
  status: "draft" | "confirmed" | "done" | "cancelled";
}
