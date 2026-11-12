import { test } from "node:test";
import assert from "node:assert/strict";
import { clampEnergy, clampSlot, buildRoundCommitInputs, createMockEncryptedInput } from "../encryption.js";
import { GACHA_ODDS, GACHA_THRESHOLDS, PITY, DISCLAIMER, fateToUnits, unitsToFate } from "../config.js";

test("clampEnergy silently trims overbids (zero-revert mirror)", () => {
  assert.equal(clampEnergy(9, 3), 3);
  assert.equal(clampEnergy(-1, 3), 0);
  assert.equal(clampEnergy(Number.NaN, 3), 0);
  assert.equal(clampEnergy(2, 6), 2);
});

test("clampSlot keeps hand slot within 1..3", () => {
  assert.equal(clampSlot(0), 1);
  assert.equal(clampSlot(7), 3);
  assert.equal(clampSlot(2), 2);
});

test("round commit inputs produce deterministic handles per salt", () => {
  const a = buildRoundCommitInputs(2, 3, 6, "salt-1");
  const b = buildRoundCommitInputs(2, 3, 6, "salt-1");
  const c = buildRoundCommitInputs(2, 3, 6, "salt-2");
  assert.equal(a.slot.handle, b.slot.handle);
  assert.notEqual(a.slot.handle, c.slot.handle);
  assert.match(a.slot.handle, /^0x[0-9a-f]{64}$/);
  assert.equal(a.energy.handle, b.energy.handle);
});

test("commit inputs clamp overbids before encryption", () => {
  const inputs = buildRoundCommitInputs(9, 99, 2, "salt-x");
  // slot clamped to 3, energy clamped to 2
  const expectedSlot = createMockEncryptedInput(3, "salt-x");
  const expectedEnergy = createMockEncryptedInput(2, "salt-x");
  assert.equal(inputs.slot.handle, expectedSlot.handle);
  assert.equal(inputs.energy.handle, expectedEnergy.handle);
});

test("gacha odds and thresholds are consistent", () => {
  assert.equal(GACHA_ODDS.common + GACHA_ODDS.rare + GACHA_ODDS.epic + GACHA_ODDS.legendary, 100);
  assert.equal(GACHA_THRESHOLDS.common, 152);
  assert.equal(GACHA_THRESHOLDS.rare, 216);
  assert.equal(GACHA_THRESHOLDS.epic, 247);
  assert.equal(PITY.legendaryHard, 25);
});

test("FATE unit conversion uses 6 decimals", () => {
  assert.equal(fateToUnits(1), 1_000_000n);
  assert.equal(fateToUnits(2.5), 2_500_000n);
  assert.equal(unitsToFate(10_000_000n), 10);
});

test("mandatory disclaimer text is exact", () => {
  assert.equal(DISCLAIMER, "This project is experimental confidential software. Use at your own risk.");
});
