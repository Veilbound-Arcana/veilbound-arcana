import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveBattleRound } from "../battleMath.js";
import { OFFICIAL_CARD_CATALOG, getSuitAdvantage } from "../catalog.js";
import { GAME_RULES } from "../config.js";

test("suit cycle follows Wands > Swords > Pentacles > Cups > Wands", () => {
  assert.equal(getSuitAdvantage("Wands", "Swords"), 1);
  assert.equal(getSuitAdvantage("Swords", "Pentacles"), 1);
  assert.equal(getSuitAdvantage("Pentacles", "Cups"), 1);
  assert.equal(getSuitAdvantage("Cups", "Wands"), 1);
  assert.equal(getSuitAdvantage("Swords", "Wands"), 0);
  assert.equal(getSuitAdvantage("None", "Wands"), 0);
});

test("zero-revert clamp trims energy above remaining pool", () => {
  const result = resolveBattleRound({
    cardA: OFFICIAL_CARD_CATALOG[3],
    energyA: 9,
    remainingEnergyA: 2,
    orientationA: "upright",
    cardB: OFFICIAL_CARD_CATALOG[11],
    energyB: 1,
    remainingEnergyB: 6,
    orientationB: "reversed",
  });

  assert.equal(result.clampedEnergyA, 2);
  assert.equal(result.clampedEnergyB, 1);
});

test("power formula: base + energy + suit bonus + orientation", () => {
  const result = resolveBattleRound({
    cardA: OFFICIAL_CARD_CATALOG[3], // Queen of Wands, power 3, Wands, Rare
    energyA: 2,
    remainingEnergyA: 6,
    orientationA: "upright",
    cardB: OFFICIAL_CARD_CATALOG[9], // Page of Swords, power 2, Swords, Common
    energyB: 1,
    remainingEnergyB: 6,
    orientationB: "reversed",
  });

  // A: 3 + 2 + 1 (Wands beats Swords) + 1 = 7
  assert.equal(result.powerA, 7);
  // B: 2 + 1 + 0 - 1 = 2
  assert.equal(result.powerB, 2);
  assert.equal(result.winner, "playerA");
});

test("orientation reversed subtracts one power", () => {
  const base = {
    cardA: OFFICIAL_CARD_CATALOG[1],
    energyA: 0,
    remainingEnergyA: 6,
    cardB: OFFICIAL_CARD_CATALOG[2],
    energyB: 0,
    remainingEnergyB: 6,
  };
  const upright = resolveBattleRound({ ...base, orientationA: "upright", orientationB: "upright" });
  const reversed = resolveBattleRound({ ...base, orientationA: "reversed", orientationB: "upright" });
  assert.equal(upright.powerA - reversed.powerA, 2); // +1 vs -1
});

test("equal power resolves as tie", () => {
  const result = resolveBattleRound({
    cardA: OFFICIAL_CARD_CATALOG[1],
    energyA: 1,
    remainingEnergyA: 6,
    orientationA: "upright",
    cardB: OFFICIAL_CARD_CATALOG[2],
    energyB: 1,
    remainingEnergyB: 6,
    orientationB: "upright",
  });
  assert.equal(result.winner, "tie");
});

test("official game numbers match kamus-angka", () => {
  assert.equal(GAME_RULES.DECK_SIZE, 5);
  assert.equal(GAME_RULES.MAX_DECK_COST, 12);
  assert.equal(GAME_RULES.ENERGY_POOL, 6);
  assert.equal(GAME_RULES.ROUNDS, 3);
  assert.equal(GAME_RULES.POINTS_TO_WIN, 2);
  assert.equal(GAME_RULES.COMMIT_TIMEOUT_DEMO_SEC, 120);
});
