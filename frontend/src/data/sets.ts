import { SetDef } from "@/game/types";
import { ALL_CARDS } from "./generateCards";
import { ECONOMY } from "@/game/economy.config";

export const SETS: SetDef[] = [
  {
    id: "V1",
    badge: "HC",
    title: "The Hollow Crown",
    featuredCardId: "c-008", // Mourning Leviathan
    cardIds: ALL_CARDS.filter((c) => c.setId === "V1").map((c) => c.id),
    dropTable: ECONOMY.dropTable.slots4to5,
  },
  {
    id: "V2",
    badge: "TL",
    title: "Tidebound Lanterns",
    featuredCardId: "c-012", // Veilhearth Sentinel
    cardIds: ALL_CARDS.filter((c) => c.setId === "V2").map((c) => c.id),
    dropTable: ECONOMY.dropTable.slots4to5,
  },
  {
    id: "V3",
    badge: "AC",
    title: "Ashen Choir",
    featuredCardId: "c-009", // Marrow Queen
    cardIds: ALL_CARDS.filter((c) => c.setId === "V3").map((c) => c.id),
    dropTable: ECONOMY.dropTable.slots4to5,
  },
];

export const SET_MAP: Record<string, SetDef> = Object.fromEntries(
  SETS.map((s) => [s.id, s])
);
