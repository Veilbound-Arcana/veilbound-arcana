import {
  Action,
  GameEvent,
  MatchState,
  Side,
  Slot,
} from "./types";
import { RULES } from "./rules.config";
import { CARD_MAP } from "@/data/generateCards";
import { SeededRng } from "./rng";

export function validateDeck(cardIds: string[]): { valid: boolean; reason?: string } {
  if (cardIds.length !== RULES.deckSize) {
    return { valid: false, reason: `Deck must contain exactly ${RULES.deckSize} cards.` };
  }

  const counts: Record<string, number> = {};
  let hasBasic = false;

  for (const id of cardIds) {
    const card = CARD_MAP[id];
    if (!card) return { valid: false, reason: `Unknown card: ${id}` };

    counts[card.name] = (counts[card.name] || 0) + 1;
    if (counts[card.name] > RULES.maxDuplicatesPerCard) {
      return { valid: false, reason: `Maximum ${RULES.maxDuplicatesPerCard} copies allowed for ${card.name}.` };
    }

    if (card.kind === "veilborn" && card.stage === "basic") {
      hasBasic = true;
    }
  }

  if (!hasBasic) {
    return { valid: false, reason: `Deck must have at least ${RULES.minBasicCards} Basic Veilborn.` };
  }

  return { valid: true };
}

export function createMatch(
  seed: number,
  deckAIds: string[],
  deckBIds: string[]
): MatchState {
  const rng = new SeededRng(seed);

  const shuffleA = rng.shuffle(deckAIds);
  const shuffleB = rng.shuffle(deckBIds);

  const handA = shuffleA.splice(0, RULES.initialHandSize);
  const handB = shuffleB.splice(0, RULES.initialHandSize);

  // Auto-place initial basic in active if found
  const basicIdxA = handA.findIndex((id) => CARD_MAP[id]?.stage === "basic");
  const basicCardA = basicIdxA >= 0 ? handA.splice(basicIdxA, 1)[0] : handA[0];

  const basicIdxB = handB.findIndex((id) => CARD_MAP[id]?.stage === "basic");
  const basicCardB = basicIdxB >= 0 ? handB.splice(basicIdxB, 1)[0] : handB[0];

  const cardDefA = CARD_MAP[basicCardA];
  const cardDefB = CARD_MAP[basicCardB];

  const activeA: Slot = {
    cardId: basicCardA,
    vitality: cardDefA?.vitality || 60,
    attached: [],
    playedOnTurn: 0,
  };

  const activeB: Slot = {
    cardId: basicCardB,
    vitality: cardDefB?.vitality || 60,
    attached: [],
    playedOnTurn: 0,
  };

  const sideA: Side = {
    deck: shuffleA,
    hand: handA,
    discard: [],
    active: activeA,
    bench: [],
    points: 0,
    supportPlayed: false,
    retreated: false,
    aetherWell: undefined, // First player skips aether gain on turn 1
  };

  const sideB: Side = {
    deck: shuffleB,
    hand: handB,
    discard: [],
    active: activeB,
    bench: [],
    points: 0,
    supportPlayed: false,
    retreated: false,
    aetherWell: "aether",
  };

  return {
    seed,
    turn: 1,
    current: "a",
    a: sideA,
    b: sideB,
    log: [],
  };
}

export function legalActions(state: MatchState, player: "a" | "b"): Action[] {
  if (state.over || state.current !== player) return [];

  const side = player === "a" ? state.a : state.b;
  const actions: Action[] = [];

  // End turn always legal
  actions.push({ type: "EndTurn" });

  // Play Basic from hand
  side.hand.forEach((cardId) => {
    const card = CARD_MAP[cardId];
    if (card?.kind === "veilborn" && card.stage === "basic") {
      if (!side.active) {
        actions.push({ type: "PlayBasic", cardId, target: "active" });
      } else if (side.bench.length < RULES.maxBenchSize) {
        actions.push({ type: "PlayBasic", cardId, target: "bench" });
      }
    }
  });

  // Attach Aether (if well has aether and haven't attached this turn)
  if (side.active && side.aetherWell) {
    actions.push({ type: "Attach", target: "active" });
    side.bench.forEach((_, idx) => {
      actions.push({ type: "Attach", target: "bench", benchIndex: idx });
    });
  }

  // Play Ally (max 1 per turn)
  if (!side.supportPlayed) {
    side.hand.forEach((cardId) => {
      const card = CARD_MAP[cardId];
      if (card?.kind === "ally") {
        actions.push({ type: "PlayAlly", cardId });
      }
    });
  }

  // Play Tool
  side.hand.forEach((cardId) => {
    const card = CARD_MAP[cardId];
    if (card?.kind === "tool") {
      if (side.active && !side.active.tool) {
        actions.push({ type: "PlayTool", cardId, target: "active" });
      }
      side.bench.forEach((b, idx) => {
        if (!b.tool) {
          actions.push({ type: "PlayTool", cardId, target: "bench", benchIndex: idx });
        }
      });
    }
  });

  // Retreat (once per turn, if sufficient attached energy)
  if (!side.retreated && side.active && side.bench.length > 0) {
    const activeDef = CARD_MAP[side.active.cardId];
    let retreatCost = activeDef?.retreat || 1;
    if (side.active.tool && CARD_MAP[side.active.tool]?.id === "c-011") {
      retreatCost = Math.max(0, retreatCost - 1);
    }
    if (side.active.attached.length >= retreatCost) {
      side.bench.forEach((_, idx) => {
        actions.push({ type: "Retreat", benchIndex: idx });
      });
    }
  }

  // Attack
  if (side.active && side.active.status !== "slumber") {
    const activeDef = CARD_MAP[side.active.cardId];
    if (activeDef?.abilities) {
      activeDef.abilities.forEach((ab, idx) => {
        // Check energy requirements
        if (side.active!.attached.length >= ab.cost.length) {
          actions.push({ type: "Attack", abilityIndex: idx });
        }
      });
    }
  }

  return actions;
}

export function applyAction(
  state: MatchState,
  action: Action
): { state: MatchState; events: GameEvent[] } {
  const events: GameEvent[] = [];
  const s: MatchState = JSON.parse(JSON.stringify(state));
  const activePlayer = s.current;
  const activeSide = activePlayer === "a" ? s.a : s.b;
  const oppSide = activePlayer === "a" ? s.b : s.a;

  switch (action.type) {
    case "PlayBasic": {
      const idx = activeSide.hand.indexOf(action.cardId);
      if (idx >= 0) {
        activeSide.hand.splice(idx, 1);
        const cardDef = CARD_MAP[action.cardId];
        const newSlot: Slot = {
          cardId: action.cardId,
          vitality: cardDef?.vitality || 60,
          attached: [],
          playedOnTurn: s.turn,
        };
        if (action.target === "active" && !activeSide.active) {
          activeSide.active = newSlot;
        } else {
          activeSide.bench.push(newSlot);
        }
      }
      break;
    }

    case "Attach": {
      if (activeSide.aetherWell) {
        const aspect = activeSide.aetherWell;
        activeSide.aetherWell = undefined; // Consumed for this turn
        if (action.target === "active" && activeSide.active) {
          activeSide.active.attached.push(aspect);
        } else if (
          action.target === "bench" &&
          action.benchIndex !== undefined &&
          activeSide.bench[action.benchIndex]
        ) {
          activeSide.bench[action.benchIndex].attached.push(aspect);
        }
      }
      break;
    }

    case "PlayAlly": {
      const idx = activeSide.hand.indexOf(action.cardId);
      if (idx >= 0) {
        activeSide.hand.splice(idx, 1);
        activeSide.supportPlayed = true;
        const cardDef = CARD_MAP[action.cardId];
        // Execute Ally effect (e.g. Warden Isolde heal 30)
        if (cardDef?.abilities?.[0]?.effect?.type === "heal" && activeSide.active) {
          const maxHp = CARD_MAP[activeSide.active.cardId]?.vitality || 60;
          activeSide.active.vitality = Math.min(
            maxHp,
            activeSide.active.vitality + 30
          );
        }
      }
      break;
    }

    case "PlayTool": {
      const idx = activeSide.hand.indexOf(action.cardId);
      if (idx >= 0) {
        activeSide.hand.splice(idx, 1);
        if (action.target === "active" && activeSide.active) {
          activeSide.active.tool = action.cardId;
        } else if (
          action.target === "bench" &&
          action.benchIndex !== undefined &&
          activeSide.bench[action.benchIndex]
        ) {
          activeSide.bench[action.benchIndex].tool = action.cardId;
        }
      }
      break;
    }

    case "Retreat": {
      if (activeSide.active && activeSide.bench[action.benchIndex]) {
        const activeDef = CARD_MAP[activeSide.active.cardId];
        let retreatCost = activeDef?.retreat || 1;
        if (activeSide.active.tool && CARD_MAP[activeSide.active.tool]?.id === "c-011") {
          retreatCost = Math.max(0, retreatCost - 1);
        }
        activeSide.active.attached.splice(0, retreatCost);
        activeSide.active.status = undefined; // Retreat clears status
        activeSide.retreated = true;

        const oldActive = activeSide.active;
        activeSide.active = activeSide.bench.splice(action.benchIndex, 1)[0];
        activeSide.bench.push(oldActive);
      }
      break;
    }

    case "Attack": {
      if (activeSide.active && oppSide.active) {
        const attackerDef = CARD_MAP[activeSide.active.cardId];
        const defenderDef = CARD_MAP[oppSide.active.cardId];
        const ability = attackerDef?.abilities?.[action.abilityIndex];

        let dmg = ability?.damage || 0;
        // Check weakness bonus (+20 damage when defender weakness equals attacker aspect)
        if (
          attackerDef?.aspect &&
          defenderDef?.weakness &&
          defenderDef.weakness === attackerDef.aspect
        ) {
          dmg += RULES.weaknessDamageBonus;
        }

        oppSide.active.vitality -= dmg;
        events.push({ type: "damage", target: oppSide.active.cardId, amount: dmg });

        // Apply ability effects
        if (ability?.effect) {
          if (ability.effect.type === "status" && ability.effect.status) {
            oppSide.active.status = ability.effect.status;
            events.push({
              type: "statusApplied",
              target: oppSide.active.cardId,
              status: ability.effect.status,
            });
          } else if (ability.effect.type === "heal" && ability.effect.amount) {
            const maxHp = attackerDef?.vitality || 60;
            activeSide.active.vitality = Math.min(
              maxHp,
              activeSide.active.vitality + ability.effect.amount
            );
          } else if (
            ability.effect.type === "benchDamage" &&
            ability.effect.amount &&
            oppSide.bench.length > 0
          ) {
            oppSide.bench[0].vitality -= ability.effect.amount;
            events.push({
              type: "damage",
              target: oppSide.bench[0].cardId,
              amount: ability.effect.amount,
            });
          }
        }

        // Check defender KO
        if (oppSide.active.vitality <= 0) {
          const crowned = defenderDef?.crowned;
          const pts = crowned ? RULES.crownedKoPoints : RULES.normalKoPoints;
          activeSide.points += pts;
          events.push({ type: "ko", target: oppSide.active.cardId, points: pts });
          events.push({ type: "pointGained", player: activePlayer, total: activeSide.points });

          oppSide.discard.push(oppSide.active.cardId);
          // Promote first benched if available
          if (oppSide.bench.length > 0) {
            oppSide.active = oppSide.bench.shift();
          } else {
            oppSide.active = undefined;
          }
        }

        // An attack ends the turn
        return endTurnSequence(s, events);
      }
      break;
    }

    case "EndTurn": {
      return endTurnSequence(s, events);
    }
  }

  s.log.push(...events);
  s.over = evaluateWinner(s);
  return { state: s, events };
}

function endTurnSequence(
  s: MatchState,
  events: GameEvent[]
): { state: MatchState; events: GameEvent[] } {
  // Checkup Phase
  const checkSide = s.current === "a" ? s.a : s.b;
  if (checkSide.active?.status === "wither") {
    checkSide.active.vitality -= RULES.witherCheckupDamage;
    events.push({
      type: "damage",
      target: checkSide.active.cardId,
      amount: RULES.witherCheckupDamage,
    });
  }

  if (checkSide.active?.status === "slumber") {
    const rng = new SeededRng(s.seed + s.turn * 31);
    const flip = rng.random() > 0.5 ? "heads" : "tails";
    events.push({ type: "coinFlip", result: flip });
    if (flip === "heads") {
      checkSide.active.status = undefined; // Wakes up
    }
  }

  // Switch Turn
  s.current = s.current === "a" ? "b" : "a";
  s.turn += 1;

  const nextSide = s.current === "a" ? s.a : s.b;
  nextSide.supportPlayed = false;
  nextSide.retreated = false;

  // Draw 1 card (skip if hand limit reached)
  if (nextSide.deck.length > 0 && nextSide.hand.length < RULES.maxHandLimit) {
    const drawn = nextSide.deck.shift()!;
    nextSide.hand.push(drawn);
    events.push({ type: "draw", player: s.current, cardId: drawn });
  }

  // Gain 1 Aether (first player skips on turn 1)
  if (!(s.turn === 2 && s.current === "b") && s.turn > 1) {
    nextSide.aetherWell = "aether";
  } else if (s.turn === 1) {
    nextSide.aetherWell = undefined;
  }

  s.log.push(...events);
  s.over = evaluateWinner(s);
  return { state: s, events };
}

function evaluateWinner(s: MatchState): "a" | "b" | "draw" | undefined {
  if (s.a.points >= RULES.pointsToWin && s.b.points >= RULES.pointsToWin) return "draw";
  if (s.a.points >= RULES.pointsToWin) return "a";
  if (s.b.points >= RULES.pointsToWin) return "b";

  if (!s.a.active && s.a.bench.length === 0) return "b";
  if (!s.b.active && s.b.bench.length === 0) return "a";

  if (s.turn >= RULES.maxTurnCap) {
    if (s.a.points > s.b.points) return "a";
    if (s.b.points > s.a.points) return "b";
    return "draw";
  }

  return undefined;
}

export function result(state: MatchState): "a" | "b" | "draw" | null {
  return state.over || null;
}
