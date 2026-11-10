import { ethers } from "ethers";
import { OFFICIAL_CARD_CATALOG } from "./catalog.js";
import { CardDefinition } from "./types.js";

export interface VeilboundContractAddresses {
  fateToken: string;
  catalog: string;
  arcanaCards: string;
  tarotGacha: string;
  duelEngine: string;
  stakeEscrow?: string;
  market?: string;
}

export class VeilboundClient {
  public provider: ethers.Provider;
  public signer?: ethers.Signer;
  public addresses: VeilboundContractAddresses;

  constructor(
    provider: ethers.Provider,
    addresses: VeilboundContractAddresses,
    signer?: ethers.Signer
  ) {
    this.provider = provider;
    this.addresses = addresses;
    this.signer = signer;
  }

  public getCardDefinition(id: number): CardDefinition {
    const card = OFFICIAL_CARD_CATALOG[id];
    if (!card) throw new Error(`Card ID ${id} not found in catalog`);
    return card;
  }

  public getAllCards(): CardDefinition[] {
    return Object.values(OFFICIAL_CARD_CATALOG);
  }

  public validateDeck(defIds: number[]): { valid: boolean; totalCost: number; error?: string } {
    if (defIds.length !== 5) {
      return { valid: false, totalCost: 0, error: "Deck must contain exactly 5 cards" };
    }

    let totalCost = 0;
    const counts: Record<number, number> = {};

    for (const id of defIds) {
      const card = this.getCardDefinition(id);
      totalCost += card.cost;
      counts[id] = (counts[id] || 0) + 1;
      if (counts[id] > 2) {
        return { valid: false, totalCost, error: `Card ${card.name} exceeds max 2 duplicates` };
      }
    }

    if (totalCost > 12) {
      return { valid: false, totalCost, error: `Total cost ${totalCost} exceeds maximum limit of 12` };
    }

    return { valid: true, totalCost };
  }
}
