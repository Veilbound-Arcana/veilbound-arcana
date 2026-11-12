import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Deck, PlayerSave } from "@/game/types";

export interface GameState {
  save: PlayerSave;
  sessionPackId: string | null;
  // Actions
  addCards: (cardIds: string[]) => { newCardIds: string[] };
  removeCard: (cardId: string) => void;
  spendCurrency: (type: "shards" | "echoes" | "candles", amount: number) => boolean;
  addCurrency: (type: "shards" | "echoes" | "candles", amount: number) => void;
  addEchoes: (amount: number) => void;
  deductEchoes: (amount: number) => void;
  addShards: (amount: number) => void;
  deductShards: (amount: number) => void;
  openPack: () => void;
  addXp: (amount: number) => void;
  saveDeck: (deck: Deck) => void;
  updateDeck: (id: string, name: string, cardIds: string[]) => void;
  deleteDeck: (deckId: string) => void;
  setActiveDeck: (deckId: string) => void;
  setSetting: <K extends keyof PlayerSave["settings"]>(key: K, value: PlayerSave["settings"][K]) => void;
  updateSettings: (settings: Partial<PlayerSave["settings"]>) => void;
  claimVigil: (vigilId: string, reward: { shards?: number; echoes?: number }) => void;
  setTutorialDone: () => void;
  setWardenName: (name: string) => void;
  setPlayerName: (name: string) => void;
  claimOmen: (cardId: string) => void;
  updateShrineCards: (cards: string[]) => void;
  resetSave: () => void;
}

const DEFAULT_STARTER_DECKS: Record<string, Deck> = {
  "spread-starter-ember": {
    id: "spread-starter-ember",
    name: "Embers of Dawn",
    cardIds: [
      "c-001", "c-001", "c-002", "c-002", "c-003", "c-003", "c-004", "c-004",
      "c-007", "c-007", "c-010", "c-010", "c-011", "c-011", "c-013", "c-013",
      "c-015", "c-015", "c-012", "c-012"
    ],
  },
  "spread-starter-tide": {
    id: "spread-starter-tide",
    name: "Tide & Mist",
    cardIds: [
      "c-002", "c-002", "c-003", "c-003", "c-005", "c-005", "c-006", "c-006",
      "c-008", "c-008", "c-010", "c-010", "c-011", "c-011", "c-014", "c-014",
      "c-016", "c-016", "c-018", "c-018"
    ],
  },
  "spread-starter-verdant": {
    id: "spread-starter-verdant",
    name: "Verdant Slumber",
    cardIds: [
      "c-003", "c-003", "c-004", "c-004", "c-005", "c-005", "c-009", "c-009",
      "c-010", "c-010", "c-011", "c-011", "c-015", "c-015", "c-017", "c-017",
      "c-019", "c-019", "c-020", "c-020"
    ],
  },
};

const INITIAL_CARDS: Record<string, number> = {
  "c-001": 2,
  "c-002": 2,
  "c-003": 2,
  "c-004": 2,
  "c-005": 2,
  "c-006": 2,
  "c-007": 2,
  "c-008": 1,
  "c-009": 1,
  "c-010": 2,
  "c-011": 2,
  "c-012": 1,
  "c-013": 2,
  "c-014": 2,
  "c-015": 2,
  "c-016": 2,
  "c-017": 2,
  "c-018": 2,
  "c-019": 2,
  "c-020": 2,
};

const INITIAL_SAVE: PlayerSave = {
  version: 1,
  level: 1,
  xp: 0,
  wardenName: "Warden",
  playerName: "Warden",
  tutorialDone: false,
  currencies: {
    shards: 100,
    echoes: 500,
    candles: 2,
    candleNextAt: Date.now() + 12 * 60 * 60 * 1000,
  },
  owned: INITIAL_CARDS,
  cards: INITIAL_CARDS,
  decks: DEFAULT_STARTER_DECKS,
  activeDeckId: "spread-starter-ember",
  unlocks: {
    folio: false,
    shrine: false,
  },
  settings: {
    language: "en",
    musicVolume: 0.4,
    sfxVolume: 0.7,
    fxVolume: 0.7,
    reducedMotion: false,
    reduceMotion: false,
    muted: false,
    tutorialCompleted: false,
  },
  shrineCards: ["c-008", "c-012", "c-009"],
  folioPages: { 1: [] },
  lastOmenDate: "",
  vigils: [
    { id: "vigil-1", progress: 0, claimed: false },
    { id: "vigil-2", progress: 0, claimed: false },
    { id: "vigil-3", progress: 0, claimed: false },
  ],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      save: INITIAL_SAVE,
      sessionPackId: null,

      addCards: (cardIds: string[]) => {
        const currentOwned = { ...get().save.owned };
        const newCardIds: string[] = [];

        cardIds.forEach((id) => {
          if (!currentOwned[id] || currentOwned[id] === 0) {
            newCardIds.push(id);
            currentOwned[id] = 1;
          } else {
            currentOwned[id] += 1;
          }
        });

        set((state) => ({
          save: {
            ...state.save,
            owned: currentOwned,
            cards: currentOwned,
          },
        }));

        get().addXp(cardIds.length * 5);
        return { newCardIds };
      },

      removeCard: (cardId: string) => {
        const currentOwned = { ...get().save.owned };
        if (currentOwned[cardId] && currentOwned[cardId] > 0) {
          currentOwned[cardId] -= 1;
          set((state) => ({
            save: {
              ...state.save,
              owned: currentOwned,
              cards: currentOwned,
            },
          }));
        }
      },

      spendCurrency: (type, amount) => {
        const cur = get().save.currencies[type];
        if (cur < amount) return false;
        set((state) => ({
          save: {
            ...state.save,
            currencies: {
              ...state.save.currencies,
              [type]: state.save.currencies[type] - amount,
            },
          },
        }));
        return true;
      },

      addCurrency: (type, amount) => {
        set((state) => ({
          save: {
            ...state.save,
            currencies: {
              ...state.save.currencies,
              [type]: state.save.currencies[type] + amount,
            },
          },
        }));
      },

      addEchoes: (amount) => {
        get().addCurrency("echoes", amount);
      },

      deductEchoes: (amount) => {
        get().spendCurrency("echoes", amount);
      },

      addShards: (amount) => {
        get().addCurrency("shards", amount);
      },

      deductShards: (amount) => {
        get().spendCurrency("shards", amount);
      },

      openPack: () => {
        const candles = get().save.currencies.candles;
        if (candles > 0) {
          get().spendCurrency("candles", 1);
        } else {
          get().spendCurrency("shards", 100);
        }
      },

      addXp: (amount) => {
        const currentSave = get().save;
        let xp = currentSave.xp + amount;
        let level = currentSave.level;
        let needed = 50 * level;

        while (xp >= needed) {
          xp -= needed;
          level += 1;
          needed = 50 * level;
        }

        const totalCards = Object.values(currentSave.owned).reduce((a, b) => a + b, 0);
        const unlocks = {
          folio: currentSave.unlocks.folio || level >= 5 || totalCards >= 50,
          shrine: currentSave.unlocks.shrine || level >= 8 || totalCards >= 80,
        };

        set((state) => ({
          save: {
            ...state.save,
            level,
            xp,
            unlocks,
          },
        }));
      },

      saveDeck: (deck) => {
        set((state) => ({
          save: {
            ...state.save,
            decks: {
              ...state.save.decks,
              [deck.id]: deck,
            },
          },
        }));
      },

      updateDeck: (id, name, cardIds) => {
        set((state) => ({
          save: {
            ...state.save,
            decks: {
              ...state.save.decks,
              [id]: { id, name, cardIds },
            },
          },
        }));
      },

      deleteDeck: (deckId) => {
        set((state) => {
          const newDecks = { ...state.save.decks };
          delete newDecks[deckId];
          return {
            save: {
              ...state.save,
              decks: newDecks,
            },
          };
        });
      },

      setActiveDeck: (deckId) => {
        set((state) => ({
          save: {
            ...state.save,
            activeDeckId: deckId,
          },
        }));
      },

      setSetting: (key, value) => {
        set((state) => ({
          save: {
            ...state.save,
            settings: {
              ...state.save.settings,
              [key]: value,
            },
          },
        }));
      },

      updateSettings: (settings) => {
        set((state) => {
          const s = { ...state.save.settings, ...settings };
          if (settings.fxVolume !== undefined) s.sfxVolume = settings.fxVolume;
          if (settings.sfxVolume !== undefined) s.fxVolume = settings.sfxVolume;
          if (settings.reduceMotion !== undefined) s.reducedMotion = settings.reduceMotion;
          if (settings.reducedMotion !== undefined) s.reduceMotion = settings.reducedMotion;
          return {
            save: {
              ...state.save,
              settings: s,
            },
          };
        });
      },

      claimVigil: (vigilId, reward) => {
        set((state) => {
          const vigils = state.save.vigils.map((v) =>
            v.id === vigilId ? { ...v, claimed: true } : v
          );
          const currencies = { ...state.save.currencies };
          if (reward.shards) currencies.shards += reward.shards;
          if (reward.echoes) currencies.echoes += reward.echoes;
          return {
            save: {
              ...state.save,
              vigils,
              currencies,
            },
          };
        });
      },

      setTutorialDone: () => {
        set((state) => ({
          save: {
            ...state.save,
            tutorialDone: true,
            settings: {
              ...state.save.settings,
              tutorialCompleted: true,
            },
          },
        }));
      },

      setWardenName: (name) => {
        set((state) => ({
          save: {
            ...state.save,
            wardenName: name,
            playerName: name,
          },
        }));
      },

      setPlayerName: (name) => {
        get().setWardenName(name);
      },

      claimOmen: (cardId) => {
        const today = new Date().toISOString().split("T")[0];
        get().addCards([cardId]);
        set((state) => ({
          save: {
            ...state.save,
            lastOmenDate: today,
          },
        }));
      },

      updateShrineCards: (cards) => {
        set((state) => ({
          save: {
            ...state.save,
            shrineCards: cards.slice(0, 3),
          },
        }));
      },

      resetSave: () => {
        set({ save: INITIAL_SAVE });
      },
    }),
    {
      name: "veilbound.save.v1",
    }
  )
);
