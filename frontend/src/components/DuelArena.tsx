"use client";

import React, { useState } from "react";
import { OFFICIAL_CARD_CATALOG } from "@veilbound/sdk";

export const DuelArena: React.FC = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [remainingEnergy, setRemainingEnergy] = useState(6);
  const [allocatedEnergy, setAllocatedEnergy] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(1);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [isCommitted, setIsCommitted] = useState(false);
  const [roundOutcome, setRoundOutcome] = useState<string | null>(null);

  // Starter hand
  const hand = [OFFICIAL_CARD_CATALOG[1], OFFICIAL_CARD_CATALOG[5], OFFICIAL_CARD_CATALOG[9]];

  const handleCommit = () => {
    if (selectedSlot === null) return;
    setIsCommitted(true);
    setRemainingEnergy((prev) => Math.max(0, prev - allocatedEnergy));

    // Simulate opponent / bot commit & FHE coprocessor resolve
    setTimeout(() => {
      // Round resolution simulation
      const outcome = Math.random() > 0.4 ? "playerA" : "playerB";
      if (outcome === "playerA") {
        setScoreA((prev) => prev + 1);
        setRoundOutcome("Ronde Dimenangkan (+1 Poin)");
      } else {
        setScoreB((prev) => prev + 1);
        setRoundOutcome("Lawan Memenangkan Ronde");
      }
      setIsCommitted(false);
      if (currentRound < 3) {
        setCurrentRound((prev) => prev + 1);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl max-w-3xl mx-auto my-8">
      {/* Header & Scoreboard */}
      <div className="w-full flex justify-between items-center pb-4 mb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-400">Duel Arena (Sepolia)</span>
          <h2 className="text-xl font-serif text-amber-400">Ronde {currentRound} dari 3</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block uppercase">Anda</span>
            <span className="text-2xl font-bold text-amber-400">{scoreA}</span>
          </div>
          <span className="text-zinc-600 font-bold">:</span>
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block uppercase">Lawan / Bot</span>
            <span className="text-2xl font-bold text-purple-400">{scoreB}</span>
          </div>
        </div>
      </div>

      {roundOutcome && (
        <div className="mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-sm animate-pulse">
          {roundOutcome}
        </div>
      )}

      {/* Secret Hand (Locally Decrypted) */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-zinc-300">Tangan Rahasia Anda (Hanya Terlihat Oleh Anda):</span>
          <span className="text-xs text-amber-400">Sisa Pool Energi: <strong>{remainingEnergy} / 6</strong></span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {hand.map((card, idx) => {
            const slotIndex = idx + 1;
            const isSelected = selectedSlot === slotIndex;
            return (
              <div
                key={card.id}
                onClick={() => !isCommitted && setSelectedSlot(slotIndex)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 scale-102"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{card.suit}</div>
                <h4 className="font-serif font-bold text-sm text-zinc-100 mb-2">{card.name}</h4>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Base: <strong className="text-amber-400">{card.basePower}</strong></span>
                  <span>Cost: <strong className="text-amber-400">{card.cost}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy Allocation Slider */}
      <div className="w-full bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-zinc-300 font-medium">Alokasi Energi Ronde Ini (Terkunci Rahasia):</span>
          <span className="text-amber-400 font-bold">{allocatedEnergy} Energi</span>
        </div>
        <input
          type="range"
          min={0}
          max={remainingEnergy}
          value={allocatedEnergy}
          onChange={(e) => setAllocatedEnergy(Number(e.target.value))}
          disabled={isCommitted || remainingEnergy === 0}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <span className="text-[10px] text-zinc-500 mt-1 block">
          *Input dilindungi FHE.select clamp guard (tidak pernah revert).
        </span>
      </div>

      {/* Commit Button */}
      <button
        onClick={handleCommit}
        disabled={isCommitted || selectedSlot === null}
        className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl transition-all shadow-lg text-sm"
      >
        {isCommitted ? "Mengirim Komitmen Terenkripsi..." : "Kunci Pilihan (Commit Round)"}
      </button>
    </div>
  );
};
