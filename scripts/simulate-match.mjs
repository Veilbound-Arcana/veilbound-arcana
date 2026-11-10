#!/usr/bin/env node

/**
 * Veilbound Arcana — Tactical Duel CLI Simulator
 * Simulates confidential power resolution, suit advantages, orientation flips, and energy allocation.
 */

const SUIT_CYCLE = {
  Wands: "Swords",
  Swords: "Pentacles",
  Pentacles: "Cups",
  Cups: "Wands"
};

function getSuitAdvantage(suitA, suitB) {
  if (!suitA || !suitB || suitA === "None" || suitB === "None") return 0;
  return SUIT_CYCLE[suitA] === suitB ? 1 : 0;
}

function resolveBattleRound(input) {
  // Clamp energy silently (never revert in FHEVM)
  const clampedEnergyA = Math.max(0, Math.min(input.energyA, input.remainingEnergyA));
  const clampedEnergyB = Math.max(0, Math.min(input.energyB, input.remainingEnergyB));

  const suitBonusA = getSuitAdvantage(input.cardA.suit, input.cardB.suit);
  const suitBonusB = getSuitAdvantage(input.cardB.suit, input.cardA.suit);

  const orientModifierA = input.orientationA === "upright" ? 1 : -1;
  const orientModifierB = input.orientationB === "upright" ? 1 : -1;

  const powerA = input.cardA.basePower + clampedEnergyA + suitBonusA + orientModifierA;
  const powerB = input.cardB.basePower + clampedEnergyB + suitBonusB + orientModifierB;

  let winner = "tie";
  if (powerA > powerB) winner = "playerA";
  else if (powerB > powerA) winner = "playerB";

  return {
    powerA,
    powerB,
    clampedEnergyA,
    clampedEnergyB,
    suitBonusA,
    suitBonusB,
    winner,
  };
}

const SAMPLE_CARDS = {
  3: { id: 3, name: "Queen of Wands", suit: "Wands", arcana: "Minor", rarity: "Rare", cost: 2, basePower: 3 },
  11: { id: 11, name: "Queen of Swords", suit: "Swords", arcana: "Minor", rarity: "Rare", cost: 2, basePower: 3 },
  1: { id: 1, name: "Page of Wands", suit: "Wands", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2 },
  5: { id: 5, name: "Page of Cups", suit: "Cups", arcana: "Minor", rarity: "Common", cost: 1, basePower: 2 },
  17: { id: 17, name: "0 — The Fool", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, basePower: 5 }
};

console.log("\n=======================================================");
console.log("  ⚔️  VEILBOUND ARCANA — MATCH RESOLUTION SIMULATOR");
console.log("=======================================================\n");

// Scenario 1: Wands vs Swords (Suit advantage test)
const cardA = SAMPLE_CARDS[3];  // Queen of Wands (Power 3, Wands)
const cardB = SAMPLE_CARDS[11]; // Queen of Swords (Power 3, Swords)

console.log(`[Round 1: Elemental Advantage Test]`);
console.log(`  Player A plays: ${cardA.name} (${cardA.suit}, Base Power: ${cardA.basePower}, Upright)`);
console.log(`  Player B plays: ${cardB.name} (${cardB.suit}, Base Power: ${cardB.basePower}, Reversed)`);

const result1 = resolveBattleRound({
  cardA,
  energyA: 2,
  remainingEnergyA: 6,
  orientationA: "upright",

  cardB,
  energyB: 2,
  remainingEnergyB: 6,
  orientationB: "reversed",
});

console.log(`\n  Results:`);
console.log(`    Player A Power : ${result1.powerA} [Base 3 + Energy 2 + SuitBonus +${result1.suitBonusA} + Upright +1]`);
console.log(`    Player B Power : ${result1.powerB} [Base 3 + Energy 2 + SuitBonus +${result1.suitBonusB} + Reversed -1]`);
console.log(`    Round Winner   : ${result1.winner.toUpperCase()} (+1 Point)`);

// Scenario 2: Clamp Rule Verification (Zero-revert guarantee)
console.log(`\n-------------------------------------------------------`);
console.log(`[Round 2: Confidential Clamp Rule Test]`);
console.log(`  Player B attempts to bid 5 Energy when only 2 remain...`);

const result2 = resolveBattleRound({
  cardA: SAMPLE_CARDS[1],
  energyA: 1,
  remainingEnergyA: 4,
  orientationA: "upright",

  cardB: SAMPLE_CARDS[5],
  energyB: 5,                      // Illegal: exceeds remaining
  remainingEnergyB: 2,             // Only 2 remaining
  orientationB: "upright",
});

console.log(`  Player B Clamped Energy: ${result2.clampedEnergyB} (Silently clamped via FHE.select without reverting!)`);
console.log(`  Player A Power : ${result2.powerA} [Base 2 + Energy 1 + SuitBonus +${result2.suitBonusA} + Upright +1]`);
console.log(`  Player B Power : ${result2.powerB} [Base 2 + Energy 2 + SuitBonus +${result2.suitBonusB} + Upright +1]`);
console.log(`  Round Winner   : ${result2.winner.toUpperCase()}`);

console.log("\n=======================================================\n");
