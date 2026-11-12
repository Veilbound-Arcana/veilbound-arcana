import { Friend, Mission, ShopItem, TradeOffer } from "@/game/types";
import { MOCK_FRIENDS } from "@/data/friends";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchFriends(): Promise<Friend[]> {
  await delay(200);
  return [...MOCK_FRIENDS];
}

export async function fetchShopItems(): Promise<ShopItem[]> {
  await delay(180);
  return [
    {
      id: "shop-pack-v1",
      kind: "pack",
      setId: "V1",
      price: { currency: "shards", amount: 100 },
      grants: { packs: [{ setId: "V1", count: 1 }] },
    },
    {
      id: "shop-pack-v2",
      kind: "pack",
      setId: "V2",
      price: { currency: "shards", amount: 100 },
      grants: { packs: [{ setId: "V2", count: 1 }] },
    },
    {
      id: "shop-pack-v3",
      kind: "pack",
      setId: "V3",
      price: { currency: "shards", amount: 100 },
      grants: { packs: [{ setId: "V3", count: 1 }] },
    },
    {
      id: "shop-echo-1",
      kind: "echoExchange",
      price: { currency: "shards", amount: 50 },
      grants: { echoes: 500 },
    },
    {
      id: "shop-echo-2",
      kind: "echoExchange",
      price: { currency: "shards", amount: 100 },
      grants: { echoes: 1100 },
    },
    {
      id: "shop-bundle-1",
      kind: "bundle",
      price: { currency: "shards", amount: 0 },
      grants: { shards: 250, echoes: 1000 },
      demoOnly: true,
    },
  ];
}

export async function fetchVigils(): Promise<Mission[]> {
  await delay(150);
  const now = Date.now();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  return [
    {
      id: "vigil-daily-1",
      kind: "daily",
      titleKey: "Open 1 Arcana Pack",
      goal: 1,
      progress: 0,
      reward: { echoes: 150 },
      claimed: false,
      resetsAt: midnight.getTime(),
    },
    {
      id: "vigil-daily-2",
      kind: "daily",
      titleKey: "Win 1 Battle Sanctuary Duel",
      goal: 1,
      progress: 0,
      reward: { echoes: 150 },
      claimed: false,
      resetsAt: midnight.getTime(),
    },
    {
      id: "vigil-weekly-1",
      kind: "weekly",
      titleKey: "Complete 1 Arcana Trade",
      goal: 1,
      progress: 0,
      reward: { shards: 10 },
      claimed: false,
      resetsAt: now + 7 * 24 * 60 * 60 * 1000,
    },
  ];
}

export async function submitTradeOffer(offer: Omit<TradeOffer, "id" | "status">): Promise<TradeOffer> {
  await delay(300);
  return {
    ...offer,
    id: `trade-${Date.now()}`,
    status: "confirmed",
  };
}

export async function simulateFriendTradeAcceptance(): Promise<boolean> {
  await delay(1500); // 1.5s simulated partner reply as specified in Section 9.1
  return true;
}
