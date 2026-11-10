import { CardDefinition } from "./types.js";
import { getSuitAdvantage } from "./catalog.js";

export interface BattleRoundInput {
  cardA: CardDefinition;
  energyA: number;
  remainingEnergyA: number;
  orientationA: "upright" | "reversed";

  cardB: CardDefinition;
  energyB: number;
  remainingEnergyB: number;
  orientationB: "upright" | "reversed";
}

export interface BattleRoundResolution {
  powerA: number;
  powerB: number;
  clampedEnergyA: number;
  clampedEnergyB: number;
  suitBonusA: number;
  suitBonusB: number;
  winner: "tie" | "playerA" | "playerB";
}

/**
 * Calculates confidential round power and resolves outcome.
 * Enforces the zero-revert clamp rule on energy inputs.
 */
export function resolveBattleRound(input: BattleRoundInput): BattleRoundResolution {
  // Clamp energy silently (never revert in FHEVM)
  const clampedEnergyA = Math.max(0, Math.min(input.energyA, input.remainingEnergyA));
  const clampedEnergyB = Math.max(0, Math.min(input.energyB, input.remainingEnergyB));

  const suitBonusA = getSuitAdvantage(input.cardA.suit, input.cardB.suit);
  const suitBonusB = getSuitAdvantage(input.cardB.suit, input.cardA.suit);

  const orientModifierA = input.orientationA === "upright" ? 1 : -1;
  const orientModifierB = input.orientationB === "upright" ? 1 : -1;

  const powerA = input.cardA.basePower + clampedEnergyA + suitBonusA + orientModifierA;
  const powerB = input.cardB.basePower + clampedEnergyB + suitBonusB + orientModifierB;

  let winner: "tie" | "playerA" | "playerB" = "tie";
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
