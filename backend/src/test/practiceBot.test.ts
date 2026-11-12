import { test } from "node:test";
import assert from "node:assert/strict";
import { PracticeBot } from "../bot/practiceBot";
import { GAME_RULES } from "@veilbound/sdk";

test("PracticeBot initializes with valid wallet address", () => {
  const bot = new PracticeBot();
  assert.ok(bot.botAddress.startsWith("0x"));
  assert.equal(bot.botAddress.length, 42);
});

test("PracticeBot starter deck complies with deck rules", () => {
  const bot = new PracticeBot();
  const deck = bot.getStarterDeck();
  assert.equal(deck.length, GAME_RULES.DECK_SIZE);
  const cost = bot.deckCost(deck);
  assert.ok(cost <= GAME_RULES.MAX_DECK_COST, `Cost ${cost} exceeds ${GAME_RULES.MAX_DECK_COST}`);
});

test("PracticeBot deals unique cards for 3-card hand", () => {
  const bot = new PracticeBot();
  const deck = bot.getStarterDeck();
  const hand = bot.dealHand(deck, 3);
  assert.equal(hand.length, 3);
  const ids = new Set(hand.map((c) => c.id));
  assert.equal(ids.size, 3, "Hand must contain 3 distinct cards");
});

test("PracticeBot round move spends within remaining energy", () => {
  const bot = new PracticeBot();
  for (let round = 1; round <= 3; round++) {
    const move = bot.generateRoundMove(round, 4);
    assert.ok(move.slot >= 1 && move.slot <= 3);
    assert.ok(move.energy >= 0 && move.energy <= 4);
  }

  // Round 3 dumps all remaining energy
  const finalMove = bot.generateRoundMove(3, 3);
  assert.equal(finalMove.energy, 3);
});
