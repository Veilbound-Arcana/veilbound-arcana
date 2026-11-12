/**
 * Human-readable ABIs for all Veilbound Arcana contracts (FHEVM Sepolia).
 * Keep in sync with contracts/contracts/*.sol.
 */

export const FATE_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function FAUCET_AMOUNT() view returns (uint256)",
  "function FAUCET_COOLDOWN() view returns (uint256)",
  "function lastFaucetClaim(address account) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function claimFaucet()",
  "event FaucetClaimed(address indexed recipient, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;

export const CARD_CATALOG_ABI = [
  "function TOTAL_CARDS() view returns (uint8)",
  "function getCard(uint8 cardId) view returns (tuple(uint8 id, string name, uint8 suit, uint8 arcana, uint8 rarity, uint8 cost, uint8 basePower, uint8 abilityId))",
  "function getCards(uint8[] cardIds) view returns (tuple(uint8 id, string name, uint8 suit, uint8 arcana, uint8 rarity, uint8 cost, uint8 basePower, uint8 abilityId)[])",
] as const;

export const ARCANA_CARDS_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function getCardInstance(uint256 tokenId) view returns (tuple(uint256 tokenId, bool isSealed, uint8 defId, uint256 drawnAt))",
  "function getSealedHandle(uint256 tokenId) view returns (bytes32)",
  "function unseal(uint256 tokenId, uint8 revealedDefId)",
  "event CardDrawn(address indexed owner, uint256 indexed tokenId, bool isSealed)",
  "event CardUnsealed(address indexed owner, uint256 indexed tokenId, uint8 defId)",
] as const;

export const TAROT_GACHA_ABI = [
  "function SINGLE_SPREAD_PRICE() view returns (uint256)",
  "function THREE_SPREAD_PRICE() view returns (uint256)",
  "function THRESHOLD_COMMON() view returns (uint8)",
  "function THRESHOLD_RARE() view returns (uint8)",
  "function THRESHOLD_EPIC() view returns (uint8)",
  "function drawSingle() returns (uint256)",
  "function drawThreeCard() returns (uint256[])",
  "function getPityMeter(address player) view returns (tuple(uint8 pullsWithoutRare, uint8 pullsWithoutEpic, uint8 totalPulls))",
  "event SpreadDrawn(address indexed player, uint8 count, uint256[] tokenIds)",
] as const;

export const DUEL_ENGINE_ABI = [
  "function commitTimeout() view returns (uint256)",
  "function createMatch() returns (uint256)",
  "function joinMatch(uint256 matchId)",
  "function lockDeck(uint256 matchId, uint256[5] tokenIds)",
  "function commitRound(uint256 matchId, bytes32 encryptedCardSlot, bytes32 encryptedEnergy)",
  "function resolveRound(uint256 matchId, uint8 roundWinner)",
  "function claimTimeoutWin(uint256 matchId)",
  "function getMatchSummary(uint256 matchId) view returns (address playerA, address playerB, uint8 currentRound, uint8 state, address winner, uint8 scoreA, uint8 scoreB)",
  "event MatchCreated(uint256 indexed matchId, address indexed creator)",
  "event MatchJoined(uint256 indexed matchId, address indexed opponent)",
  "event DeckLocked(uint256 indexed matchId, address indexed player)",
  "event RoundCommitted(uint256 indexed matchId, uint8 round, address indexed player)",
  "event RoundResolved(uint256 indexed matchId, uint8 round, uint8 roundWinner)",
  "event MatchFinished(uint256 indexed matchId, address indexed winner, uint8 scoreA, uint8 scoreB)",
] as const;

export const STAKE_ESCROW_ABI = [
  "function stakeEnabled() view returns (bool)",
  "function duelEngine() view returns (address)",
  "function depositStake(uint256 matchId, uint256 tokenId)",
  "function settleStake(uint256 matchId, address winner)",
  "function setStakeEnabled(bool enabled)",
  "event StakeDeposited(uint256 indexed matchId, address indexed player, uint256 tokenId)",
  "event StakeSettled(uint256 indexed matchId, address indexed winner, uint256 tokenWon)",
  "event StakeRefunded(uint256 indexed matchId)",
] as const;

export const MARKET_ABI = [
  "function createSwapOffer(uint256 offeredTokenId, uint256 desiredTokenId) returns (uint256)",
  "function acceptSwapOffer(uint256 offerId)",
  "function cancelSwapOffer(uint256 offerId)",
  "event SwapCreated(uint256 indexed offerId, address indexed initiator, uint256 offeredTokenId, uint256 desiredTokenId)",
  "event SwapAccepted(uint256 indexed offerId, address indexed counterparty)",
  "event SwapCancelled(uint256 indexed offerId)",
] as const;

export const ALL_ABIS = {
  fateToken: FATE_TOKEN_ABI,
  cardCatalog: CARD_CATALOG_ABI,
  arcanaCards: ARCANA_CARDS_ABI,
  tarotGacha: TAROT_GACHA_ABI,
  duelEngine: DUEL_ENGINE_ABI,
  stakeEscrow: STAKE_ESCROW_ABI,
  market: MARKET_ABI,
} as const;
