import { CardDefinition, Rarity, Suit } from "./types.js";
import { OFFICIAL_CARD_CATALOG } from "./catalog.js";
import { GAME_RULES, RARITY_TIER } from "./config.js";

export interface DeckValidation {
  valid: boolean;
  totalCost: number;
  error?: string;
}

/**
 * Official deck rules: exactly 5 cards, total cost <= 12, max 2 duplicates per def.
 * Shared by frontend Deck Builder, backend practice bot, and contract tests.
 */
export function validateDeck(defIds: number[]): DeckValidation {
  if (defIds.length !== GAME_RULES.DECK_SIZE) {
    return { valid: false, totalCost: sumCost(defIds), error: `Deck must contain exactly ${GAME_RULES.DECK_SIZE} cards` };
  }

  let totalCost = 0;
  const counts: Record<number, number> = {};

  for (const id of defIds) {
    const card = OFFICIAL_CARD_CATALOG[id];
    if (!card) return { valid: false, totalCost, error: `Unknown card definition ${id}` };
    totalCost += card.cost;
    counts[id] = (counts[id] || 0) + 1;
    if (counts[id] > GAME_RULES.MAX_DUPLICATES) {
      return { valid: false, totalCost, error: `${card.name} exceeds max ${GAME_RULES.MAX_DUPLICATES} duplicates` };
    }
  }

  if (totalCost > GAME_RULES.MAX_DECK_COST) {
    return { valid: false, totalCost, error: `Total cost ${totalCost} exceeds maximum ${GAME_RULES.MAX_DECK_COST}` };
  }

  return { valid: true, totalCost };
}

function sumCost(defIds: number[]): number {
  return defIds.reduce((sum, id) => sum + (OFFICIAL_CARD_CATALOG[id]?.cost ?? 0), 0);
}

/** Would adding `defId` keep the deck legal? Used by Deck Builder to disable cards. */
export function canAddCard(deck: number[], defId: number): DeckValidation {
  const card = OFFICIAL_CARD_CATALOG[defId];
  if (!card) return { valid: false, totalCost: sumCost(deck), error: `Unknown card definition ${defId}` };
  if (deck.length >= GAME_RULES.DECK_SIZE) {
    return { valid: false, totalCost: sumCost(deck), error: "Deck is full" };
  }
  const count = deck.filter((id) => id === defId).length;
  if (count >= GAME_RULES.MAX_DUPLICATES) {
    return { valid: false, totalCost: sumCost(deck), error: "Maximum 2 copies per card" };
  }
  const totalCost = sumCost(deck) + card.cost;
  if (totalCost > GAME_RULES.MAX_DECK_COST) {
    return { valid: false, totalCost, error: `Total cost ${totalCost} exceeds maximum ${GAME_RULES.MAX_DECK_COST}` };
  }
  return { valid: true, totalCost };
}

export interface CollectionFilter {
  suit?: Suit | "ALL";
  arcana?: "Minor" | "Major" | "ALL";
  rarity?: Rarity | "ALL";
  search?: string;
}

export function filterCards(filter: CollectionFilter): CardDefinition[] {
  return Object.values(OFFICIAL_CARD_CATALOG).filter((card) => {
    if (filter.suit && filter.suit !== "ALL" && card.suit !== filter.suit) return false;
    if (filter.arcana && filter.arcana !== "ALL" && card.arcana !== filter.arcana) return false;
    if (filter.rarity && filter.rarity !== "ALL" && card.rarity !== filter.rarity) return false;
    if (filter.search && !card.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
}

/** Stake tier matching: absolute rarity tier difference must be <= 1. */
export function rarityTierDiff(a: Rarity, b: Rarity): number {
  return Math.abs((RARITY_TIER[a] ?? 0) - (RARITY_TIER[b] ?? 0));
}
