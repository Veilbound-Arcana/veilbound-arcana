import { CardDefinition, Suit } from "./types.js";

export const OFFICIAL_CARD_CATALOG: Record<number, CardDefinition> = {
  1: { id: 1, name: "Page of Wands", suit: "Wands", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2, description: "Pengintai api muda" },
  2: { id: 2, name: "Knight of Wands", suit: "Wands", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2, description: "Penyerang api cepat" },
  3: { id: 3, name: "Queen of Wands", suit: "Wands", arcana: "Minor", rarity: "Rare", cost: 2, basePower: 3, description: "Penguasa bara" },
  4: { id: 4, name: "King of Wands", suit: "Wands", arcana: "Minor", rarity: "Epic", cost: 3, basePower: 4, description: "Titik puncak kekuatan api" },

  5: { id: 5, name: "Page of Cups", suit: "Cups", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2, description: "Pembawa kabar emosi" },
  6: { id: 6, name: "Knight of Cups", suit: "Cups", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2, description: "Pelindung cawan suci" },
  7: { id: 7, name: "Queen of Cups", suit: "Cups", arcana: "Minor", rarity: "Rare", cost: 2, basePower: 3, description: "Intuisi kedalaman air" },
  8: { id: 8, name: "King of Cups", suit: "Cups", arcana: "Minor", rarity: "Epic", cost: 3, basePower: 4, description: "Penguasa ombak samudra" },

  9: { id: 9, name: "Page of Swords", suit: "Swords", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2, description: "Pemikir tajam pemula" },
  10: { id: 10, name: "Knight of Swords", suit: "Swords", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2, description: "Terjangan angin puyuh" },
  11: { id: 11, name: "Queen of Swords", suit: "Swords", arcana: "Minor", rarity: "Rare", cost: 2, basePower: 3, description: "Kebijaksanaan dingin" },
  12: { id: 12, name: "King of Swords", suit: "Swords", arcana: "Minor", rarity: "Epic", cost: 3, basePower: 4, description: "Penghakiman udara mutlak" },

  13: { id: 13, name: "Page of Pentacles", suit: "Pentacles", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2, description: "Pelindung koin tanah" },
  14: { id: 14, name: "Knight of Pentacles", suit: "Pentacles", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2, description: "Ketahanan benteng" },
  15: { id: 15, name: "Queen of Pentacles", suit: "Pentacles", arcana: "Minor", rarity: "Rare", cost: 2, basePower: 3, description: "Kemakmuran bumi" },
  16: { id: 16, name: "King of Pentacles", suit: "Pentacles", arcana: "Minor", rarity: "Epic", cost: 3, basePower: 4, description: "Fondasi kekayaan tanah" },

  17: { id: 17, name: "0 - The Fool", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, basePower: 5, description: "Permulaan mistis tanpa batas" },
  18: { id: 18, name: "I - The Magician", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, basePower: 5, description: "Pengendali 4 elemen" },
  19: { id: 19, name: "II - High Priestess", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, basePower: 5, description: "Penjaga gerbang tabir rahasia" },
  20: { id: 20, name: "XXI - The World", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, basePower: 5, description: "Siklus penyelesaian sempurna" },
};

/**
 * Calculates suit cycle bonus (+1 if suitA beats suitB).
 * Cycle: Wands > Swords > Pentacles > Cups > Wands
 */
export function getSuitAdvantage(suitA: Suit, suitB: Suit): number {
  if (suitA === "None" || suitB === "None") return 0;
  if (suitA === "Wands" && suitB === "Swords") return 1;
  if (suitA === "Swords" && suitB === "Pentacles") return 1;
  if (suitA === "Pentacles" && suitB === "Cups") return 1;
  if (suitA === "Cups" && suitB === "Wands") return 1;
  return 0;
}
