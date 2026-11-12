import { Contract, ContractRunner, ContractTransactionReceipt, ContractTransactionResponse, Interface, Log } from "ethers";
import {
  ARCANA_CARDS_ABI,
  CARD_CATALOG_ABI,
  DUEL_ENGINE_ABI,
  FATE_TOKEN_ABI,
  MARKET_ABI,
  STAKE_ESCROW_ABI,
  TAROT_GACHA_ABI,
} from "./abi.js";
import { VeilboundAddresses, resolveAddresses } from "./config.js";

export interface PityMeter {
  pullsWithoutRare: bigint;
  pullsWithoutEpic: bigint;
  totalPulls: bigint;
}

export interface MatchSummary {
  playerA: string;
  playerB: string;
  currentRound: number;
  state: number;
  winner: string;
  scoreA: number;
  scoreB: number;
}

export interface OnChainCardInstance {
  tokenId: bigint;
  isSealed: boolean;
  defId: number;
  drawnAt: bigint;
}

export interface ParsedEvent {
  name: string;
  args: Record<string, unknown> & ArrayLike<unknown>;
  address: string;
  transactionHash: string;
  blockNumber: number;
}

/** Extract a decoded event log from a transaction receipt by event name. */
export function findEvent(
  receipt: ContractTransactionReceipt | null,
  contractInterface: Interface,
  eventName: string
): ParsedEvent | undefined {
  if (!receipt) return undefined;
  for (const log of receipt.logs as Log[]) {
    try {
      const parsed = contractInterface.parseLog(log);
      if (parsed?.name === eventName) {
        return {
          name: parsed.name,
          args: parsed.args,
          address: log.address,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        };
      }
    } catch {
      // Not our event — continue scanning.
    }
  }
  return undefined;
}

/** Wait for a tx and return its receipt (throws on revert). */
export async function waitTx(tx: ContractTransactionResponse): Promise<ContractTransactionReceipt | null> {
  return tx.wait();
}

abstract class BaseContract {
  public readonly contract: Contract;
  public readonly address: string;

  constructor(address: string, abi: readonly string[], runner: ContractRunner) {
    this.address = address;
    this.contract = new Contract(address, [...abi], runner);
  }

  public get interface(): Interface {
    return this.contract.interface;
  }
}

/** FateToken (ERC-7984 confidential balance) — faucet & payment API. */
export class FateTokenContract extends BaseContract {
  constructor(runner: ContractRunner, address?: string) {
    super(address || resolveAddresses().fateToken, FATE_TOKEN_ABI, runner);
  }

  claimFaucet(): Promise<ContractTransactionResponse> {
    return this.contract.claimFaucet() as Promise<ContractTransactionResponse>;
  }

  balanceOf(account: string): Promise<bigint> {
    return this.contract.balanceOf(account) as Promise<bigint>;
  }

  lastFaucetClaim(account: string): Promise<bigint> {
    return this.contract.lastFaucetClaim(account) as Promise<bigint>;
  }

  faucetAmount(): Promise<bigint> {
    return this.contract.FAUCET_AMOUNT() as Promise<bigint>;
  }

  faucetCooldown(): Promise<bigint> {
    return this.contract.FAUCET_COOLDOWN() as Promise<bigint>;
  }

  approve(spender: string, amount: bigint): Promise<ContractTransactionResponse> {
    return this.contract.approve(spender, amount) as Promise<ContractTransactionResponse>;
  }

  allowance(owner: string, spender: string): Promise<bigint> {
    return this.contract.allowance(owner, spender) as Promise<bigint>;
  }

  parseFaucetClaim(receipt: ContractTransactionReceipt | null) {
    return findEvent(receipt, this.interface, "FaucetClaimed");
  }
}

/** TarotGacha — Single / Three-Card spreads, published odds, encrypted pity meter. */
export class TarotGachaContract extends BaseContract {
  constructor(runner: ContractRunner, address?: string) {
    super(address || resolveAddresses().tarotGacha, TAROT_GACHA_ABI, runner);
  }

  drawSingle(): Promise<ContractTransactionResponse> {
    return this.contract.drawSingle() as Promise<ContractTransactionResponse>;
  }

  drawThreeCard(): Promise<ContractTransactionResponse> {
    return this.contract.drawThreeCard() as Promise<ContractTransactionResponse>;
  }

  getPityMeter(player: string): Promise<PityMeter> {
    return this.contract.getPityMeter(player) as Promise<PityMeter>;
  }

  singleSpreadPrice(): Promise<bigint> {
    return this.contract.SINGLE_SPREAD_PRICE() as Promise<bigint>;
  }

  threeSpreadPrice(): Promise<bigint> {
    return this.contract.THREE_SPREAD_PRICE() as Promise<bigint>;
  }

  parseSpreadDrawn(receipt: ContractTransactionReceipt | null) {
    return findEvent(receipt, this.interface, "SpreadDrawn");
  }
}

/** ArcanaCards (ERC-721) — Sealed/Unsealed lifecycle. */
export class ArcanaCardsContract extends BaseContract {
  constructor(runner: ContractRunner, address?: string) {
    super(address || resolveAddresses().arcanaCards, ARCANA_CARDS_ABI, runner);
  }

  ownerOf(tokenId: bigint | number): Promise<string> {
    return this.contract.ownerOf(tokenId) as Promise<string>;
  }

  getCardInstance(tokenId: bigint | number): Promise<OnChainCardInstance> {
    return this.contract.getCardInstance(tokenId) as Promise<OnChainCardInstance>;
  }

  getSealedHandle(tokenId: bigint | number): Promise<string> {
    return this.contract.getSealedHandle(tokenId) as Promise<string>;
  }

  unseal(tokenId: bigint | number, revealedDefId: number): Promise<ContractTransactionResponse> {
    return this.contract.unseal(tokenId, revealedDefId) as Promise<ContractTransactionResponse>;
  }

  parseCardUnsealed(receipt: ContractTransactionReceipt | null) {
    return findEvent(receipt, this.interface, "CardUnsealed");
  }
}

/** CardCatalog — public 20-card registry. */
export class CardCatalogContract extends BaseContract {
  constructor(runner: ContractRunner, address?: string) {
    super(address || resolveAddresses().cardCatalog, CARD_CATALOG_ABI, runner);
  }

  getCard(cardId: number) {
    return this.contract.getCard(cardId) as Promise<{
      id: bigint;
      name: string;
      suit: bigint;
      arcana: bigint;
      rarity: bigint;
      cost: bigint;
      basePower: bigint;
      abilityId: bigint;
    }>;
  }
}

/** DuelEngine — 3-round hidden commit/reveal state machine. */
export class DuelEngineContract extends BaseContract {
  constructor(runner: ContractRunner, address?: string) {
    super(address || resolveAddresses().duelEngine, DUEL_ENGINE_ABI, runner);
  }

  createMatch(): Promise<ContractTransactionResponse> {
    return this.contract.createMatch() as Promise<ContractTransactionResponse>;
  }

  joinMatch(matchId: bigint | number): Promise<ContractTransactionResponse> {
    return this.contract.joinMatch(matchId) as Promise<ContractTransactionResponse>;
  }

  lockDeck(matchId: bigint | number, tokenIds: (bigint | number)[]): Promise<ContractTransactionResponse> {
    if (tokenIds.length !== 5) throw new Error("lockDeck requires exactly 5 tokenIds");
    return this.contract.lockDeck(matchId, tokenIds) as Promise<ContractTransactionResponse>;
  }

  commitRound(
    matchId: bigint | number,
    encryptedCardSlot: string,
    encryptedEnergy: string
  ): Promise<ContractTransactionResponse> {
    return this.contract.commitRound(matchId, encryptedCardSlot, encryptedEnergy) as Promise<ContractTransactionResponse>;
  }

  resolveRound(matchId: bigint | number, roundWinner: number): Promise<ContractTransactionResponse> {
    return this.contract.resolveRound(matchId, roundWinner) as Promise<ContractTransactionResponse>;
  }

  claimTimeoutWin(matchId: bigint | number): Promise<ContractTransactionResponse> {
    return this.contract.claimTimeoutWin(matchId) as Promise<ContractTransactionResponse>;
  }

  getMatchSummary(matchId: bigint | number): Promise<MatchSummary> {
    return this.contract.getMatchSummary(matchId) as Promise<MatchSummary>;
  }

  commitTimeout(): Promise<bigint> {
    return this.contract.commitTimeout() as Promise<bigint>;
  }

  parseRoundResolved(receipt: ContractTransactionReceipt | null) {
    return findEvent(receipt, this.interface, "RoundResolved");
  }

  parseMatchFinished(receipt: ContractTransactionReceipt | null) {
    return findEvent(receipt, this.interface, "MatchFinished");
  }
}

/** StakeEscrow — optional 1-NFT Ante mode with tier matching. */
export class StakeEscrowContract extends BaseContract {
  constructor(runner: ContractRunner, address?: string) {
    super(address || resolveAddresses().stakeEscrow, STAKE_ESCROW_ABI, runner);
  }

  depositStake(matchId: bigint | number, tokenId: bigint | number): Promise<ContractTransactionResponse> {
    return this.contract.depositStake(matchId, tokenId) as Promise<ContractTransactionResponse>;
  }

  stakeEnabled(): Promise<boolean> {
    return this.contract.stakeEnabled() as Promise<boolean>;
  }
}

/** Market — atomic 1-to-1 NFT swap escrow. */
export class MarketContract extends BaseContract {
  constructor(runner: ContractRunner, address?: string) {
    super(address || resolveAddresses().market, MARKET_ABI, runner);
  }

  createSwapOffer(offeredTokenId: bigint | number, desiredTokenId: bigint | number): Promise<ContractTransactionResponse> {
    return this.contract.createSwapOffer(offeredTokenId, desiredTokenId) as Promise<ContractTransactionResponse>;
  }

  acceptSwapOffer(offerId: bigint | number): Promise<ContractTransactionResponse> {
    return this.contract.acceptSwapOffer(offerId) as Promise<ContractTransactionResponse>;
  }

  cancelSwapOffer(offerId: bigint | number): Promise<ContractTransactionResponse> {
    return this.contract.cancelSwapOffer(offerId) as Promise<ContractTransactionResponse>;
  }

  parseSwapCreated(receipt: ContractTransactionReceipt | null) {
    return findEvent(receipt, this.interface, "SwapCreated");
  }
}

/** Bundle of all typed contract wrappers bound to one runner (provider or signer). */
export class VeilboundContracts {
  public readonly addresses: VeilboundAddresses;
  public readonly fateToken: FateTokenContract;
  public readonly tarotGacha: TarotGachaContract;
  public readonly arcanaCards: ArcanaCardsContract;
  public readonly cardCatalog: CardCatalogContract;
  public readonly duelEngine: DuelEngineContract;
  public readonly stakeEscrow: StakeEscrowContract;
  public readonly market: MarketContract;

  constructor(runner: ContractRunner, addresses: VeilboundAddresses = resolveAddresses()) {
    this.addresses = addresses;
    this.fateToken = new FateTokenContract(runner, addresses.fateToken);
    this.tarotGacha = new TarotGachaContract(runner, addresses.tarotGacha);
    this.arcanaCards = new ArcanaCardsContract(runner, addresses.arcanaCards);
    this.cardCatalog = new CardCatalogContract(runner, addresses.cardCatalog);
    this.duelEngine = new DuelEngineContract(runner, addresses.duelEngine);
    this.stakeEscrow = new StakeEscrowContract(runner, addresses.stakeEscrow);
    this.market = new MarketContract(runner, addresses.market);
  }

  /** Read-only bundle bound to a provider. */
  static connect(provider: ContractRunner, addresses?: VeilboundAddresses): VeilboundContracts {
    return new VeilboundContracts(provider, addresses);
  }

  /** Signer-bound bundle for write operations. */
  static connectSigner(signer: ContractRunner, addresses?: VeilboundAddresses): VeilboundContracts {
    return new VeilboundContracts(signer, addresses);
  }
}
