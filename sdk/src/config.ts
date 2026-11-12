/**
 * Static configuration, official game numbers, and honest-disclosure constants.
 * Numbers follow docs/kamus-angka.md (single source of truth).
 */

export const DISCLAIMER =
  "This project is experimental confidential software. Use at your own risk.";

export const PROJECT_NAME = "Veilbound Arcana";

export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_CHAIN_NAME = "Sepolia";

export interface VeilboundAddresses {
  fateToken: string;
  cardCatalog: string;
  arcanaCards: string;
  tarotGacha: string;
  duelEngine: string;
  stakeEscrow: string;
  market: string;
}

/** Sepolia addresses from .env.example — replace after real deployment (honesty rule: no live claim without tx hash). */
export const DEFAULT_ADDRESSES: VeilboundAddresses = {
  fateToken: "0x3bB2F08cE97B0e386997d8F9B6e7cD21D4b9542a",
  cardCatalog: "0x4cA1827eAe5B9117621c4327A5982B13F17E11aB",
  arcanaCards: "0x892a781fAe3c7066C72bB82512F9827B13f17E11",
  tarotGacha: "0xfa71982b1c67d8f9b6e7cd21d4b9542a127bf6ee",
  duelEngine: "0x127bF6eE8E9c7B8B1c9e8F9B6e7cD21D4b9542b1",
  stakeEscrow: "0x6e7cd21d4b9542a127bf6ee8e9c7b8b1c9e8f9b6",
  market: "0x9827B13f17E11aB4cA1827eAe5B9117621c4327A",
};

export function resolveAddresses(
  env: Record<string, string | undefined> = typeof process !== "undefined" ? process.env : {}
): VeilboundAddresses {
  return {
    fateToken: env.NEXT_PUBLIC_FATE_TOKEN_ADDRESS || DEFAULT_ADDRESSES.fateToken,
    cardCatalog: env.NEXT_PUBLIC_CARD_CATALOG_ADDRESS || DEFAULT_ADDRESSES.cardCatalog,
    arcanaCards: env.NEXT_PUBLIC_ARCANA_CARDS_ADDRESS || DEFAULT_ADDRESSES.arcanaCards,
    tarotGacha: env.NEXT_PUBLIC_TAROT_GACHA_ADDRESS || DEFAULT_ADDRESSES.tarotGacha,
    duelEngine: env.NEXT_PUBLIC_DUEL_ENGINE_ADDRESS || DEFAULT_ADDRESSES.duelEngine,
    stakeEscrow: env.NEXT_PUBLIC_STAKE_ESCROW_ADDRESS || DEFAULT_ADDRESSES.stakeEscrow,
    market: env.NEXT_PUBLIC_MARKET_ADDRESS || DEFAULT_ADDRESSES.market,
  };
}

export const RPC_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SEPOLIA_RPC_URL) ||
  "https://ethereum-sepolia-rpc.publicnode.com";

/** Gacha odds published on-chain (TarotGacha.sol thresholds, 8-bit roll 0..255). */
export const GACHA_ODDS = {
  common: 60,
  rare: 25,
  epic: 12,
  legendary: 3,
} as const;

export const GACHA_THRESHOLDS = {
  common: 152, // 0..152   -> ~60%
  rare: 216, // 153..216  -> ~25%
  epic: 247, // 217..247  -> ~12%
  legendary: 248, // 248..255 -> ~3%
} as const;

export const PITY = {
  rareSoft: 5,
  epicSoft: 12,
  legendaryHard: 25,
} as const;

/** Official duel / deck rules (docs/kamus-angka.md). */
export const GAME_RULES = {
  DECK_SIZE: 5,
  MAX_DECK_COST: 12,
  MAX_DUPLICATES: 2,
  HAND_SIZE: 3,
  ROUNDS: 3,
  POINTS_TO_WIN: 2,
  ENERGY_POOL: 6,
  COMMIT_TIMEOUT_DEMO_SEC: 120,
  COMMIT_TIMEOUT_STD_SEC: 300,
  FAUCET_AMOUNT_FATE: 10,
  FAUCET_COOLDOWN_SEC: 86400,
  SINGLE_SPREAD_PRICE_FATE: 1,
  THREE_SPREAD_PRICE_FATE: 2.5,
  FATE_DECIMALS: 6,
} as const;

/** Rarity tiers used for Stake matching (max diff = 1). */
export const RARITY_TIER: Record<string, number> = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3,
};

export function fateToUnits(fate: number): bigint {
  return BigInt(Math.round(fate * 10 ** GAME_RULES.FATE_DECIMALS));
}

export function unitsToFate(units: bigint | number): number {
  return Number(units) / 10 ** GAME_RULES.FATE_DECIMALS;
}

export function etherscanAddressUrl(address: string, chainId = SEPOLIA_CHAIN_ID): string {
  return `https://sepolia.etherscan.io/address/${address}`;
}

export function etherscanTxUrl(txHash: string): string {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}
