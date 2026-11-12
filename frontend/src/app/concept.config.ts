/**
 * Central concept configuration.
 * All branded game words and terms are centralized here so the entire game identity
 * can be re-themed without modifying components or core logic.
 */

export const CONCEPT = {
  GAME_NAME: "Veilbound Arcana",
  PREMISE: "Reality is a thin Veil. Players are Wardens who bind spirits (Veilborn) into Arcana cards and duel with them.",
  PLAYER_TITLE: "Warden",

  ASPECTS: [
    "ember",
    "tide",
    "verdant",
    "volt",
    "umbra",
    "lumen",
    "iron",
    "aether",
  ] as const,

  RARITY_LADDER: [
    "rune1",
    "rune2",
    "rune3",
    "rune4",
    "moon1",
    "moon2",
    "moon3",
    "veil",
  ] as const,

  SETS: [
    { id: "V1", title: "The Hollow Crown", badge: "HC" },
    { id: "V2", title: "Tidebound Lanterns", badge: "TL" },
    { id: "V3", title: "Ashen Choir", badge: "AC" },
  ] as const,

  CURRENCIES: {
    premium: "Veil Shards",
    soft: "Echoes",
    allowance: "Vigil Candles",
  } as const,

  FEATURES: {
    collection: "Archive",
    decks: "Spreads",
    binder: "Folio",
    displayBoard: "Shrine",
    dailyPick: "Omen Draw",
    missions: "Vigils",
  } as const,

  ASPECT_COLORS: {
    ember: "#F26B3A",
    tide: "#3B9DF2",
    verdant: "#5CBF4A",
    volt: "#F2C21B",
    umbra: "#6B4FA0",
    lumen: "#F4E7A1",
    iron: "#8C96A5",
    aether: "#5DD6C8",
  } as const,
};

export type AspectKey = (typeof CONCEPT.ASPECTS)[number];
export type RarityKey = (typeof CONCEPT.RARITY_LADDER)[number];
export type SetId = (typeof CONCEPT.SETS)[number]["id"];
