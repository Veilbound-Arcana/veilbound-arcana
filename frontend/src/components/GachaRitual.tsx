"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { OFFICIAL_CARD_CATALOG } from "@veilbound/sdk";

export const GachaRitual: React.FC = () => {
  const [spreadType, setSpreadType] = useState<"single" | "three">("single");
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealedCard, setRevealedCard] = useState<any>(null);
  const [isUnsealed, setIsUnsealed] = useState(false);

  const handleDraw = () => {
    setIsDrawing(true);
    setRevealedCard(null);
    setIsUnsealed(false);

    // Simulate on-chain encrypted draw & decryption sequence
    setTimeout(() => {
      // Pick random card from official 20 catalog
      const randomId = Math.floor(Math.random() * 20) + 1;
      setRevealedCard(OFFICIAL_CARD_CATALOG[randomId]);
      setIsDrawing(false);
    }, 1800);
  };

  const handleUnseal = () => {
    setIsUnsealed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl max-w-xl mx-auto my-8">
      <h2 className="text-2xl font-serif text-amber-400 mb-2">Ritual Tarot Spread</h2>
      <p className="text-sm text-zinc-400 mb-6 text-center">
        Tarik kartu NFT tersegel on-chain. Hasil terenkripsi sampai Anda membukanya (Unseal).
      </p>

      {/* Spread Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSpreadType("single")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            spreadType === "single"
              ? "bg-amber-500/20 border-amber-500 text-amber-300"
              : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
          }`}
        >
          Single Spread (1 FATE)
        </button>
        <button
          onClick={() => setSpreadType("three")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            spreadType === "three"
              ? "bg-amber-500/20 border-amber-500 text-amber-300"
              : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
          }`}
        >
          Three-Card Spread (2.5 FATE)
        </button>
      </div>

      {/* Card Arena / Flip Area */}
      <div className="relative w-64 h-96 flex items-center justify-center mb-6 perspective">
        {isDrawing ? (
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-48 h-72 rounded-xl bg-gradient-to-br from-amber-900/40 to-purple-950/60 border-2 border-amber-500/50 flex flex-col items-center justify-center shadow-lg"
          >
            <div className="text-amber-300 font-serif text-sm animate-pulse">Menghitung FHE...</div>
          </motion.div>
        ) : revealedCard ? (
          <motion.div
            initial={{ rotateY: 180, scale: 0.8 }}
            animate={{ rotateY: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-48 h-72 rounded-xl bg-zinc-900 border-2 border-amber-500 p-4 flex flex-col justify-between shadow-2xl shadow-amber-500/20"
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
                {revealedCard.rarity} · {revealedCard.suit}
              </div>
              <h3 className="text-base font-serif font-bold text-zinc-100">{revealedCard.name}</h3>
            </div>
            <div className="flex justify-between items-center bg-zinc-950/70 p-2 rounded border border-zinc-800 text-xs">
              <span className="text-zinc-400">Power: <strong className="text-amber-300">{revealedCard.basePower}</strong></span>
              <span className="text-zinc-400">Cost: <strong className="text-amber-300">{revealedCard.cost}</strong></span>
            </div>
            <div className="text-center text-[10px] text-zinc-400 italic">
              {isUnsealed ? "✓ Unsealed (Aktif di Deck)" : "🔒 Tersegel (Milik Anda)"}
            </div>
          </motion.div>
        ) : (
          <div className="w-48 h-72 rounded-xl bg-zinc-900/40 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 text-sm">
            <span>Pilih Spread & Tarik</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleDraw}
          disabled={isDrawing}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-bold rounded-lg transition-all shadow-md"
        >
          {isDrawing ? "Mengundi..." : "Tarik Tarot Spread"}
        </button>

        {revealedCard && !isUnsealed && (
          <button
            onClick={handleUnseal}
            className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-zinc-100 font-bold rounded-lg transition-all border border-purple-500/40 shadow-md"
          >
            Unseal Kartu Ini
          </button>
        )}
      </div>
    </div>
  );
};
