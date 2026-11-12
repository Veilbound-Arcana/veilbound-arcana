import {
  CardDefinition,
  OFFICIAL_CARD_CATALOG,
  RoundResolution,
  clampEnergy,
  resolveBattleRound,
} from "@veilbound/sdk";
import { PracticeBot } from "../bot/practiceBot";

export interface PlayerCommit {
  slot: number;
  energy: number;
}

export interface PracticeRoundOutcome {
  resolution: RoundResolution;
  botMove: PlayerCommit;
  playerCard: CardDefinition;
  botCard: CardDefinition;
  playerEnergyLeft: number;
  botEnergyLeft: number;
  finished: boolean;
  winner: "A" | "B" | "draw";
}

/**
 * Server-side practice match. Both hands are dealt by the server and every round is
 * resolved with the SAME battle formula the DuelEngine contract uses
 * (base + energy + suit cycle + orientation, energy clamped never rejected).
 */
export class PracticeMatch {
  public readonly bot = new PracticeBot();

  private playerHand: CardDefinition[] = [];
  private botHand: CardDefinition[] = [];
  private playerOrientations: ("upright" | "reversed")[] = [];
  private botOrientations: ("upright" | "reversed")[] = [];

  private playerEnergy = 6;
  private botEnergy = 6;
  private scoreA = 0;
  private scoreB = 0;
  private round = 1;
  private finished = false;

  constructor(private playerDeckDefIds: number[]) {
    if (playerDeckDefIds.length !== 5) {
      playerDeckDefIds = PracticeBot.STARTER_DECK;
    }
    this.playerHand = this.bot.dealHand(playerDeckDefIds);
    this.botHand = this.bot.dealHand(PracticeBot.STARTER_DECK);
    this.playerOrientations = this.playerHand.map(() => this.bot.randomOrientation());
    this.botOrientations = this.botHand.map(() => this.bot.randomOrientation());
  }

  public get state() {
    return {
      round: this.round,
      scoreA: this.scoreA,
      scoreB: this.scoreB,
      playerEnergy: this.playerEnergy,
      botEnergy: this.botEnergy,
      finished: this.finished,
    };
  }

  /** Public view of the player's confidential hand (decrypted locally, owner-only). */
  public getPlayerHand(): { card: CardDefinition; orientation: "upright" | "reversed" }[] {
    return this.playerHand.map((card, i) => ({ card, orientation: this.playerOrientations[i] }));
  }

  public playRound(playerMove: PlayerCommit): PracticeRoundOutcome {
    if (this.finished) throw new Error("PracticeMatch already finished");

    const slot = Math.max(1, Math.min(3, Math.floor(playerMove.slot)));
    const playerCard = this.playerHand[slot - 1];
    if (!playerCard) throw new Error("Invalid hand slot");

    // Zero-revert mirror: clamp instead of rejecting illegal energy.
    const playerEnergyBid = clampEnergy(playerMove.energy, this.playerEnergy);
    this.playerEnergy -= playerEnergyBid;

    const botMove = this.bot.generateRoundMove(this.round, this.botEnergy);
    const botCard = this.botHand[botMove.slot - 1];
    this.botEnergy -= botMove.energy;

    const result = resolveBattleRound({
      cardA: playerCard,
      energyA: playerEnergyBid,
      remainingEnergyA: this.playerEnergy + playerEnergyBid,
      orientationA: this.playerOrientations[slot - 1],
      cardB: botCard,
      energyB: botMove.energy,
      remainingEnergyB: this.botEnergy + botMove.energy,
      orientationB: this.botOrientations[botMove.slot - 1],
    });

    if (result.winner === "playerA") this.scoreA += 1;
    if (result.winner === "playerB") this.scoreB += 1;

    const winner: "A" | "B" | "tie" =
      result.winner === "playerA" ? "A" : result.winner === "playerB" ? "B" : "tie";

    const decided = this.scoreA >= 2 || this.scoreB >= 2 || this.round >= 3;
    if (decided) this.finished = true;

    const resolution: RoundResolution = {
      round: this.round,
      winner,
      scoreA: this.scoreA,
      scoreB: this.scoreB,
      powerA: result.powerA,
      powerB: result.powerB,
      breakdownA: `${playerCard.basePower} base + ${result.clampedEnergyA} energy + ${result.suitBonusA} suit + ${this.playerOrientations[slot - 1] === "upright" ? 1 : -1} orientation`,
      breakdownB: `${botCard.basePower} base + ${botMove.energy} energy + ${result.suitBonusB} suit + ${this.botOrientations[botMove.slot - 1] === "upright" ? 1 : -1} orientation`,
    };

    const outcome: PracticeRoundOutcome = {
      resolution,
      botMove,
      playerCard,
      botCard,
      playerEnergyLeft: this.playerEnergy,
      botEnergyLeft: this.botEnergy,
      finished: this.finished,
      winner: this.finished ? (this.scoreA > this.scoreB ? "A" : this.scoreB > this.scoreA ? "B" : "draw") : winner === "tie" ? "draw" : winner,
    };

    if (!this.finished) this.round += 1;
    return outcome;
  }
}
