import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, RotateCw, X } from "lucide-react";
import { Card } from "@/game/types";
import { CardView } from "@/components/CardView";
import { useGameStore } from "@/store/useGameStore";
import { RarityGlyph } from "@/components/RarityGlyph";

export const S05Summary: React.FC = () => {
  const navigate = useNavigate();
  const { save } = useGameStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [newMap, setNewMap] = useState<Record<string, boolean>>({});
  const [setId, setSetId] = useState("V1");
  const [inspectedCard, setInspectedCard] = useState<Card | null>(null);

  useEffect(() => {
    try {
      const rawCards = sessionStorage.getItem("lastOpenedCards");
      const rawNewMap = sessionStorage.getItem("lastOpenedNewMap");
      const lastSet = sessionStorage.getItem("lastOpenedSetId");
      if (rawCards) setCards(JSON.parse(rawCards));
      if (rawNewMap) setNewMap(JSON.parse(rawNewMap));
      if (lastSet) setSetId(lastSet);
    } catch {
      // fallback
    }
  }, []);

  const canOpenAnother = save.currencies.candles > 0 || save.currencies.shards >= 100;

  const handleOpenAnother = () => {
    if (canOpenAnother) {
      navigate(`/open?set=${setId}`);
    } else {
      navigate("/shop");
    }
  };

  const handleDone = () => {
    navigate("/");
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative overflow-hidden select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-200/60 bg-white/40 backdrop-blur-md z-20">
        <div>
          <h1 className="font-display font-extrabold text-base text-ink">
            Echoes of the Veil
          </h1>
          <p className="text-[11px] text-ink-2 font-ui">
            5 Arcana added to your Archive
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet/10 text-violet font-mono text-xs font-bold">
          <Sparkles size={14} />
          <span>SET {setId}</span>
        </div>
      </div>

      {/* Cards 5-Grid Showcase with 90ms staggered reveal */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
        <div className="grid grid-cols-3 gap-3 w-full max-w-[340px]">
          {cards.map((card, idx) => {
            const isNew = !!newMap[card.id];
            // Center the bottom 2 cards nicely if 5 cards total
            const colSpan = idx >= 3 ? "col-span-1" : "col-span-1";

            return (
              <motion.div
                key={card.id + idx}
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.09 }}
                onClick={() => setInspectedCard(card)}
                className={`relative flex flex-col items-center cursor-pointer active:scale-95 ${colSpan}`}
              >
                <div className="w-[96px] h-[134px] rounded-xl overflow-hidden shadow-md border border-slate-200">
                  <CardView card={card} isNew={isNew} />
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[9px] font-display font-bold text-ink truncate max-w-[96px]">
                    {card.name}
                  </span>
                  <RarityGlyph rarity={card.rarity} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Inspect Modal */}
      <AnimatePresence>
        {inspectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6"
          >
            <button
              onClick={() => setInspectedCard(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center active:scale-95"
            >
              <X size={20} />
            </button>

            <div className="w-[240px] h-[336px] mb-4">
              <CardView card={inspectedCard} isNew={!!newMap[inspectedCard.id]} />
            </div>

            <div className="text-center text-white max-w-xs">
              <h3 className="font-display font-bold text-lg">{inspectedCard.name}</h3>
              <p className="text-xs text-amber-300 capitalize font-mono mt-0.5">
                {inspectedCard.kind} · {inspectedCard.aspect} · {inspectedCard.rarity.replace("_", " ")}
              </p>
              <p className="text-xs text-slate-300 mt-2 italic font-ui">
                "{inspectedCard.flavor}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Footer */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex items-center gap-3 z-20">
        <button
          onClick={handleOpenAnother}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-300 text-ink font-ui font-bold text-xs shadow-sm active:scale-95"
        >
          <RotateCw size={15} />
          <span>{canOpenAnother ? "Open Another" : "Get Shards"}</span>
        </button>

        <button
          onClick={handleDone}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-violet text-white font-ui font-extrabold text-xs shadow-md active:scale-95"
        >
          <Check size={16} />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
