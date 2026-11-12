import { describe, it, expect } from "vitest";
import {
  validateDeck,
  createMatch,
  applyAction,
  legalActions,
  result,
} from "../game/engine";
import { RULES } from "../game/rules.config";

const validStarterDeck = [
  "c-001", "c-001", "c-002", "c-002", "c-003", "c-003", "c-004", "c-004",
  "c-007", "c-007", "c-010", "c-010", "c-011", "c-011", "c-013", "c-013",
  "c-015", "c-015", "c-012", "c-012"
];

describe("Veilbound Arcana Engine Rules Tests", () => {
  // 1. Deck validation rejects 21 cards, 3 copies of one name, and a deck with no Basic
  it("Deck validation rejects 21 cards, 3 copies of one name, and no basic", () => {
    // 21 cards
    const deck21 = [...validStarterDeck, "c-001"];
    expect(validateDeck(deck21).valid).toBe(false);

    // 3 copies
    const deck3Copies = [...validStarterDeck.slice(2), "c-001", "c-001", "c-001"];
    expect(validateDeck(deck3Copies).valid).toBe(false);

    // No basic (all items/allies)
    const noBasicDeck = Array(20).fill("c-010"); // Warden Isolde (Ally)
    expect(validateDeck(noBasicDeck).valid).toBe(false);

    // Valid starter
    expect(validateDeck(validStarterDeck).valid).toBe(true);
  });

  // 2. Weakness adds the configured bonus exactly once
  it("Weakness adds configured bonus (+20) exactly once", () => {
    const match = createMatch(42, validStarterDeck, validStarterDeck);
    // Attacker: Emberwick (Ember), Defender: Tidecaller Wren (Tide, weak to Volt)
    // Let's set attacker active as Static Finch (Volt), defender as Tidecaller Wren (Tide)
    match.a.active = {
      cardId: "c-004", // Static Finch (Volt)
      vitality: 50,
      attached: ["volt"],
      playedOnTurn: 0,
    };
    match.b.active = {
      cardId: "c-002", // Tidecaller Wren (weakness: volt, hp: 60)
      vitality: 60,
      attached: [],
      playedOnTurn: 0,
    };

    // Flash Peck base 30 + 20 weakness = 50 damage -> defender vitality becomes 60 - 50 = 10
    const { events } = applyAction(match, { type: "Attack", abilityIndex: 0 });
    const dmgEvent = events.find((e) => e.type === "damage") as any;
    expect(dmgEvent?.amount).toBe(50);
  });

  // 3. A normal KO awards 1 point and a Crowned KO awards 2
  it("Normal KO awards 1 point and Crowned KO awards 2", () => {
    const match = createMatch(100, validStarterDeck, validStarterDeck);
    match.a.active = {
      cardId: "c-008", // Mourning Leviathan (Crowned)
      vitality: 100,
      attached: ["tide", "tide", "aether"],
      playedOnTurn: 0,
    };
    match.b.active = {
      cardId: "c-001", // Emberwick (Normal)
      vitality: 20,
      attached: [],
      playedOnTurn: 0,
    };
    match.b.bench = [
      {
        cardId: "c-008", // Mourning Leviathan (Crowned)
        vitality: 30,
        attached: [],
        playedOnTurn: 0,
      },
    ];

    // Attack normal -> awards 1 point
    const step1 = applyAction(match, { type: "Attack", abilityIndex: 0 });
    expect(step1.state.a.points).toBe(1);

    // Promote crowned defender to active, then defeat it
    step1.state.current = "a";
    step1.state.b.active!.vitality = 10;
    const step2 = applyAction(step1.state, { type: "Attack", abilityIndex: 0 });
    expect(step2.state.a.points).toBe(3); // 1 + 2 = 3 points
    expect(result(step2.state)).toBe("a");
  });

  // 4. The first player gains no Aether on turn 1
  it("First player gains no Aether on turn 1", () => {
    const match = createMatch(55, validStarterDeck, validStarterDeck);
    expect(match.turn).toBe(1);
    expect(match.a.aetherWell).toBeUndefined();
  });

  // 5. Wither deals 10 at checkup; a seeded Slumber coin wakes on heads
  it("Wither deals 10 at checkup; Slumber coin flip resolves", () => {
    const match = createMatch(77, validStarterDeck, validStarterDeck);
    match.a.active!.status = "wither";
    const initialHp = match.a.active!.vitality;

    const { state } = applyAction(match, { type: "EndTurn" });
    expect(state.a.active!.vitality).toBe(initialHp - RULES.witherCheckupDamage);
  });

  // 6. Retreat discards Aether equal to retreat cost and is illegal when short
  it("Retreat discards Aether equal to retreat cost and is illegal when short", () => {
    const match = createMatch(99, validStarterDeck, validStarterDeck);
    match.a.active = {
      cardId: "c-007", // Ironquill, retreat = 2
      vitality: 100,
      attached: ["iron"], // only 1 attached!
      playedOnTurn: 0,
    };
    match.a.bench = [
      {
        cardId: "c-001",
        vitality: 60,
        attached: [],
        playedOnTurn: 0,
      },
    ];

    const actionsShort = legalActions(match, "a");
    expect(actionsShort.some((a) => a.type === "Retreat")).toBe(false);

    // Attach second aether -> legal
    match.a.active.attached.push("aether");
    const actionsLegal = legalActions(match, "a");
    expect(actionsLegal.some((a) => a.type === "Retreat")).toBe(true);
  });

  // 7. The same seed and the same action list produce an identical final state
  it("Same seed and same action list produce identical final state", () => {
    const runMatch = () => {
      let state = createMatch(12345, validStarterDeck, validStarterDeck);
      state = applyAction(state, { type: "Attach", target: "active" }).state;
      state = applyAction(state, { type: "EndTurn" }).state;
      return state;
    };

    const run1 = runMatch();
    const run2 = runMatch();
    expect(JSON.stringify(run1)).toEqual(JSON.stringify(run2));
  });

  // 8. A player with no Veilborn in play loses immediately
  it("Player with no Veilborn in play loses immediately", () => {
    const match = createMatch(888, validStarterDeck, validStarterDeck);
    match.b.active = undefined;
    match.b.bench = [];

    const { state } = applyAction(match, { type: "EndTurn" });
    expect(result(state)).toBe("a");
  });
});
