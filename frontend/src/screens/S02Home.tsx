import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CurrencyBar } from "@/components/CurrencyBar";
import { TabBar } from "@/components/TabBar";
import { SETS } from "@/data/sets";
import { CARD_MAP } from "@/data/generateCards";
import { useGameStore } from "@/store/useGameStore";
import { useI18n } from "@/i18n/i18n";
import { Flame, Sparkles, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

export const S02Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { save } = useGameStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const [candleTimer, setCandleTimer] = useState("04:12:09");

  // Timer simulation
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, save.currencies.candleNextAt - now);
      const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setCandleTimer(`${hours}:${mins}:${secs}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [save.currencies.candleNextAt]);

  const activeSet = SETS[activeIndex];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % SETS.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + SETS.length) % SETS.length);

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist relative overflow-hidden select-none">
      {/* Top Currency & Profile Header */}
      <CurrencyBar />

      {/* Hero Section: 3D Pack Coverflow (Ref C) */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Carousel Container */}
        <div className="relative w-full max-w-[320px] h-[340px] flex items-center justify-center perspective-[1000px]">
          {SETS.map((set, idx) => {
            const offset = idx - activeIndex;
            const isCenter = offset === 0;

            let transform = "scale(0.78) translateZ(-120px)";
            let zIndex = 10;
            let opacity = 0.85;

            if (isCenter) {
              transform = "scale(1) translateZ(0) rotateY(0deg)";
              zIndex = 20;
              opacity = 1;
            } else if (offset === 1 || offset === -2) {
              transform = "translateX(90px) scale(0.78) rotateY(-38deg) translateZ(-120px)";
            } else if (offset === -1 || offset === 2) {
              transform = "translateX(-90px) scale(0.78) rotateY(38deg) translateZ(-120px)";
            } else {
              opacity = 0;
            }

            const feat = CARD_MAP[set.featuredCardId];

            return (
              <div
                key={set.id}
                onClick={() => setActiveIndex(idx)}
                className="absolute w-[180px] h-[260px] rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 shadow-2xl cursor-pointer"
                style={{
                  transform,
                  zIndex,
                  opacity,
                  background: "linear-gradient(145deg, #1e1b4b 0%, #2e1065 50%, #090d16 100%)",
                  border: isCenter ? "2px solid #F2C14E" : "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {/* Pack Header Strip */}
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <span className="font-display font-bold text-[10px] text-amber-300 tracking-widest uppercase">
                    VEILBOUND
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[9px] font-bold">
                    {set.badge}
                  </span>
                </div>

                {/* Featured Beast Art Centerpiece */}
                <div className="flex-1 flex flex-col items-center justify-center my-2 text-center">
                  <div className="w-20 h-20 rounded-full border border-amber-300/30 flex items-center justify-center mb-1 bg-violet/20">
                    <Sparkles size={28} className="text-amber-300 animate-pulse" />
                  </div>
                  <span className="font-display font-bold text-xs text-white leading-tight">
                    {feat?.name || "Ancient Veilborn"}
                  </span>
                </div>

                {/* Pack Bottom Title Plate */}
                <div className="text-center pt-2 border-t border-white/10">
                  <span className="font-display font-semibold text-[10px] text-slate-300 uppercase tracking-wider block truncate">
                    {set.title}
                  </span>
                  <span className="text-[8px] text-amber-400/80 font-ui font-semibold">
                    5 Arcana Cards
                  </span>
                </div>

                {/* Mirrored Reflection underneath */}
                {isCenter && (
                  <div
                    className="absolute -bottom-[90px] left-0 right-0 h-[80px] rounded-2xl opacity-20 pointer-events-none overflow-hidden blur-[1px]"
                    style={{
                      transform: "scaleY(-1)",
                      background: "linear-gradient(145deg, #1e1b4b 0%, #2e1065 50%, #090d16 100%)",
                      maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
                      WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-6 mt-4 z-20">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white/70 border border-white flex items-center justify-center text-ink shadow-sm active:scale-95"
            aria-label="Previous Set"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-display font-bold text-ink-2 tracking-wider">
            {activeSet.title}
          </span>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white/70 border border-white flex items-center justify-center text-ink shadow-sm active:scale-95"
            aria-label="Next Set"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Primary Action Button: Open Pack */}
        <div className="flex flex-col items-center gap-2 mt-5 z-20 w-full max-w-[280px]">
          <button
            onClick={() => navigate(`/open/${activeSet.id}`)}
            className="w-full h-12 rounded-pill bg-gradient-to-r from-violet to-indigo-600 text-white font-ui font-extrabold text-sm tracking-wider shadow-lg hover:shadow-violet/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className="text-amber-300" />
            <span>{t("home.openPack")}</span>
          </button>

          {/* Candle Allowance Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white text-[11px] text-ink-2 font-semibold shadow-sm">
            <Flame size={12} className="text-amber-500" />
            <span>
              {save.currencies.candles > 0
                ? `${save.currencies.candles} ${t("home.ready")}`
                : t("home.nextCandle", { time: candleTimer })}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Shortcuts Row (Vigils, Omen Draw, News) */}
      <div className="px-4 py-3 flex items-center justify-between gap-2 z-20">
        {/* Vigils Shortcut */}
        <button
          onClick={() => navigate("/menu")}
          className="flex-1 py-2 px-3 rounded-2xl glass-panel flex items-center justify-center gap-1.5 active:scale-95 transition-all min-h-[44px]"
        >
          <BookOpen size={14} className="text-violet" />
          <span className="text-[11px] font-bold text-ink">
            {t("home.vigilsCount", { count: 3 })}
          </span>
        </button>

        {/* Omen Draw Shortcut */}
        <button
          onClick={() => navigate("/omen")}
          className="flex-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-amber-400/20 to-violet/20 border border-amber-400/40 flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm min-h-[44px]"
        >
          <Sparkles size={14} className="text-amber-500 animate-spin" />
          <span className="text-[11px] font-extrabold text-ink">
            {t("home.omenDraw")}
          </span>
        </button>

        {/* Sets Progress Shortcut */}
        <button
          onClick={() => navigate(`/sets/${activeSet.id}`)}
          className="flex-1 py-2 px-3 rounded-2xl glass-panel flex items-center justify-center gap-1.5 active:scale-95 transition-all min-h-[44px]"
        >
          <span className="text-[11px] font-bold text-ink">
            {activeSet.badge} 40/40
          </span>
        </button>
      </div>

      {/* Tab Navigation */}
      <TabBar />
    </div>
  );
};
