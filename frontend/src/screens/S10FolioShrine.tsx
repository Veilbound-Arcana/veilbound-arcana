import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Sparkles, Lock, Plus, X } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { ALL_CARDS, CARD_MAP } from "@/data/generateCards";
import { Header } from "@/components/Header";
import { CardView } from "@/components/CardView";

export const S10FolioShrine: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { save } = useGameStore();

  const [activeTab, setActiveTab] = useState<"folio" | "shrine">(
    location.hash === "#shrine" ? "shrine" : "folio"
  );

  // Binder slots state (9 cards)
  const [folioSlots, setFolioSlots] = useState<(string | null)[]>([
    "c-001", "c-002", "c-008", null, null, null, null, null, null
  ]);

  // Shrine pedestals (3 cards)
  const [shrineSlots, setShrineSlots] = useState<(string | null)[]>([
    "c-008", "c-012", "c-009"
  ]);

  const [pickerModal, setPickerModal] = useState<{
    open: boolean;
    slotType: "folio" | "shrine";
    slotIndex: number;
  }>({ open: false, slotType: "folio", slotIndex: 0 });

  const isFolioUnlocked = save.level >= 5;
  const isShrineUnlocked = save.level >= 8;

  const handleSelectCard = (cardId: string) => {
    if (pickerModal.slotType === "folio") {
      const copy = [...folioSlots];
      copy[pickerModal.slotIndex] = cardId;
      setFolioSlots(copy);
    } else {
      const copy = [...shrineSlots];
      copy[pickerModal.slotIndex] = cardId;
      setShrineSlots(copy);
    }
    setPickerModal({ open: false, slotType: "folio", slotIndex: 0 });
  };

  const handleRemoveSlot = (slotType: "folio" | "shrine", index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slotType === "folio") {
      const copy = [...folioSlots];
      copy[index] = null;
      setFolioSlots(copy);
    } else {
      const copy = [...shrineSlots];
      copy[index] = null;
      setShrineSlots(copy);
    }
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      <Header
        title={activeTab === "folio" ? "Folio Binder" : "Altar Shrine"}
        subtitle={`Warden Level ${save.level}`}
        onBack={() => navigate("/archive")}
      />

      {/* Tab Switcher */}
      <div className="px-4 pt-2">
        <div className="flex p-1 bg-white/70 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("folio")}
            className={`flex-1 py-2 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "folio"
                ? "bg-violet text-white shadow-sm"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            <BookOpen size={14} />
            <span>Folio (Binder)</span>
          </button>
          <button
            onClick={() => setActiveTab("shrine")}
            className={`flex-1 py-2 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "shrine"
                ? "bg-violet text-white shadow-sm"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            <Sparkles size={14} />
            <span>Shrine (Altar)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {activeTab === "folio" ? (
          // Folio View
          !isFolioUnlocked ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-4">
                <Lock size={32} />
              </div>
              <h2 className="font-display font-bold text-base text-ink mb-1">
                Reach level 5 to open the Folio.
              </h2>
              <p className="text-xs text-ink-2 max-w-xs mb-4">
                Current Level: {save.level}. Gain XP by unbinding packs and completing Vigils.
              </p>
              <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet"
                  style={{ width: `${Math.min((save.level / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pb-8">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-bold text-ink">Page 1 · Celestial Wardens</span>
                <span className="text-[10px] text-ink-2 font-mono">9 Slots</span>
              </div>

              {/* 3x3 Binder Layout */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-slate-100 border-2 border-amber-800/20 shadow-inner grid grid-cols-3 gap-2">
                {folioSlots.map((slotId, idx) => {
                  const card = slotId ? CARD_MAP[slotId] : null;

                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        setPickerModal({ open: true, slotType: "folio", slotIndex: idx })
                      }
                      className="aspect-[5/7] rounded-xl border border-slate-300/80 bg-white shadow-sm flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group hover:border-violet"
                    >
                      {card ? (
                        <>
                          <CardView card={card} />
                          <button
                            onClick={(e) => handleRemoveSlot("folio", idx, e)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <Plus size={18} />
                          <span className="text-[8px] font-mono mt-1">Slot {idx + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          // Shrine View
          !isShrineUnlocked ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Lock size={32} />
              </div>
              <h2 className="font-display font-bold text-base text-ink mb-1">
                Reach level 8 to unlock the Shrine.
              </h2>
              <p className="text-xs text-ink-2 max-w-xs mb-4">
                Current Level: {save.level}. Showcase your most radiant Crowned spirits on sacred pedestals.
              </p>
              <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${Math.min((save.level / 8) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-8">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-bold text-ink">Pedestal of the Three Aspects</span>
                <span className="text-[10px] text-ink-2 font-mono">Trophy Showcase</span>
              </div>

              {/* 3 Pedestal Shrine Display */}
              <div className="p-4 rounded-3xl bg-slate-950 text-white relative overflow-hidden flex items-end justify-center gap-3 h-[360px] shadow-2xl">
                {/* Aura Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet/20 via-transparent to-amber-400/10 pointer-events-none" />

                {shrineSlots.map((slotId, idx) => {
                  const card = slotId ? CARD_MAP[slotId] : null;
                  const isCenter = idx === 1;

                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        setPickerModal({ open: true, slotType: "shrine", slotIndex: idx })
                      }
                      className={`flex flex-col items-center cursor-pointer transition-transform ${
                        isCenter ? "mb-6 scale-110 z-10" : "mb-2 z-0"
                      }`}
                    >
                      <div className="w-[84px] h-[118px] rounded-xl border border-amber-300/40 shadow-lg relative overflow-hidden bg-slate-900 flex items-center justify-center">
                        {card ? (
                          <>
                            <CardView card={card} />
                            <button
                              onClick={(e) => handleRemoveSlot("shrine", idx, e)}
                              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center text-xs"
                            >
                              <X size={10} />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-slate-500">
                            <Plus size={16} />
                            <span className="text-[7px] font-mono mt-0.5">Place</span>
                          </div>
                        )}
                      </div>

                      {/* Pedestal Base */}
                      <div className="w-24 h-6 rounded-b-xl bg-gradient-to-b from-amber-700/80 to-amber-950 border-t border-amber-400/50 flex items-center justify-center shadow-lg mt-1">
                        <span className="text-[8px] font-mono text-amber-200 tracking-wider">
                          {isCenter ? "CROWN" : idx === 0 ? "LEFT" : "RIGHT"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* Card Picker Modal */}
      {pickerModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[75vh] flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-display font-bold text-sm text-ink">Select Arcana</span>
              <button
                onClick={() =>
                  setPickerModal({ open: false, slotType: "folio", slotIndex: 0 })
                }
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 grid grid-cols-4 gap-2">
              {ALL_CARDS.map((card) => {
                const count = save.cards[card.id] || 0;
                if (count === 0) return null;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCard(card.id)}
                    className="aspect-[5/7] rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer active:scale-95"
                  >
                    <CardView card={card} ownedCount={count} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
