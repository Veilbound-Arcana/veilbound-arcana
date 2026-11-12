import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 4000),
  chainId: Number(process.env.CHAIN_ID || 11155111),
  rpcUrl: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
  botPrivateKey: process.env.BOT_PRIVATE_KEY || "",
  fateTokenAddress: process.env.NEXT_PUBLIC_FATE_TOKEN_ADDRESS || "",
  cardCatalogAddress: process.env.NEXT_PUBLIC_CARD_CATALOG_ADDRESS || "",
  arcanaCardsAddress: process.env.NEXT_PUBLIC_ARCANA_CARDS_ADDRESS || "",
  tarotGachaAddress: process.env.NEXT_PUBLIC_TAROT_GACHA_ADDRESS || "",
  duelEngineAddress: process.env.NEXT_PUBLIC_DUEL_ENGINE_ADDRESS || "",
  stakeEscrowAddress: process.env.NEXT_PUBLIC_STAKE_ESCROW_ADDRESS || "",
  marketAddress: process.env.NEXT_PUBLIC_MARKET_ADDRESS || "",
  indexerEnabled: (process.env.INDEXER_ENABLED || "true").toLowerCase() !== "false",
  /** Practice bot round-trip delay in ms — keeps UX human-paced for demo. */
  botMoveDelayMs: Number(process.env.BOT_MOVE_DELAY_MS || 1200),
};

export const DISCLAIMER =
  "This project is experimental confidential software. Use at your own risk.";
