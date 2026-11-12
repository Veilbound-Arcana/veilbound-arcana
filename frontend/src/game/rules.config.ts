import { Aspect } from "./types";

export const RULES = {
  deckSize: 20,
  maxDuplicatesPerCard: 2,
  minBasicCards: 1,

  initialHandSize: 5,
  maxBenchSize: 3,
  pointsToWin: 3,
  normalKoPoints: 1,
  crownedKoPoints: 2,

  maxHandLimit: 10,
  maxTurnCap: 30,

  weaknessDamageBonus: 20,
  witherCheckupDamage: 10,

  aspectWeakness: {
    // Ring 1
    ember: "tide",
    tide: "volt",
    volt: "iron",
    iron: "ember",
    // Ring 2
    verdant: "umbra",
    umbra: "lumen",
    lumen: "aether",
    aether: "verdant",
  } as Record<Aspect, Aspect>,
};
