"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard3D, CardData } from "./TarotCard3D";
import { OFFICIAL_CARD_CATALOG } from "@veilbound/sdk";

export const GachaRitual3D: React.FC = () => {
  const [spreadMode, setSpreadMode] = useState<"single" | "three">("single");
  const [ritualState, setRitualState] = useState<"idle" | "summoning" | "revealed">("idle");
  const [drawnCards, setDrawnCards] = useState<CardData[]>([]);
  const [cardFlipStates, setCardFlipStates] = useState<boolean[]>([true, true, true]); // true = back visible
  const [unsealedCards, setUnsealedCards] = useState<boolean[]>([false, false, false]);
  const [pityCounter, setPityCounter] = useState(3); // 3 pulls toward guarantee

  const handleStartRitual = () => {
    setRitualState("summoning");
    setCardFlipStates(spreadMode === "single" ? [true] : [true, true, true]);
    setUnsealedCards(spreadMode === "single" ? [false] : [false, false, false]);

    // Simulate on-chain encrypted FHE random generation
    setTimeout(() => {
      const count = spreadMode === "single" ? 1 : 3;
      const results: CardData[] = [];
      for (let i = 0; i < count; i++) {
        // Roll rarity based on official odds (60% common, 25% rare, 12% epic, 3% legendary)
        const roll = Math.random() * 100;
        let pool = [1, 2, 5, 6, 9, 10, 13, 14]; // Common
        if (roll > 97) pool = [17, 18, 19, 20]; // Legendary
        else if (roll > 85) pool = [4, 8, 12, 16]; // Epic
        else if (roll > 60) pool = [3, 7, 11, 15]; // Rare

        const chosenId = pool[Math.floor(Math.random() * pool.length)];
        results.push(OFFICIAL_CARD_CATALOG[chosenId] as CardData);
      }
      setDrawnCards(results);
      setRitualState("revealed");
      setPityCounter((prev) => (prev + count) % 25);
    }, 1600);
  };

  const handleFlipCard = (index: number) => {
    setCardFlipStates((prev) => {
      const updated = [...prev];
      updated[index] = false; // flip to front
      return updated;
    });
  };

  const handleUnsealAll = () => {
    setUnsealedCards((prev) => prev.map(() => true));
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 md:p-10 bg-zinc-950 text-zinc-100 rounded-3xl border border-amber-500/20 shadow-2xl max-w-4xl mx-auto my-6 overflow-hidden">
      {/* Background Arcane Rune Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="w-[600px] h-[600px] rounded-full border-2 border-dashed border-amber-400"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="absolute w-[450px] h-[450px] rounded-full border border-amber-300/40"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <span className="text-[10px] tracking-widest text-amber-400 uppercase font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full inline-block mb-2">
          FHE Encrypted On-Chain Oracle
        </span>
        <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
          Ritual Tarot Spread
        </h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
          Pilih spread, bayar dengan $FATE, dan tarik kartu NFT tersegel. Hasil tidak dapat diintip bot sebelum di-unseal.
        </p>
      </div>

      {/* Spread Selector & Pity Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full max-w-lg mb-8 gap-4 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex gap-2">
          <button
            onClick={() => { setSpreadMode("single"); setRitualState("idle"); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              spreadMode === "single"
                ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Single (1 FATE)
          </button>
          <button
            onClick={() => { setSpreadMode("three"); setRitualState("idle"); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              spreadMode === "three"
                ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Three-Card (2.5 FATE)
          </button>
        </div>

        {/* Pity Counter Gauge */}
        <div className="text-right w-full sm:w-auto pr-2">
          <div className="flex justify-between sm:justify-end gap-2 text-[10px] text-zinc-400 mb-1">
            <span>Pity Jaminan:</span>
            <strong className="text-amber-400">{pityCounter} / 25</strong>
          </div>
          <div className="w-full sm:w-28 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${(pityCounter / 25) * 100}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 3D Card Summoning Circle / Altar */}
      <div className="relative z-10 min-h-[360px] flex items-center justify-center w-full my-2">
        <AnimatePresence mode="wait">
          {ritualState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center gap-6"
            >
              {/* Suspended 3D Back Cards */}
              <div className="flex items-center justify-center -space-x-12 hover:space-x-4 transition-all duration-300 py-6">
                {[1, 2, 3].map((item, idx) => (
                  <motion.div
                    key={item}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: idx * 0.4 }}
                    className="transform hover:scale-105 transition-transform"
                  >
                    <TarotCard3D
                      card={OFFICIAL_CARD_CATALOG[1] as CardData}
                      isFlipped={true}
                      size="sm"
                      interactive={true}
                    />
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleStartRitual}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-zinc-950 font-bold rounded-2xl shadow-xl shadow-amber-500/20 text-sm tracking-wide transition-all transform hover:scale-102"
              >
                Mulai Ritual Penarikan ({spreadMode === "single" ? "1 FATE" : "2.5 FATE"})
              </button>
            </motion.div>
          )}

          {ritualState === "summoning" && (
            <motion.div
              key="summoning"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div
                animate={{ rotateY: 720 }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                className="w-40 h-60 rounded-2xl border-2 border-amber-400 bg-amber-950/40 shadow-2xl shadow-amber-500/50 flex flex-col items-center justify-center p-4"
              >
                <div className="w-12 h-12 rounded-full border-2 border-t-amber-300 border-amber-700 animate-spin mb-4" />
                <span className="text-xs font-serif text-amber-300 text-center animate-pulse">
                  Menghasilkan Acak FHE di Sepolia...
                </span>
              </motion.div>
            </motion.div>
          )}

          {ritualState === "revealed" && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-center mb-4">
                <span className="text-xs text-amber-300 font-serif">
                  Kartu Tersegel Telah Ter-minting! Klik kartu untuk membalik (3D Flip):
                </span>
              </div>

              {/* Revealed 3D Cards */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                {drawnCards.map((card, idx) => {
                  const isCardFlipped = cardFlipStates[idx];
                  const isUnsealed = unsealedCards[idx];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, y: 40 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.2, type: "spring", stiffness: 200 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <TarotCard3D
                        card={card}
                        isFlipped={isCardFlipped}
                        onClick={() => handleFlipCard(idx)}
                        size="md"
                        interactive={true}
                      />
                      <span className="text-[10px] text-zinc-400">
                        {isCardFlipped
                          ? "🔒 Tersegel (Klik untuk Flip)"
                          : isUnsealed
                          ? "✓ Unsealed (Aktif di Deck)"
                          : "Menunggu Unseal"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleUnsealAll}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-zinc-100 font-bold rounded-xl text-xs transition-all shadow-lg shadow-purple-900/30 border border-purple-500/40"
                >
                  Unseal Semua Kartu (On-Chain Proof)
                </button>
                <button
                  onClick={() => setRitualState("idle")}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition-all border border-zinc-700"
                >
                  Tarik Lagi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
