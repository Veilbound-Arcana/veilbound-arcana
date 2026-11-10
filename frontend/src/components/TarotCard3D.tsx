"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

export interface CardData {
  id: number;
  name: string;
  suit: "Wands" | "Cups" | "Swords" | "Pentacles" | "None";
  arcana: "Minor" | "Major";
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  cost: number;
  basePower: number;
  description?: string;
}

interface TarotCard3DProps {
  card: CardData;
  isFlipped?: boolean; // true = show back, false = show front
  onFlip?: () => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  orientation?: "upright" | "reversed";
}

export const TarotCard3D: React.FC<TarotCard3DProps> = ({
  card,
  isFlipped = false,
  onFlip,
  interactive = true,
  size = "md",
  selected = false,
  disabled = false,
  onClick,
  orientation = "upright",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const sizeClasses = {
    sm: "w-36 h-56",
    md: "w-52 h-80",
    lg: "w-64 h-96",
  };

  const rarityBorders = {
    Common: "border-zinc-500 shadow-zinc-500/20",
    Rare: "border-sky-400 shadow-sky-400/30",
    Epic: "border-purple-500 shadow-purple-500/40",
    Legendary: "border-amber-400 shadow-amber-400/60",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || disabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.6 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const isLegendary = card.rarity === "Legendary";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={disabled ? undefined : onClick}
      style={{ perspective: 1000 }}
      className={`relative inline-block ${sizeClasses[size]} select-none transition-transform duration-200 ${
        selected ? "scale-105 z-20" : ""
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <motion.div
        animate={{
          rotateX: rotateX,
          rotateY: (isFlipped ? 180 : 0) + rotateY,
          rotateZ: orientation === "reversed" && !isFlipped ? 180 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`w-full h-full relative rounded-2xl shadow-2xl transition-shadow ${
          selected ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-950" : ""
        }`}
      >
        {/* ========================================================= */}
        {/* FRONT FACE (Card Artwork & Stats)                         */}
        {/* ========================================================= */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 bg-zinc-950 flex flex-col justify-between ${
            rarityBorders[card.rarity]
          }`}
        >
          {/* Card Artwork SVG */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={`/cards/art/${card.id}.svg`}
              alt={card.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if SVG not loaded
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Top Indicators: Cost & Power */}
          <div className="relative z-10 flex justify-between items-center p-2.5">
            {/* Cost Orb (Top Left) */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 border border-amber-200 shadow-md flex items-center justify-center">
              <span className="font-serif font-bold text-zinc-950 text-xs">{card.cost}</span>
            </div>

            {/* Rarity & Power Seal (Top Right) */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-950/80 border border-zinc-700/80 backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-amber-400">ATK</span>
              <span className="font-serif font-bold text-zinc-100 text-xs">{card.basePower}</span>
            </div>
          </div>

          {/* Orientation indicator badge if reversed */}
          {orientation === "reversed" && (
            <div className="relative z-10 self-center px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500 text-[9px] text-rose-300 font-bold uppercase tracking-wider backdrop-blur-sm">
              Reversed (-1)
            </div>
          )}

          {/* Bottom Card Title Footer */}
          <div className="relative z-10 p-2.5 pt-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-amber-400/90 font-bold block">
                  {card.rarity} · {card.suit}
                </span>
                <h4 className="font-serif font-bold text-zinc-100 text-sm leading-tight drop-shadow-md">
                  {card.name}
                </h4>
              </div>
              <span className="text-[10px] text-zinc-400 font-serif">#{card.id}</span>
            </div>
          </div>

          {/* Holographic Specular Foil Sheen */}
          <div
            style={{
              opacity: glarePos.opacity,
              background: isLegendary
                ? `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,215,0,0.5) 0%, rgba(255,0,128,0.3) 40%, rgba(0,255,255,0.2) 70%, transparent 100%)`
                : `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 50%, transparent 80%)`,
            }}
            className="absolute inset-0 pointer-events-none transition-opacity duration-150 z-30 mix-blend-color-dodge"
          />
        </div>

        {/* ========================================================= */}
        {/* BACK FACE (Ornate Gothic Card Back)                       */}
        {/* ========================================================= */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-amber-500/70 bg-zinc-950 shadow-2xl flex items-center justify-center"
        >
          <img
            src="/cards/art/back.svg"
            alt="Veilbound Arcana Card Back"
            className="w-full h-full object-cover"
          />
          {/* Subtle back sheen */}
          <div
            style={{
              opacity: glarePos.opacity * 0.7,
              background: `radial-gradient(circle at ${100 - glarePos.x}% ${glarePos.y}%, rgba(255,215,0,0.35) 0%, transparent 70%)`,
            }}
            className="absolute inset-0 pointer-events-none transition-opacity duration-150 z-30 mix-blend-screen"
          />
        </div>
      </motion.div>
    </div>
  );
};
