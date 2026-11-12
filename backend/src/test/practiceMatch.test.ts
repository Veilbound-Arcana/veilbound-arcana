import { test } from "node:test";
import assert from "node:assert/strict";
import { PracticeMatch } from "../match/practiceMatch";
import { PracticeBot } from "../bot/practiceBot";

test("PracticeMatch deals player hand and tracks energy pool", () => {
  const match = new PracticeMatch(PracticeBot.STARTER_DECK);
  const hand = match.getPlayerHand();
  assert.equal(hand.length, 3);
  assert.ok(hand[0].card.name);
  assert.ok(hand[0].orientation === "upright" || hand[0].orientation === "reversed");

  assert.equal(match.state.round, 1);
  assert.equal(match.state.playerEnergy, 6);
  assert.equal(match.state.botEnergy, 6);
  assert.equal(match.state.finished, false);
});

test("PracticeMatch resolves round with non-revert clamping", () => {
  const match = new PracticeMatch(PracticeBot.STARTER_DECK);
  
  // Submit overbid: 10 energy when starting pool is 6
  const outcome = match.playRound({ slot: 1, energy: 10 });
  assert.ok(outcome.resolution);
  assert.equal(match.state.playerEnergy, 0, "Overbid should clamp to remaining pool of 6");
  assert.equal(match.state.round, 2);
});

test("PracticeMatch finishes after 3 rounds or early 2-point lead", () => {
  const match = new PracticeMatch(PracticeBot.STARTER_DECK);
  
  while (!match.state.finished) {
    match.playRound({ slot: 1, energy: 1 });
  }

  assert.ok(match.state.finished);
  assert.ok(match.state.scoreA >= 0 && match.state.scoreB >= 0);
  assert.ok(match.state.round <= 4);
});
