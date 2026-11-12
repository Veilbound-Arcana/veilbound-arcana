import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Shield, Zap, X } from "lucide-react";
import { CARD_MAP, ALL_CARDS } from "@/data/generateCards";
import { CardView } from "@/components/CardView";
import { AspectGlyph } from "@/components/AspectGlyph";
import { RarityGlyph } from "@/components/RarityGlyph";
import { useGameStore } from "@/store/useGameStore";
import { playChoirSwell } from "@/fx/audio";
import { ProceduralArt } from "@/art/ProceduralArt";

export const S07CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { save } = useGameStore();

  const [immersiveOpen, setImmersiveOpen] = useState(false);

  const cardIndex = ALL_CARDS.findIndex((c) => c.id === id);
  const card = ALL_CARDS[cardIndex] || CARD_MAP["c-001"];

  const handlePrev = () => {
    if (cardIndex > 0) {
      navigate(`/card/${ALL_CARDS[cardIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (cardIndex < ALL_CARDS.length - 1) {
      navigate(`/card/${ALL_CARDS[cardIndex + 1].id}`);
    }
  };

  const handleOpenImmersive = () => {
    setImmersiveOpen(true);
    playChoirSwell(save.settings.fxVolume, save.settings.muted);
  };

  const ownedCount = save.cards[card.id] || 0;
  const isVeil = card.rarity === "veil";

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-slate-950 text-white relative select-none overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-4 py-3 z-20">
        <button
          onClick={() => navigate("/archive")}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5 font-display text-xs text-amber-300">
          <RarityGlyph rarity={card.rarity} />
          <span className="capitalize">{card.rarity.replace("_", " ")}</span>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-mono text-slate-300">
          Owned: {ownedCount}
        </div>
      </div>

      {/* Main 3D Card Stage with Left/Right Navigation */}
      <div className="flex-1 flex items-center justify-between px-2 relative">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={cardIndex <= 0}
          className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white transition-opacity ${
            cardIndex <= 0 ? "opacity-20 pointer-events-none" : "active:scale-95"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Center 3D Card Display */}
        <div className="flex flex-col items-center">
          <div className="w-[250px] h-[350px] shadow-2xl">
            <CardView card={card} ownedCount={ownedCount} />
          </div>

          {/* Immersive Button for Veil cards */}
          {isVeil && (
            <button
              onClick={handleOpenImmersive}
              className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg active:scale-95 animate-pulse"
            >
              <Eye size={14} />
              <span>Immersive View</span>
            </button>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={cardIndex >= ALL_CARDS.length - 1}
          className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white transition-opacity ${
            cardIndex >= ALL_CARDS.length - 1 ? "opacity-20 pointer-events-none" : "active:scale-95"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Detailed Information Sheet (Bottom Panel) */}
      <div className="max-h-[300px] overflow-y-auto bg-slate-900/90 backdrop-blur-md rounded-t-3xl border-t border-white/10 p-4 space-y-3 z-20">
        {/* Card Name and Stage */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-white">{card.name}</h2>
              <AspectGlyph aspect={card.aspect} size={16} />
            </div>
            {card.tarotArchetype && (
              <span className="text-[11px] text-amber-300 font-display font-medium tracking-wide block">
                {card.tarotArchetype}
              </span>
            )}
            <span className="text-[10px] text-slate-400 capitalize font-mono">
              {card.kind} {card.stage ? `· ${card.stage}` : ""} · Set {card.setId}
            </span>
          </div>

          <div className="flex items-center gap-3 text-right">
            {card.power !== undefined && (
              <div>
                <span className="text-[9px] text-amber-400/80 block font-mono">POWER</span>
                <span className="font-display font-bold text-sm text-amber-300">
                  ⚡ {card.power}
                </span>
              </div>
            )}
            {card.vitality && (
              <div>
                <span className="text-[9px] text-slate-400 block font-mono">VITALITY</span>
                <span className="font-display font-bold text-sm text-emerald-400">
                  {card.vitality} HP
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Narrative Lore & Description */}
        {card.description && (
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300/90 block">
              Veilbound Lore & Archetype
            </span>
            <p className="text-[11px] text-slate-300 font-ui leading-relaxed">
              {card.description}
            </p>
          </div>
        )}

        {/* Abilities List */}
        <div className="space-y-2">
          {(card.abilities || []).map((ab, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-2.5 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {/* Energy Costs */}
                  <div className="flex items-center gap-0.5">
                    {ab.cost.map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
                        <AspectGlyph aspect={c} size={10} />
                      </div>
                    ))}
                  </div>
                  <span className="font-display font-bold text-xs text-white">{ab.name}</span>
                </div>

                {ab.damage !== undefined && (
                  <span className="font-display font-bold text-xs text-amber-300">
                    {ab.damage} DMG
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-ui leading-tight">{ab.text}</p>
            </div>
          ))}
        </div>

        {/* Stats Row: Weakness and Retreat */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Shield size={14} className="text-red-400" />
            <span>Weakness:</span>
            {card.weakness ? (
              <span className="capitalize font-mono font-bold text-red-400">
                {card.weakness} (+20)
              </span>
            ) : (
              <span className="text-slate-500">None</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 justify-end">
            <Zap size={14} className="text-amber-400" />
            <span>Retreat:</span>
            <span className="font-mono font-bold text-amber-400">
              {card.retreat || 0} Aether
            </span>
          </div>
        </div>

        {/* Flavor Quote */}
        {card.flavor && (
          <p className="text-[10px] text-slate-400 italic font-ui border-t border-white/5 pt-2 text-center">
            "{card.flavor}"
          </p>
        )}
      </div>

      {/* Immersive Fullscreen Mode Overlay */}
      <AnimatePresence>
        {immersiveOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 select-none"
          >
            <div className="flex items-center justify-between z-20">
              <span className="font-display font-bold text-xs text-amber-300 uppercase tracking-widest">
                IMMERSIVE ARCANA
              </span>
              <button
                onClick={() => setImmersiveOpen(false)}
                className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Huge Animated Centerpiece */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-[300px] h-[300px] rounded-3xl overflow-hidden shadow-2xl relative border-2 border-amber-300/40"
              >
                <ProceduralArt cardId={card.id} name={card.name} aspect={card.aspect} />
              </motion.div>

              <div className="mt-8 text-center max-w-xs">
                <h1 className="font-display font-bold text-2xl text-white">{card.name}</h1>
                {card.tarotArchetype && (
                  <p className="text-xs text-amber-300 font-display mt-0.5">{card.tarotArchetype}</p>
                )}
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs text-amber-400 font-mono">Crowned Veilborn</span>
                  {card.power !== undefined && (
                    <span className="text-xs text-amber-300 font-mono">· ⚡ {card.power} PWR</span>
                  )}
                </div>
                <p className="text-xs text-slate-300 italic mt-3 font-ui">
                  "{card.flavor}"
                </p>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 font-mono">
              VEILBOUND ARCANA · FULL-ART ARCHIVE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
