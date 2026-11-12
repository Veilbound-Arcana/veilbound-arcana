import React, { useRef } from "react";
import { Card } from "@/game/types";
import { CONCEPT } from "@/app/concept.config";
import { AspectGlyph } from "./AspectGlyph";
import { RarityGlyph } from "./RarityGlyph";
import { ProceduralArt } from "@/art/ProceduralArt";

interface CardViewProps {
  card: Card;
  ownedCount?: number;
  isNew?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  showBack?: boolean;
  compact?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  ownedCount,
  isNew = false,
  interactive = true,
  onClick,
  className = "",
  showBack = false,
  compact = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const aspectColor = card.aspect
    ? CONCEPT.ASPECT_COLORS[card.aspect]
    : "#8C96A5";

  const isMoon = card.rarity.startsWith("moon");
  const isVeil = card.rarity === "veil" || !!card.immersive;
  const isFoil = isMoon || isVeil;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    cardRef.current.style.setProperty("--mx", String(x));
    cardRef.current.style.setProperty("--my", String(y));
  };

  if (showBack) {
    return (
      <div
        className={`relative aspect-[5/7] rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-500/40 shadow-card flex items-center justify-center ${className}`}
      >
        <div className="absolute inset-1.5 rounded-lg border border-amber-500/20 flex flex-col items-center justify-center p-2 bg-gradient-to-b from-indigo-950 via-slate-950 to-purple-950">
          <div className="w-12 h-12 rounded-full border border-amber-400/40 flex items-center justify-center mb-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
              <path d="M12 3V21M3 12H21" strokeWidth="1.5" strokeDasharray="2 3" />
            </svg>
          </div>
          <span className="font-display font-bold text-[9px] text-amber-200/70 tracking-widest uppercase">
            Veilbound
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      className={`relative aspect-[5/7] rounded-xl overflow-hidden bg-slate-950 text-ink shadow-card select-none flex flex-col justify-between transition-transform ${
        interactive ? "active:scale-[0.98] cursor-pointer" : ""
      } ${isVeil ? "ring-1 ring-amber-400/60 shadow-[0_0_15px_rgba(242,193,78,0.25)]" : ""} ${className}`}
      style={{
        borderColor: isVeil ? "#F2C14E" : aspectColor,
        borderWidth: isVeil ? "2.5px" : "2px",
      }}
    >
      {/* Outer Aspect Gradient Rim */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at center, transparent 40%, ${aspectColor} 100%)`,
        }}
      />

      {/* NEW Tag Pill */}
      {isNew && (
        <div className="absolute -top-1 -left-1 z-30 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-ui font-extrabold text-[9px] tracking-wider shadow-md uppercase">
          NEW
        </div>
      )}

      {/* Top Header Zone: Name, Aspect Glyph, Power & HP */}
      <div className="relative z-10 px-2 pt-1.5 pb-0.5 flex items-center justify-between bg-gradient-to-b from-slate-900/95 to-transparent">
        <div className="flex items-center gap-1 min-w-0">
          <AspectGlyph aspect={card.aspect} size={15} />
          <div className="min-w-0">
            <span className="font-display font-bold text-[11px] sm:text-xs text-white truncate tracking-wide block leading-tight">
              {card.name}
            </span>
            {card.tarotArchetype && (
              <span className="text-[8px] font-mono text-amber-300/80 truncate block leading-none">
                {card.tarotArchetype}
              </span>
            )}
          </div>
        </div>

        {/* Vitality (HP) & Power (PWR) */}
        <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
          {card.power !== undefined && (
            <div className="flex items-center gap-0.5 text-rose-400 font-ui font-extrabold text-[10px]">
              <span className="text-[7px] text-slate-400 font-semibold">PWR</span>
              <span>{card.power}</span>
            </div>
          )}
          {card.vitality !== undefined && (
            <div className="flex items-center gap-0.5 text-amber-300 font-ui font-extrabold text-[11px]">
              <span className="text-[7px] text-slate-400 font-semibold">HP</span>
              <span>{card.vitality}</span>
            </div>
          )}
        </div>
      </div>

      {/* Arched Art Window */}
      <div className="relative flex-1 mx-1.5 my-0.5 rounded-t-[28px] rounded-b-md overflow-hidden border border-white/20 bg-slate-900 shadow-inner">
        <ProceduralArt
          cardId={card.id}
          name={card.name}
          aspect={card.aspect}
          rarity={card.rarity}
          tarotArchetype={card.tarotArchetype}
          className="w-full h-full"
        />

        {/* Dynamic Holographic Foil Shader for Moon & Veil Tiers */}
        {isFoil && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity"
            style={{
              opacity: isVeil ? 0.55 : 0.4,
              background: `radial-gradient(circle at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(255,255,255,0.9) 0%, rgba(255,200,240,0.5) 20%, rgba(180,220,255,0.4) 40%, transparent 65%)`,
            }}
          />
        )}

        {/* Prismatic Rainbow Sheen on Veil Crowned Cards */}
        {isVeil && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
            style={{
              background: `linear-gradient(calc(var(--mx, 0.5) * 360deg), #FF7AA8, #FFD36E, #8BE28B, #6CC7FF, #B58BFF)`,
            }}
          />
        )}
      </div>

      {/* Abilities & Text Zone */}
      {!compact && (
        <div className="relative z-10 px-2 py-1 bg-slate-900/95 border-t border-white/10 flex flex-col gap-0.5">
          {card.abilities && card.abilities.length > 0 ? (
            card.abilities.slice(0, 2).map((ab, idx) => (
              <div key={idx} className="flex items-start justify-between text-[10px] leading-tight">
                <div className="flex items-center gap-1 font-bold text-white truncate">
                  <div className="flex gap-0.5">
                    {ab.cost.map((c, ci) => (
                      <AspectGlyph key={ci} aspect={c} size={10} />
                    ))}
                  </div>
                  <span className="truncate">{ab.name}</span>
                </div>
                {ab.damage !== undefined && (
                  <span className="font-extrabold text-amber-400 tabular-nums shrink-0 ml-1">
                    {ab.damage}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-[9px] text-slate-300 italic truncate leading-tight">
              {card.flavor || card.description || "Bound within the twilight Veil."}
            </p>
          )}
        </div>
      )}

      {/* Bottom Footer Plate: Rarity Glyphs, Set Number Plate */}
      <div className="relative z-10 px-2 py-1 flex items-center justify-between text-[9px] text-slate-400 bg-slate-950 border-t border-white/5">
        <RarityGlyph rarity={card.rarity} size={11} />

        <div className="font-ui font-mono text-[8px] text-slate-500 tracking-wider">
          {card.setId}-{String(card.number).padStart(3, "0")}
        </div>
      </div>

      {/* Dark Slate Tab at Bottom-Left: Owned Count (Archive View) */}
      {ownedCount !== undefined && (
        <div className="absolute bottom-0 left-0 z-20 px-2 py-0.5 rounded-tr-lg bg-slate-800/95 border-t border-r border-slate-700 text-white font-ui font-extrabold text-[10px] tabular-nums shadow">
          {ownedCount}
        </div>
      )}
    </div>
  );
};
