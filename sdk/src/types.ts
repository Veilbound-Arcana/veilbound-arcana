export type Suit = "None" | "Wands" | "Cups" | "Swords" | "Pentacles";
export type Arcana = "Minor" | "Major";
export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface CardDefinition {
  id: number;
  name: string;
  suit: Suit;
  arcana: Arcana;
  rarity: Rarity;
  cost: number;
  basePower: number;
  description: string;
}

export interface CardInstance {
  tokenId: number;
  isSealed: boolean;
  defId: number; // 0 if sealed
  drawnAt: number;
}

export type MatchState = "Created" | "Joined" | "InProgress" | "Finished" | "Forfeited";

export interface RoundCommitInput {
  slot: number;        // 1..3
  energy: number;      // 0..6
  matchId: number;
  round: number;
}

export interface RoundResult {
  round: number;
  winner: "tie" | "playerA" | "playerB";
  scoreA: number;
  scoreB: number;
}
