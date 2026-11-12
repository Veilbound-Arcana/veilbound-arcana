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

  const isFoil =
    card.rarity.startsWith("moon") || card.rarity === "veil" || card.immersive;

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
      } ${className}`}
      style={{
        borderColor: aspectColor,
        borderWidth: "2px",
      }}
    >
      {/* Outer Aspect Gradient Rim */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at center, transparent 40%, ${aspectColor} 100%)`,
        }}
      />

      {/* NEW Tag Pill (Overlaps top-left by ~8px) */}
      {isNew && (
        <div className="absolute -top-1 -left-1 z-30 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-ui font-extrabold text-[9px] tracking-wider shadow-md uppercase">
          NEW
        </div>
      )}

      {/* Top Header Zone: Name, Aspect Glyph, Vitality */}
      <div className="relative z-10 px-2 pt-1.5 pb-0.5 flex items-center justify-between bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="flex items-center gap-1 min-w-0">
          <AspectGlyph aspect={card.aspect} size={15} />
          <span className="font-display font-bold text-[11px] sm:text-xs text-white truncate tracking-wide">
            {card.name}
          </span>
        </div>

        {card.vitality !== undefined && (
          <div className="flex items-center gap-0.5 shrink-0 text-amber-300 font-ui font-extrabold text-[11px] tabular-nums">
            <span className="text-[8px] text-slate-400 font-semibold">HP</span>
            <span>{card.vitality}</span>
          </div>
        )}
      </div>

      {/* Arched Art Window */}
      <div className="relative flex-1 mx-1.5 my-0.5 rounded-t-[28px] rounded-b-md overflow-hidden border border-white/20 bg-slate-900 shadow-inner">
        <ProceduralArt
          cardId={card.id}
          name={card.name}
          aspect={card.aspect}
          className="w-full h-full"
        />

        {/* Foil Shimmer Overlay for Moon & Veil Tiers */}
        {isFoil && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-40 transition-opacity"
            style={{
              background: `radial-gradient(circle at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(255,255,255,0.8) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>

      {/* Abilities & Text Zone */}
      {!compact && (
        <div className="relative z-10 px-2 py-1 bg-slate-900/95 border-t border-white/10 flex flex-col gap-0.5">
          {card.abilities && card.abilities.length > 0 ? (
            card.abilities.map((ab, idx) => (
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
              {card.flavor || "Bound within the twilight Veil."}
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
