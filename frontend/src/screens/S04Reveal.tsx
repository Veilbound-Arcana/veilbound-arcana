import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, FastForward } from "lucide-react";
import { Card } from "@/game/types";
import { CardView } from "@/components/CardView";
import { RarityGlyph } from "@/components/RarityGlyph";
import { playChime, playArpeggio, playChoirSwell, playCardFlip } from "@/fx/audio";
import { useGameStore } from "@/store/useGameStore";
import { t } from "@/i18n/i18n";

export const S04Reveal: React.FC = () => {
  const navigate = useNavigate();
  const { save } = useGameStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [newMap, setNewMap] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    try {
      const rawCards = sessionStorage.getItem("lastOpenedCards");
      const rawNewMap = sessionStorage.getItem("lastOpenedNewMap");
      if (rawCards) {
        setCards(JSON.parse(rawCards));
      }
      if (rawNewMap) {
        setNewMap(JSON.parse(rawNewMap));
      }
    } catch {
      // fallback
    }
  }, []);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);

    // Sound and haptic per rarity
    const rarity = currentCard?.rarity || "rune_1";
    const fxVol = save.settings.fxVolume;
    const muted = save.settings.muted;

    playCardFlip(fxVol, muted);

    if (rarity.startsWith("rune")) {
      setTimeout(() => playChime(fxVol, muted), 150);
    } else if (rarity.startsWith("moon")) {
      setTimeout(() => {
        playArpeggio(fxVol, muted);
        if (navigator.vibrate && !save.settings.reduceMotion) {
          navigator.vibrate([10, 30, 10]);
        }
      }, 200);
    } else if (rarity === "veil") {
      setTimeout(() => {
        playChoirSwell(fxVol, muted);
        if (navigator.vibrate && !save.settings.reduceMotion) {
          navigator.vibrate([20, 40, 20]);
        }
      }, 200);
    }
  };

  const handleNext = () => {
    if (!isFlipped) {
      handleFlip();
      return;
    }
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      navigate("/summary");
    }
  };

  const handleSkipAll = () => {
    navigate("/summary");
  };

  if (!currentCard) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center">
        <Sparkles size={32} className="text-amber-400 mb-3 animate-pulse" />
        <p className="text-sm">Preparing Arcana reveal...</p>
      </div>
    );
  }

  const isCardNew = !!newMap[currentCard.id];
  const isVeil = currentCard.rarity === "veil";

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-slate-950 text-white relative overflow-hidden select-none">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-5 py-3 z-30">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xs text-amber-300">
            {t("pack.first_card", "The Veil parts.")}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-300">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <button
          onClick={handleSkipAll}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-slate-300 text-xs font-semibold active:scale-95"
        >
          <span>Reveal All</span>
          <FastForward size={13} />
        </button>
      </div>

      {/* Main 3D Card Stack Arena */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-6 perspective-[1200px]">
        {/* Background Aura */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className={`w-72 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
              isFlipped
                ? isVeil
                  ? "bg-purple-500/30 opacity-100"
                  : "bg-teal-500/20 opacity-80"
                : "bg-amber-400/10 opacity-40"
            }`}
          />
        </div>

        {/* Flipped Card Animation Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + currentIndex}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            onClick={!isFlipped ? handleFlip : handleNext}
            className="cursor-pointer relative flex flex-col items-center"
          >
            {/* Card CardView Container */}
            <div className="relative w-[240px] h-[336px] transition-transform duration-500">
              {!isFlipped ? (
                // Card Back (Mystical Vellum with Moth Emblem)
                <div
                  className="w-full h-full rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #161224 0%, #1a162b 50%, #0d0a17 100%)",
                    border: "2px solid rgba(242, 193, 78, 0.4)",
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.9)",
                  }}
                >
                  <div className="w-full border-b border-amber-400/20 pb-2">
                    <span className="font-display font-bold text-[9px] text-amber-300/60 uppercase tracking-widest">
                      VEILBOUND ARCANA
                    </span>
                  </div>

                  {/* Sacred Moth Center Glyph */}
                  <div className="w-24 h-24 rounded-full border border-amber-300/30 flex items-center justify-center bg-violet/20 shadow-inner">
                    <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-300 fill-current">
                      <path d="M50 25 C45 35 30 38 15 35 C12 50 25 65 42 62 C46 68 44 80 50 85 C56 80 54 68 58 62 C75 65 88 50 85 35 C70 38 55 35 50 25 Z" opacity="0.9" />
                      <circle cx="50" cy="22" r="3" fill="#ffffff" />
                      <line x1="50" y1="20" x2="45" y2="10" stroke="#f2c14e" strokeWidth="2" />
                      <line x1="50" y1="20" x2="55" y2="10" stroke="#f2c14e" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="w-full border-t border-amber-400/20 pt-2">
                    <span className="text-[10px] text-amber-200/50 font-ui tracking-wider">
                      Tap to Unbind
                    </span>
                  </div>
                </div>
              ) : (
                // Card Front Revealed
                <div className="relative w-full h-full flex flex-col items-center">
                  <CardView card={currentCard} isNew={isCardNew} />

                  {/* Rarity Gold Markings below card */}
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <RarityGlyph rarity={currentCard.rarity} />
                    <span className="text-[10px] font-display font-bold text-amber-300 uppercase tracking-wider">
                      {currentCard.rarity.replace("_", " ")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Hint */}
        <div className="mt-10 text-center">
          <p className="font-ui text-xs text-slate-400">
            {!isFlipped
              ? "Tap the card to reveal"
              : currentIndex < cards.length - 1
              ? "Tap to inspect next card"
              : "Tap to finish pack"}
          </p>
        </div>
      </div>

      {/* Bottom Nav Button */}
      <div className="p-4 flex justify-center z-30">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-ui font-extrabold text-sm shadow-xl active:scale-95"
        >
          <span>{isFlipped ? (currentIndex < cards.length - 1 ? "Next Arcana" : "View Summary") : "Reveal"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
