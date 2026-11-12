import {
  DEFAULT_ADDRESSES,
  DISCLAIMER,
  GAME_RULES,
  GACHA_ODDS,
  GACHA_THRESHOLDS,
  PITY,
  RARITY_TIER,
  etherscanAddressUrl,
  etherscanTxUrl,
  fateToUnits,
  unitsToFate,
} from "@veilbound/sdk";

/**
 * Client-safe configuration. NEXT_PUBLIC_* vars are referenced literally so the
 * Next.js compiler inlines them into the browser bundle.
 */
export const ADDRESSES = {
  fateToken: process.env.NEXT_PUBLIC_FATE_TOKEN_ADDRESS || DEFAULT_ADDRESSES.fateToken,
  cardCatalog: process.env.NEXT_PUBLIC_CARD_CATALOG_ADDRESS || DEFAULT_ADDRESSES.cardCatalog,
  arcanaCards: process.env.NEXT_PUBLIC_ARCANA_CARDS_ADDRESS || DEFAULT_ADDRESSES.arcanaCards,
  tarotGacha: process.env.NEXT_PUBLIC_TAROT_GACHA_ADDRESS || DEFAULT_ADDRESSES.tarotGacha,
  duelEngine: process.env.NEXT_PUBLIC_DUEL_ENGINE_ADDRESS || DEFAULT_ADDRESSES.duelEngine,
  stakeEscrow: process.env.NEXT_PUBLIC_STAKE_ESCROW_ADDRESS || DEFAULT_ADDRESSES.stakeEscrow,
  market: process.env.NEXT_PUBLIC_MARKET_ADDRESS || DEFAULT_ADDRESSES.market,
};

export const SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

export const BACKEND_WS_URL = process.env.NEXT_PUBLIC_BACKEND_WS_URL || "ws://localhost:4000";
export const BACKEND_HTTP_URL = process.env.NEXT_PUBLIC_BACKEND_HTTP_URL || "http://localhost:4000";

export const GATEWAY_RELAYER_URL = process.env.NEXT_PUBLIC_GATEWAY_RELAYER_URL || "https://gateway.sepolia.fhevm.network";

export const CHAIN_ID = 11155111;
export const CHAIN_NAME = "Sepolia";

/** Deploy block for event scans — 0 means "scan from genesis" (slower, still correct). */
export const DEPLOY_BLOCK = Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || 0);

export { DISCLAIMER, GAME_RULES, GACHA_ODDS, GACHA_THRESHOLDS, PITY, RARITY_TIER, etherscanAddressUrl, etherscanTxUrl, fateToUnits, unitsToFate };
