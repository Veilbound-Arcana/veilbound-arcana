import { ethers } from "ethers";

/**
 * Practice Bot (FR-20): Automated AI opponent for solo hackathon reviewers.
 * Automatically accepts match invites, locks a balanced 5-card deck, and submits encrypted commitments.
 */
export class PracticeBot {
  public wallet: ethers.Wallet;
  public botAddress: string;

  constructor(privateKey?: string, provider?: ethers.Provider) {
    const key = privateKey || ethers.Wallet.createRandom().privateKey;
    this.wallet = new ethers.Wallet(key, provider);
    this.botAddress = this.wallet.address;
  }

  /**
   * Generates a balanced 5-card deck from standard starter cards (total cost = 9 <= 12).
   */
  public getStarterDeck(): number[] {
    return [1, 5, 9, 13, 3]; // Page of Wands (1), Cups (1), Swords (1), Pentacles (1), Queen of Wands (2) -> cost = 6
  }

  /**
   * Generates automated round move: chooses card slot (1..3) and allocates energy (0..2).
   */
  public generateRoundCommit(round: number, remainingEnergy: number): { slot: number; energy: number; handle: string } {
    const slot = Math.floor(Math.random() * 3) + 1; // Slot 1, 2, or 3
    // Allocate energy sensibly across 3 rounds (pool 6)
    const maxBid = round === 3 ? remainingEnergy : Math.min(remainingEnergy, 3);
    const energy = Math.floor(Math.random() * (maxBid + 1));

    const handle = ethers.keccak256(
      ethers.toUtf8Bytes(`bot-commit-round-${round}-${slot}-${energy}-${Date.now()}`)
    );

    return { slot, energy, handle };
  }
}
