import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, FastForward } from "lucide-react";
import { SETS, SET_MAP } from "@/data/sets";
import { useGameStore } from "@/store/useGameStore";
import { generatePackCards } from "@/game/openFlow";
import { playSealTear } from "@/fx/audio";
import { t } from "@/i18n/i18n";

export const S03PackOpen: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setId = params.get("set") || "V1";
  const setDef = SET_MAP[setId] || SETS[0];

  const { save, openPack, addCards, deductShards } = useGameStore();

  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDetached, setIsDetached] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check currency or candle: if candle available, consume it; else check shards
  const canOpen = save.currencies.candles > 0 || save.currencies.shards >= 100;

  const handleStartTear = (clientX: number) => {
    if (isDetached || isOpening) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const progress = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    setDragProgress(progress);
  };

  const handleDragMove = (clientX: number) => {
    if (isDetached || isOpening) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const progress = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    setDragProgress(progress);

    // 70% detachment threshold
    if (progress >= 0.7 && !isDetached) {
      triggerDetachment();
    }
  };

  const triggerDetachment = () => {
    setIsDetached(true);
    setDragProgress(1);

    // Sound & Haptic
    playSealTear(save.settings.fxVolume, save.settings.muted);
    if (navigator.vibrate && !save.settings.reduceMotion) {
      navigator.vibrate(15);
    }

    // Spend currency
    if (save.currencies.candles > 0) {
      openPack();
    } else {
      deductShards(100);
    }

    // Generate cards & mark new cards
    const cards = generatePackCards(setDef.id);
    const newMap: Record<string, boolean> = {};
    cards.forEach((c) => {
      newMap[c.id] = !save.cards[c.id] || save.cards[c.id] === 0;
    });

    addCards(cards.map((c) => c.id));

    // Stash in session storage for S04 / S05
    sessionStorage.setItem("lastOpenedCards", JSON.stringify(cards));
    sessionStorage.setItem("lastOpenedNewMap", JSON.stringify(newMap));
    sessionStorage.setItem("lastOpenedSetId", setDef.id);

    // Burst animation then navigate
    setIsOpening(true);
    setTimeout(() => {
      navigate("/reveal");
    }, 1100);
  };

  const handleSkip = () => {
    if (!canOpen || isOpening) return;
    triggerDetachment();
  };

  if (!canOpen) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 bg-cool-mist text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mb-4">
          <Sparkles size={32} />
        </div>
        <h2 className="font-display font-bold text-lg text-ink mb-2">No Candles or Shards</h2>
        <p className="text-xs text-ink-2 max-w-xs mb-6">
          Wait for your Vigil Candle to rekindle or visit the Sanctuary Exchange for Veil Shards.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-xl bg-white/80 border border-slate-200 text-ink text-xs font-bold"
          >
            Back Home
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="px-4 py-2 rounded-xl bg-violet text-white text-xs font-bold shadow-md"
          >
            Sanctuary Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-slate-950 relative overflow-hidden select-none">
      {/* Top Header Strip */}
      <div className="w-full flex items-center justify-between px-4 py-3 z-30">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="font-display font-bold text-xs text-amber-300/90 tracking-wider">
          {setDef.title}
        </span>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-slate-200 text-xs font-semibold active:scale-95"
        >
          <span>Skip</span>
          <FastForward size={13} />
        </button>
      </div>

      {/* Main Ritual Arena: Sealed Vellum Envelope */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Mystic Aura Particles */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-72 h-96 rounded-full bg-amber-400/10 blur-3xl animate-pulse" />
        </div>

        {/* Envelope Container */}
        <div
          ref={containerRef}
          onTouchStart={(e) => handleStartTear(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onMouseDown={(e) => handleStartTear(e.clientX)}
          onMouseMove={(e) => e.buttons === 1 && handleDragMove(e.clientX)}
          className="relative w-[280px] h-[400px] rounded-2xl shadow-2xl overflow-hidden cursor-ew-resize flex flex-col justify-between"
          style={{
            background: "linear-gradient(165deg, #1b162f 0%, #151124 50%, #0d0a17 100%)",
            border: "1.5px solid rgba(242, 193, 78, 0.4)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(242,193,78,0.15)",
          }}
        >
          {/* Top Tear Strip (Top 14% height) */}
          <div className="relative w-full h-14 bg-gradient-to-r from-amber-900/60 via-amber-800/80 to-amber-900/60 border-b border-amber-400/30 flex items-center px-4 overflow-hidden">
            {/* Cut Line & Detached Ribbon */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-400/40 to-transparent transition-all pointer-events-none"
              style={{ width: `${dragProgress * 100}%` }}
            />

            {/* Glowing Perforation Line */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 border-b border-dashed border-amber-300/60" />

            {/* Moving Ribbon / Wax Seal Handle */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-200 shadow-lg flex items-center justify-center text-slate-950 font-bold"
              style={{ left: `calc(${Math.min(dragProgress * 85, 80)}% + 6px)` }}
              animate={isDetached ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : {}}
            >
              <Sparkles size={16} />
            </motion.div>

            <span className="text-[10px] font-mono text-amber-200/60 tracking-widest pl-12">
              {isDetached ? "SEAL PARTED" : "SEALED VELLUM"}
            </span>
          </div>

          {/* Envelope Body Centerpiece */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {/* Wax Seal Glyph */}
            <div className="w-24 h-24 rounded-full border border-amber-400/30 bg-amber-500/10 flex items-center justify-center mb-4 relative shadow-inner">
              <div className="w-16 h-16 rounded-full border border-amber-400/50 flex items-center justify-center bg-violet/30">
                <span className="font-display font-extrabold text-2xl text-amber-300">
                  {setDef.badge}
                </span>
              </div>
            </div>

            <span className="font-display font-bold text-base text-white tracking-wide">
              {setDef.title}
            </span>
            <span className="font-ui text-xs text-amber-300/80 mt-1">
              5 Spirit Arcana
            </span>
          </div>

          {/* Bottom Footnote */}
          <div className="p-3 text-center border-t border-white/5 bg-black/20">
            <span className="text-[10px] text-slate-400 tracking-wider">
              SET {setDef.id} · THE VEIL AWAITS
            </span>
          </div>

          {/* Burst Flash Overlay */}
          {isOpening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-t from-amber-200 via-white to-amber-100 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1 }}
                className="w-40 h-40 rounded-full bg-white filter blur-xl"
              />
            </motion.div>
          )}
        </div>

        {/* User Guidance Hint */}
        <div className="mt-8 text-center">
          <p className="font-ui text-xs text-slate-400 tracking-wide">
            {isDetached ? "The Veil parts..." : t("pack.tear_hint", "Draw your thumb across the seal.")}
          </p>
          <div className="mt-2 w-32 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-150"
              style={{ width: `${dragProgress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom spacer for phone frame */}
      <div className="h-6" />
    </div>
  );
};
