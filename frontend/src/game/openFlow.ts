import { Card, Rarity } from "./types";
import { ALL_CARDS } from "@/data/generateCards";
import { SET_MAP } from "@/data/sets";
import { ECONOMY } from "./economy.config";
import { SeededRng } from "./rng";

export type PackFlowState =
  | { stage: "idle" }
  | { stage: "rising"; setId: string; cards: Card[]; newMap: Record<string, boolean> }
  | { stage: "tearReady"; setId: string; cards: Card[]; newMap: Record<string, boolean> }
  | { stage: "tearing"; setId: string; cards: Card[]; newMap: Record<string, boolean>; progress: number }
  | { stage: "burst"; setId: string; cards: Card[]; newMap: Record<string, boolean> }
  | { stage: "revealing"; setId: string; cards: Card[]; newMap: Record<string, boolean>; cardIndex: number }
  | { stage: "summary"; setId: string; cards: Card[]; newMap: Record<string, boolean> };

/**
 * Generate 5 cards for a pack based on set drop rates and seeded PRNG.
 */
export function generatePackCards(setId: string, seed: number = Date.now()): Card[] {
  const set = SET_MAP[setId] || SET_MAP["V1"];
  const setCards = ALL_CARDS.filter((c) => c.setId === set.id);
  const rng = new SeededRng(seed);

  const drawTier = (table: Record<Rarity, number>): Rarity => {
    const roll = rng.random() * 100;
    let accumulated = 0;
    for (const [tier, weight] of Object.entries(table)) {
      accumulated += weight;
      if (roll <= accumulated) {
        return tier as Rarity;
      }
    }
    return "rune1";
  };

  const getCardOfTier = (tier: Rarity): Card => {
    const matching = setCards.filter((c) => c.rarity === tier);
    if (matching.length > 0) {
      return rng.choice(matching);
    }
    // Fallback if tier is empty in this set
    return rng.choice(setCards);
  };

  // Slots 1-3
  const slot1 = getCardOfTier(drawTier(ECONOMY.dropTable.slots1to3));
  const slot2 = getCardOfTier(drawTier(ECONOMY.dropTable.slots1to3));
  const slot3 = getCardOfTier(drawTier(ECONOMY.dropTable.slots1to3));

  // Slots 4-5
  const slot4 = getCardOfTier(drawTier(ECONOMY.dropTable.slots4to5));
  const slot5 = getCardOfTier(drawTier(ECONOMY.dropTable.slots4to5));

  return [slot1, slot2, slot3, slot4, slot5];
}
