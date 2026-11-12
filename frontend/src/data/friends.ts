import { Friend } from "@/game/types";

export const MOCK_FRIENDS: Friend[] = [
  {
    id: "f-001",
    name: "Lyra Whisperwind",
    code: "WARDEN-7182",
    level: 6,
    featuredCardIds: ["c-006", "c-008"],
    tradableCardIds: ["c-002", "c-004", "c-007"],
  },
  {
    id: "f-002",
    name: "Cassian Grey",
    code: "WARDEN-3391",
    level: 9,
    featuredCardIds: ["c-005", "c-012"],
    tradableCardIds: ["c-001", "c-003", "c-011"],
  },
  {
    id: "f-003",
    name: "Rowan Bramble",
    code: "WARDEN-9942",
    level: 4,
    featuredCardIds: ["c-003", "c-009"],
    tradableCardIds: ["c-004", "c-010"],
  },
  {
    id: "f-004",
    name: "Maeve Sunstrider",
    code: "WARDEN-4120",
    level: 7,
    featuredCardIds: ["c-006"],
    tradableCardIds: ["c-002", "c-005"],
  },
];
