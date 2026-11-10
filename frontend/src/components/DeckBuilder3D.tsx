"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TarotCard3D, CardData } from "./TarotCard3D";
import { OFFICIAL_CARD_CATALOG } from "@veilbound/sdk";

export const DeckBuilder3D: React.FC = () => {
  // 5 Slotted card IDs (default starter deck)
  const [deckSlots, setDeckSlots] = useState<number[]>([1, 2, 5, 9, 13]);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [isLocked, setIsLocked] = useState(false);

  const allCards = Object.values(OFFICIAL_CARD_CATALOG) as CardData[];

  const filteredCards = allCards.filter((card) => {
    if (selectedFilter === "ALL") return true;
    if (selectedFilter === "MAJOR") return card.arcana === "Major";
    return card.suit.toUpperCase() === selectedFilter;
  });

  const totalCost = deckSlots.reduce((sum, id) => sum + OFFICIAL_CARD_CATALOG[id].cost, 0);
  const isCostValid = totalCost <= 12;
  const isCountValid = deckSlots.length === 5;

  // Check duplicate constraints
  const counts: Record<number, number> = {};
  deckSlots.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
  const hasTooManyDuplicates = Object.values(counts).some((count) => count > 2);

  const handleRemoveFromDeck = (index: number) => {
    if (isLocked) return;
    setDeckSlots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddToDeck = (id: number) => {
    if (isLocked || deckSlots.length >= 5) return;
    const currentCount = counts[id] || 0;
    if (currentCount >= 2) return; // Prevent >2 duplicates
    setDeckSlots((prev) => [...prev, id]);
  };

  const handleLockDeck = () => {
    if (isCostValid && isCountValid && !hasTooManyDuplicates) {
      setIsLocked(true);
    }
  };

  return (
    <div className="flex flex-col p-6 md:p-8 bg-zinc-950 text-zinc-100 rounded-3xl border border-amber-500/20 shadow-2xl max-w-5xl mx-auto my-6 overflow-hidden">
      {/* Header & Constraint Meters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-amber-400 uppercase font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full inline-block mb-1">
            Deck Construction Engine
          </span>
          <h2 className="text-2xl font-serif font-bold text-amber-400">
            Altar Deck 5 Kartu (3D Altar)
          </h2>
          <p className="text-xs text-zinc-400">
            Pilih 5 kartu Unsealed. Batas total cost $\le 12$, maksimal 2 kartu duplikat.
          </p>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-6 bg-zinc-900/80 px-6 py-3 rounded-2xl border border-zinc-800">
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Total Cost</span>
            <span className={`text-xl font-serif font-bold ${isCostValid ? "text-emerald-400" : "text-rose-400"}`}>
              {totalCost} / 12
            </span>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Kartu Terisi</span>
            <span className={`text-xl font-serif font-bold ${isCountValid ? "text-emerald-400" : "text-amber-400"}`}>
              {deckSlots.length} / 5
            </span>
          </div>
        </div>
      </div>

      {/* 5 3D PEDESTAL SLOTS (Active Deck) */}
      <div className="my-6">
        <span className="text-xs text-zinc-400 font-serif mb-3 block">
          Kartu Terpasang di Altar (Klik untuk Mencopot):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 justify-items-center bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 min-h-[260px] items-center">
          {[0, 1, 2, 3, 4].map((slotIdx) => {
            const cardId = deckSlots[slotIdx];
            const card = cardId ? (OFFICIAL_CARD_CATALOG[cardId] as CardData) : null;
            return (
              <div key={slotIdx} className="flex flex-col items-center">
                {card ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ y: -6 }}
                    className="cursor-pointer"
                    onClick={() => handleRemoveFromDeck(slotIdx)}
                  >
                    <TarotCard3D card={card} size="sm" isFlipped={false} interactive={true} />
                  </motion.div>
                ) : (
                  <div
                    className="w-36 h-56 rounded-2xl border-2 border-dashed border-zinc-700/80 bg-zinc-950/60 flex flex-col items-center justify-center text-zinc-600 gap-2 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center font-serif text-xs">
                      {slotIdx + 1}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Slot Kosong</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "WANDS", "CUPS", "SWORDS", "PENTACLES", "MAJOR"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedFilter === filter
                  ? "bg-amber-500 text-zinc-950 shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Lock Deck Button */}
        <button
          onClick={handleLockDeck}
          disabled={!isCostValid || !isCountValid || hasTooManyDuplicates || isLocked}
          className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
        >
          {isLocked ? "✓ Decklist Terkunci On-Chain" : "Kunci Decklist (On-Chain Lock)"}
        </button>
      </div>

      {/* 3D Binder / Collection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[380px] overflow-y-auto p-2 bg-zinc-900/30 rounded-2xl border border-zinc-800/60">
        {filteredCards.map((card) => {
          const inDeckCount = counts[card.id] || 0;
          const isMaxed = inDeckCount >= 2;
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -4 }}
              onClick={() => handleAddToDeck(card.id)}
              className={`relative flex flex-col items-center ${isMaxed ? "opacity-40" : "cursor-pointer"}`}
            >
              <TarotCard3D card={card} size="sm" isFlipped={false} interactive={true} />
              {inDeckCount > 0 && (
                <div className="absolute top-2 right-2 bg-amber-500 text-zinc-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md z-30">
                  {inDeckCount}x
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
