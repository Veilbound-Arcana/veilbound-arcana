import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Check, Edit2, ShieldAlert, Layers } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { ALL_CARDS, CARD_MAP } from "@/data/generateCards";
import { validateDeck } from "@/game/engine";
import { Header } from "@/components/Header";
import { AspectGlyph } from "@/components/AspectGlyph";
import { RarityGlyph } from "@/components/RarityGlyph";
import { Aspect } from "@/game/types";

export const S09Spreads: React.FC = () => {
  const navigate = useNavigate();
  const { save, updateDeck, setActiveDeck } = useGameStore();

  const currentDeck = save.decks[save.activeDeckId] || {
    id: "deck-starter",
    name: "Starter Spread",
    cardIds: [],
  };

  const [deckCardIds, setDeckCardIds] = useState<string[]>([...currentDeck.cardIds]);
  const [deckName, setDeckName] = useState(currentDeck.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  // Deck validation
  const validation = validateDeck(deckCardIds);

  // Group deck cards for display
  const deckCounts: Record<string, number> = {};
  deckCardIds.forEach((id) => {
    deckCounts[id] = (deckCounts[id] || 0) + 1;
  });

  const uniqueDeckCardIds = Object.keys(deckCounts);

  // Aspect distribution in deck
  const aspectCounts: Partial<Record<Aspect, number>> = {};
  deckCardIds.forEach((id) => {
    const c = CARD_MAP[id];
    if (c && c.aspect) {
      aspectCounts[c.aspect] = (aspectCounts[c.aspect] || 0) + 1;
    }
  });

  const handleAddCard = (id: string) => {
    if (deckCardIds.length >= 20) return;
    const card = CARD_MAP[id];
    if (!card) return;

    // Check duplicate count
    const count = deckCounts[id] || 0;
    if (count >= 2) return;

    // Check owned count
    const owned = save.cards[id] || 0;
    if (count >= owned) return;

    setDeckCardIds([...deckCardIds, id]);
  };

  const handleRemoveCard = (id: string) => {
    const idx = deckCardIds.indexOf(id);
    if (idx >= 0) {
      const copy = [...deckCardIds];
      copy.splice(idx, 1);
      setDeckCardIds(copy);
    }
  };

  const handleSaveDeck = () => {
    updateDeck(currentDeck.id, deckName, deckCardIds);
    setActiveDeck(currentDeck.id);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      <Header
        title="Spreads"
        subtitle={`${deckCardIds.length}/20 Arcana in Spread`}
        onBack={() => navigate("/archive")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Spread Info Card */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded-lg text-sm font-display font-bold outline-none flex-1"
                />
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-2 py-1 bg-violet text-white text-xs rounded-lg font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-ink">{deckName}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-ink-2 hover:text-ink"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}

            {/* Validation Status Pill */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                validation.valid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {validation.valid ? (
                <>
                  <Check size={12} /> Valid Spread
                </>
              ) : (
                <>
                  <ShieldAlert size={12} /> {deckCardIds.length}/20
                </>
              )}
            </div>
          </div>

          {!validation.valid && validation.reason && (
            <p className="text-[11px] text-amber-700 font-ui bg-amber-50 p-2 rounded-xl border border-amber-200">
              {validation.reason}
            </p>
          )}

          {/* Aspect Distribution Bar */}
          <div className="space-y-1">
            <span className="text-[10px] text-ink-2 font-mono uppercase">Aspect Affinity</span>
            <div className="flex h-2 rounded-full overflow-hidden bg-slate-200">
              {Object.entries(aspectCounts).map(([aspect, count]) => {
                const widthPercent = ((count || 0) / Math.max(deckCardIds.length, 1)) * 100;
                return (
                  <div
                    key={aspect}
                    className="h-full"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor:
                        aspect === "ember"
                          ? "#E06D53"
                          : aspect === "tide"
                          ? "#3A86C8"
                          : aspect === "verdant"
                          ? "#4E9B6E"
                          : aspect === "volt"
                          ? "#E5B83B"
                          : aspect === "umbra"
                          ? "#6B4C9A"
                          : aspect === "lumen"
                          ? "#E8C86A"
                          : aspect === "iron"
                          ? "#7E8C9A"
                          : "#5DD6C8",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Cards in Spread (Deck List) */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-ink">Included Arcana</span>
            <span className="text-[10px] text-ink-2 font-mono">Max 2 copies</span>
          </div>

          {uniqueDeckCardIds.length === 0 ? (
            <p className="text-xs text-ink-2 italic text-center py-4">No cards added yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {uniqueDeckCardIds.map((id) => {
                const card = CARD_MAP[id];
                if (!card) return null;
                const count = deckCounts[id];

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <AspectGlyph aspect={card.aspect} size={14} />
                      <span className="font-display font-semibold text-ink">{card.name}</span>
                      <RarityGlyph rarity={card.rarity} />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-violet">x{count}</span>
                      <button
                        onClick={() => handleRemoveCard(id)}
                        className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center active:scale-95"
                      >
                        <Minus size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card Pool (Owned Cards Picker) */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-ink">Available in Archive</span>
            <span className="text-[10px] text-ink-2 font-mono">Tap + to add</span>
          </div>

          <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
            {ALL_CARDS.map((card) => {
              const owned = save.cards[card.id] || 0;
              if (owned === 0) return null;

              const inDeck = deckCounts[card.id] || 0;
              const canAdd = inDeck < 2 && inDeck < owned && deckCardIds.length < 20;

              return (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <AspectGlyph aspect={card.aspect} size={14} />
                    <div>
                      <span className="font-display font-semibold text-ink block leading-tight">
                        {card.name}
                      </span>
                      <span className="text-[9px] text-ink-2 capitalize">
                        {card.kind} {card.stage ? `· ${card.stage}` : ""} (Owned: {owned})
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!canAdd}
                    onClick={() => handleAddCard(card.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      canAdd
                        ? "bg-violet text-white active:scale-95 shadow-sm"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Bottom Bar */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex items-center gap-3">
        <button
          onClick={handleSaveDeck}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-violet text-white font-ui font-extrabold text-xs shadow-md active:scale-95"
        >
          <Layers size={16} />
          <span>{saveNotification ? "Spread Saved & Set Active!" : "Save Active Spread"}</span>
        </button>
      </div>
    </div>
  );
};
