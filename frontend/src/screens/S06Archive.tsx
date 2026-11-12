import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Lock, BookOpen, Layers, ArrowUp, Sparkles } from "lucide-react";
import { ALL_CARDS } from "@/data/generateCards";
import { Aspect } from "@/game/types";
import { useGameStore } from "@/store/useGameStore";
import { CardView } from "@/components/CardView";
import { AspectGlyph } from "@/components/AspectGlyph";
import { TabBar } from "@/components/TabBar";
import { Header } from "@/components/Header";
import { CONCEPT } from "@/app/concept.config";

export const S06Archive: React.FC = () => {
  const navigate = useNavigate();
  const { save } = useGameStore();

  const [selectedAspect, setSelectedAspect] = useState<Aspect | "all">("all");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredCards = useMemo(() => {
    return ALL_CARDS.filter((card) => {
      // Aspect filter
      if (selectedAspect !== "all" && card.aspect !== selectedAspect) return false;
      // Owned filter
      const count = save.cards[card.id] || 0;
      if (ownedOnly && count === 0) return false;
      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesAspect = card.aspect ? card.aspect.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesAspect) return false;
      }
      return true;
    });
  }, [selectedAspect, ownedOnly, searchQuery, save.cards]);

  const totalCollected = useMemo(() => {
    return Object.values(save.cards).reduce<number>((acc, count) => acc + (Number(count) > 0 ? 1 : 0), 0);
  }, [save.cards]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 240);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isFolioUnlocked = save.level >= 5;
  const isShrineUnlocked = save.level >= 8;

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      {/* Global Header */}
      <Header
        title="Archive"
        subtitle={`${totalCollected} of ${ALL_CARDS.length} Arcana Unbound`}
        onBack={() => navigate("/")}
      />

      {/* Main Content Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
      >
        {/* Top 3 Tool Tiles: Folio, Shrine, Spreads */}
        <div className="grid grid-cols-3 gap-2">
          {/* Folio Tile (Level 5) */}
          <button
            onClick={() => {
              if (isFolioUnlocked) navigate("/folio");
              else alert("Reach Level 5 to unlock the Folio binder.");
            }}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm ${
              isFolioUnlocked
                ? "bg-white/90 border border-slate-200 active:scale-95"
                : "bg-slate-200/60 border border-dashed border-slate-300 opacity-70"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-violet/10 text-violet flex items-center justify-center mb-1 relative">
              <BookOpen size={18} />
              {!isFolioUnlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-600 text-white flex items-center justify-center">
                  <Lock size={9} />
                </div>
              )}
            </div>
            <span className="font-display font-bold text-xs text-ink leading-tight">Folio</span>
            <span className="text-[9px] text-ink-2 font-mono">
              {isFolioUnlocked ? "Binder" : "Lv. 5"}
            </span>
          </button>

          {/* Shrine Tile (Level 8) */}
          <button
            onClick={() => {
              if (isShrineUnlocked) navigate("/folio#shrine");
              else alert("Reach Level 8 to unlock the Shrine display altar.");
            }}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all shadow-sm ${
              isShrineUnlocked
                ? "bg-white/90 border border-slate-200 active:scale-95"
                : "bg-slate-200/60 border border-dashed border-slate-300 opacity-70"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1 relative">
              <Sparkles size={18} />
              {!isShrineUnlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-600 text-white flex items-center justify-center">
                  <Lock size={9} />
                </div>
              )}
            </div>
            <span className="font-display font-bold text-xs text-ink leading-tight">Shrine</span>
            <span className="text-[9px] text-ink-2 font-mono">
              {isShrineUnlocked ? "Display" : "Lv. 8"}
            </span>
          </button>

          {/* Spreads Tile (Deck Builder) */}
          <button
            onClick={() => navigate("/spreads")}
            className="p-3 rounded-2xl bg-white/90 border border-slate-200 flex flex-col items-center text-center shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center mb-1">
              <Layers size={18} />
            </div>
            <span className="font-display font-bold text-xs text-ink leading-tight">Spreads</span>
            <span className="text-[9px] text-ink-2 font-mono">Decks</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-2 bg-white/60 p-3 rounded-2xl border border-slate-200/80 backdrop-blur-sm">
          {/* Search Input */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-ink">
            <Search size={14} className="text-ink-2" />
            <input
              type="text"
              placeholder="Search spirits or aspects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none text-ink placeholder-slate-400 font-ui"
            />
          </div>

          {/* Aspect Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedAspect("all")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold font-ui transition-all whitespace-nowrap ${
                selectedAspect === "all"
                  ? "bg-violet text-white shadow-sm"
                  : "bg-white text-ink-2 border border-slate-200"
              }`}
            >
              All
            </button>
            {CONCEPT.ASPECTS.map((aspect) => (
              <button
                key={aspect}
                onClick={() => setSelectedAspect(aspect)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-ui capitalize transition-all whitespace-nowrap ${
                  selectedAspect === aspect
                    ? "bg-violet text-white shadow-sm"
                    : "bg-white text-ink-2 border border-slate-200"
                }`}
              >
                <AspectGlyph aspect={aspect} size={11} />
                <span>{aspect}</span>
              </button>
            ))}
          </div>

          {/* Toggle Owned Switch */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
            <span className="text-[11px] font-ui text-ink-2">Show Owned Only</span>
            <button
              onClick={() => setOwnedOnly(!ownedOnly)}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                ownedOnly ? "bg-violet" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  ownedOnly ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3-Column Virtualized/Responsive Card Grid (Ref A) */}
        {filteredCards.length === 0 ? (
          <div className="py-16 text-center text-ink-2">
            <p className="font-ui text-xs">No echoes found matching this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 pb-20">
            {filteredCards.map((card) => {
              const count = save.cards[card.id] || 0;
              const isOwned = count > 0;

              return (
                <div
                  key={card.id}
                  onClick={() => navigate(`/card/${card.id}`)}
                  className={`flex flex-col items-center cursor-pointer transition-transform active:scale-95 ${
                    !isOwned ? "opacity-50 grayscale hover:opacity-75" : ""
                  }`}
                >
                  <div className="w-[102px] h-[142px] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
                    <CardView card={card} ownedCount={count} />
                  </div>
                  <div className="mt-1 text-center w-full">
                    <span className="text-[10px] font-display font-semibold text-ink block truncate">
                      {card.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Jump to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-20 right-5 w-10 h-10 rounded-full bg-violet text-white shadow-lg flex items-center justify-center active:scale-90 z-40 transition-transform"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Global TabBar */}
      <TabBar />
    </div>
  );
};
