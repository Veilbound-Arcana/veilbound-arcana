import { Rarity } from "./types";

export const ECONOMY = {
  packPriceShards: 100,
  shardToEchoRate: 10,
  tradeFeeEchoes: 100,
  candleIntervalHours: 12,
  candleMaxStock: 2,
  omenDrawPerDay: 1,

  dailyVigilRewardEchoes: 150,
  weeklyVigilRewardShards: 10,

  xpPerPackOpened: 10,
  xpPerBattleWin: 30,
  xpPerBattleLoss: 10,

  folioUnlockLevel: 5,
  folioUnlockCards: 50,
  shrineUnlockLevel: 8,
  shrineUnlockCards: 80,

  pityMoonAfterPacks: 30,
  setMilestones: [25, 50, 75, 100] as const,

  dropTable: {
    slots1to3: {
      rune1: 70,
      rune2: 25,
      rune3: 5,
      rune4: 0,
      moon1: 0,
      moon2: 0,
      moon3: 0,
      veil: 0,
    } as Record<Rarity, number>,
    slots4to5: {
      rune1: 0,
      rune2: 40,
      rune3: 30,
      rune4: 15,
      moon1: 8,
      moon2: 4,
      moon3: 2,
      veil: 1,
    } as Record<Rarity, number>,
  },
};
