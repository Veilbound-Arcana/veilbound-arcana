import { ethers } from "ethers";
import { OFFICIAL_CARD_CATALOG, CardDefinition } from "@veilbound/sdk";
import { config } from "../config";

/**
 * Practice Bot (FR-20): automated opponent so a hackathon judge can finish a full
 * match alone. Uses its own Sepolia key (BOT_PRIVATE_KEY) when on-chain actions are
 * required; for lobby practice matches the shared SDK battle engine resolves rounds.
 */
export class PracticeBot {
  public readonly wallet: ethers.Wallet;
  public readonly botAddress: string;

  /** Vault starter deck: 4 Pages (cost 1) + Queen of Wands (cost 2) = 6 <= 12. */
  public static readonly STARTER_DECK: number[] = [1, 5, 9, 13, 3];

  constructor(privateKey?: string) {
    const key =
      privateKey ||
      config.botPrivateKey ||
      // Deterministic dev fallback so /health shows a stable address across restarts.
      "0x560859c65a26ba71d5a4f2d4b95a431d12a4c8f6b1e3d9a7c2f4b6d8e0a1c3e5";
    this.wallet = new ethers.Wallet(key);
    this.botAddress = this.wallet.address;
  }

  public getStarterDeck(): number[] {
    return [...PracticeBot.STARTER_DECK];
  }

  public deckCost(defIds: number[]): number {
    return defIds.reduce((sum, id) => sum + (OFFICIAL_CARD_CATALOG[id]?.cost ?? 0), 0);
  }

  /** Deal 3 distinct cards from a 5-card deck (server-side hand for practice mode). */
  public dealHand(deckDefIds: number[], count = 3): CardDefinition[] {
    const pool = [...deckDefIds];
    const hand: CardDefinition[] = [];
    while (hand.length < count && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      const defId = pool.splice(idx, 1)[0];
      const card = OFFICIAL_CARD_CATALOG[defId];
      if (card) hand.push(card);
    }
    return hand;
  }

  /**
   * Bot energy plan (vault spec): R1 spends 1-2, R2 spends 1-2 of what remains,
   * R3 dumps the entire remaining pool.
   */
  public generateRoundMove(round: number, remainingEnergy: number): { slot: number; energy: number } {
    const slot = Math.floor(Math.random() * 3) + 1;
    let energy: number;

    if (round >= 3) {
      energy = remainingEnergy;
    } else {
      const cap = Math.min(remainingEnergy, 2);
      energy = Math.min(remainingEnergy, 1 + Math.floor(Math.random() * Math.max(1, cap)));
    }

    return { slot, energy: Math.max(0, Math.min(energy, remainingEnergy)) };
  }

  public randomOrientation(): "upright" | "reversed" {
    return Math.random() < 0.5 ? "upright" : "reversed";
  }
}
