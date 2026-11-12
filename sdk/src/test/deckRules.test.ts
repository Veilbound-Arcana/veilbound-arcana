import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDeck, canAddCard, filterCards, rarityTierDiff } from "../deckRules.js";
import { OFFICIAL_CARD_CATALOG } from "../catalog.js";

test("starter deck of five commons is valid and costs 5", () => {
  const result = validateDeck([1, 2, 5, 9, 13]);
  assert.equal(result.valid, true);
  assert.equal(result.totalCost, 5);
});

test("deck with more than 12 cost is rejected", () => {
  // 4 legendaries (16) + 1 common
  const result = validateDeck([17, 18, 19, 20, 1]);
  assert.equal(result.valid, false);
  assert.match(result.error ?? "", /exceeds maximum 12/);
});

test("more than 2 duplicates is rejected", () => {
  const result = validateDeck([1, 1, 1, 2, 5]);
  assert.equal(result.valid, false);
  assert.match(result.error ?? "", /duplicates/);
});

test("deck size must be exactly 5", () => {
  assert.equal(validateDeck([1, 2, 3]).valid, false);
  assert.equal(validateDeck([1, 2, 3, 4, 5, 6]).valid, false);
});

test("canAddCard blocks third copy", () => {
  assert.equal(canAddCard([1, 1], 1).valid, false);
  assert.equal(canAddCard([1, 1], 2).valid, true);
});

test("canAddCard blocks cost overflow before commit", () => {
  // 12 cost already: four legendaries (16) not allowed; use 3 legendaries (12) + fill
  const deck = [17, 18, 19]; // cost 12
  const result = canAddCard(deck, 20);
  assert.equal(result.valid, false);
});

test("filterCards supports suit, rarity and arcana", () => {
  assert.equal(filterCards({ suit: "Wands" }).length, 4);
  assert.equal(filterCards({ rarity: "Legendary" }).length, 4);
  assert.equal(filterCards({ arcana: "Major" }).length, 4);
  assert.equal(filterCards({ suit: "Cups", rarity: "Rare" }).length, 1);
});

test("rarity tier difference for stake matching", () => {
  assert.equal(rarityTierDiff("Common", "Rare"), 1);
  assert.equal(rarityTierDiff("Common", "Epic"), 2);
  assert.equal(rarityTierDiff("Legendary", "Epic"), 1);
});

test("catalog has 20 cards with official odds pools", () => {
  const cards = Object.values(OFFICIAL_CARD_CATALOG);
  assert.equal(cards.length, 20);
  const commons = cards.filter((c) => c.rarity === "Common");
  const rares = cards.filter((c) => c.rarity === "Rare");
  const epics = cards.filter((c) => c.rarity === "Epic");
  const legendaries = cards.filter((c) => c.rarity === "Legendary");
  assert.equal(commons.length, 8);
  assert.equal(rares.length, 4);
  assert.equal(epics.length, 4);
  assert.equal(legendaries.length, 4);
});
