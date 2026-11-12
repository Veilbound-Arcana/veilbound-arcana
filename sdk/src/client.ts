import { ethers } from "ethers";
import { OFFICIAL_CARD_CATALOG } from "./catalog.js";
import { CardDefinition } from "./types.js";
import { validateDeck, DeckValidation } from "./deckRules.js";

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

  public validateDeck(defIds: number[]): DeckValidation {
    return validateDeck(defIds);
  }
}
