import { Action, MatchState } from "./types";
import { legalActions } from "./engine";
import { CARD_MAP } from "@/data/generateCards";

export function getBotAction(state: MatchState): Action {
  const actions = legalActions(state, "b");
  if (actions.length === 0) return { type: "EndTurn" };

  const attackActions = actions.filter((a) => a.type === "Attack") as Extract<
    Action,
    { type: "Attack" }
  >[];

  // 1. If an attack scores the final point, play it
  if (state.b.points >= 2 && attackActions.length > 0 && state.a.active) {
    const activeA = state.a.active;
    for (const atk of attackActions) {
      const activeBDef = CARD_MAP[state.b.active!.cardId];
      const dmg = activeBDef?.abilities?.[atk.abilityIndex]?.damage || 0;
      if (dmg >= activeA.vitality) {
        return atk;
      }
    }
  }

  // 2. Play a Basic Veilborn when bench has room
  const playBasic = actions.find((a) => a.type === "PlayBasic");
  if (playBasic && state.b.bench.length < 3) {
    return playBasic;
  }

  // 3. Attach Aether if available
  const attach = actions.find((a) => a.type === "Attach");
  if (attach) {
    return attach;
  }

  // 4. Play Ally if damaged
  const ally = actions.find((a) => a.type === "PlayAlly");
  if (ally && state.b.active) {
    const maxHp = CARD_MAP[state.b.active.cardId]?.vitality || 60;
    if (state.b.active.vitality < maxHp * 0.5) {
      return ally;
    }
  }

  // 5. Attack with highest expected damage
  if (attackActions.length > 0) {
    let bestAtk = attackActions[0];
    let maxDmg = -1;
    for (const atk of attackActions) {
      const activeBDef = CARD_MAP[state.b.active!.cardId];
      const dmg = activeBDef?.abilities?.[atk.abilityIndex]?.damage || 0;
      if (dmg > maxDmg) {
        maxDmg = dmg;
        bestAtk = atk;
      }
    }
    return bestAtk;
  }

  return { type: "EndTurn" };
}

export const chooseBotAction = (state: MatchState, _side?: string): Action => getBotAction(state);
