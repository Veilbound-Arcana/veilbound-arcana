"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard3D, CardData } from "./TarotCard3D";
import { OFFICIAL_CARD_CATALOG } from "@veilbound/sdk";

export const DuelArena3D: React.FC = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [remainingEnergy, setRemainingEnergy] = useState(6);
  const [allocatedEnergy, setAllocatedEnergy] = useState(2);
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(0);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [matchPhase, setMatchPhase] = useState<"commit" | "resolving" | "resolved" | "finished">("commit");
  const [playedCardA, setPlayedCardA] = useState<CardData | null>(null);
  const [playedCardB, setPlayedCardB] = useState<CardData | null>(null);
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [powerBreakdown, setPowerBreakdown] = useState<any>(null);

  // Player's 3-card confidential hand
  const [hand, setHand] = useState<CardData[]>([
    OFFICIAL_CARD_CATALOG[3] as CardData,  // Queen of Wands (Rare, Power 3, Wands)
    OFFICIAL_CARD_CATALOG[5] as CardData,  // Page of Cups (Common, Power 2, Cups)
    OFFICIAL_CARD_CATALOG[11] as CardData, // Queen of Swords (Rare, Power 3, Swords)
  ]);

  // Bot's 3-card deck
  const botDeck: CardData[] = [
    OFFICIAL_CARD_CATALOG[10] as CardData, // Knight of Swords
    OFFICIAL_CARD_CATALOG[14] as CardData, // Knight of Pentacles
    OFFICIAL_CARD_CATALOG[2] as CardData,  // Knight of Wands
  ];

  const handleCommitRound = () => {
    if (selectedHandIndex === null) return;
    const cardA = hand[selectedHandIndex];
    const energyBid = Math.min(allocatedEnergy, remainingEnergy);

    setPlayedCardA(cardA);
    setMatchPhase("resolving");
    setRemainingEnergy((prev) => Math.max(0, prev - energyBid));

    // Bot AI move
    const cardB = botDeck[(currentRound - 1) % botDeck.length];
    setPlayedCardB(cardB);

    // Simulate FHE coprocessor resolve delay
    setTimeout(() => {
      // Elemental advantage logic
      let suitBonusA = 0;
      let suitBonusB = 0;
      if (cardA.suit === "Wands" && cardB.suit === "Swords") suitBonusA = 1;
      if (cardA.suit === "Swords" && cardB.suit === "Pentacles") suitBonusA = 1;
      if (cardA.suit === "Pentacles" && cardB.suit === "Cups") suitBonusA = 1;
      if (cardA.suit === "Cups" && cardB.suit === "Wands") suitBonusA = 1;

      if (cardB.suit === "Wands" && cardA.suit === "Swords") suitBonusB = 1;
      if (cardB.suit === "Swords" && cardA.suit === "Pentacles") suitBonusB = 1;
      if (cardB.suit === "Pentacles" && cardA.suit === "Cups") suitBonusB = 1;
      if (cardB.suit === "Cups" && cardA.suit === "Wands") suitBonusB = 1;

      const orientModA = 1; // Upright
      const orientModB = -1; // Bot reversed
      const botEnergy = currentRound === 3 ? 2 : 1;

      const totalPowerA = cardA.basePower + energyBid + suitBonusA + orientModA;
      const totalPowerB = cardB.basePower + botEnergy + suitBonusB + orientModB;

      let winner = "tie";
      if (totalPowerA > totalPowerB) {
        winner = "playerA";
        setScoreA((prev) => prev + 1);
        setRoundWinner("Player A Menang Ronde!");
      } else if (totalPowerB > totalPowerA) {
        winner = "playerB";
        setScoreB((prev) => prev + 1);
        setRoundWinner("Practice Bot Menang Ronde!");
      } else {
        setRoundWinner("Ronde Seri (0 Poin)!");
      }

      setPowerBreakdown({
        powerA: totalPowerA,
        powerB: totalPowerB,
        calcA: `${cardA.basePower} (Base) + ${energyBid} (Energy) + ${suitBonusA} (Suit) + 1 (Upright)`,
        calcB: `${cardB.basePower} (Base) + ${botEnergy} (Energy) + ${suitBonusB} (Suit) - 1 (Reversed)`,
      });

      setMatchPhase("resolved");
    }, 2000);
  };

  const handleNextRound = () => {
    if (scoreA >= 2 || scoreB >= 2 || currentRound >= 3) {
      setMatchPhase("finished");
    } else {
      setCurrentRound((prev) => prev + 1);
      setMatchPhase("commit");
      setSelectedHandIndex(0);
      setAllocatedEnergy(Math.min(2, remainingEnergy));
      setPlayedCardA(null);
      setPlayedCardB(null);
      setRoundWinner(null);
      setPowerBreakdown(null);
    }
  };

  const handleRestart = () => {
    setCurrentRound(1);
    setRemainingEnergy(6);
    setAllocatedEnergy(2);
    setSelectedHandIndex(0);
    setScoreA(0);
    setScoreB(0);
    setMatchPhase("commit");
    setPlayedCardA(null);
    setPlayedCardB(null);
    setRoundWinner(null);
    setPowerBreakdown(null);
  };

  return (
    <div className="relative flex flex-col items-center justify-between p-6 md:p-8 bg-zinc-950 text-zinc-100 rounded-3xl border border-amber-500/20 shadow-2xl max-w-5xl mx-auto my-6 overflow-hidden">
      {/* Top Banner & Match Header */}
      <div className="w-full flex justify-between items-center pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Sepolia Duel Arena (Confidential FHEVM)
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-400">
            Ronde {currentRound} dari 3
          </h2>
        </div>

        {/* 3D Duel Scoreboard */}
        <div className="flex items-center gap-6 bg-zinc-900/80 px-6 py-2.5 rounded-2xl border border-zinc-800 backdrop-blur-md">
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Player A (Anda)</span>
            <span className="text-3xl font-serif font-bold text-amber-400">{scoreA}</span>
          </div>
          <span className="text-zinc-600 font-bold text-xl">:</span>
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Practice Bot (FR-20)</span>
            <span className="text-3xl font-serif font-bold text-purple-400">{scoreB}</span>
          </div>
        </div>
      </div>

      {/* 3D BATTLEFIELD STAGE */}
      <div className="relative w-full min-h-[420px] flex flex-col items-center justify-center my-4">
        {/* Opponent Zone (Top) */}
        <div className="w-full flex justify-center items-center gap-4 mb-4 opacity-80 scale-90">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="transform -rotate-2 hover:rotate-0 transition-transform">
              <TarotCard3D
                card={OFFICIAL_CARD_CATALOG[idx] as CardData}
                isFlipped={true}
                size="sm"
                interactive={false}
              />
            </div>
          ))}
        </div>

        {/* Combat Clash Area (Center) */}
        <div className="relative flex items-center justify-center gap-8 py-4 w-full">
          {matchPhase === "commit" && (
            <div className="text-center py-8">
              <span className="text-xs font-serif text-zinc-400 block">
                Pilih kartu dari tangan rahasia Anda di bawah, alokasikan energi, lalu klik **Kunci Pilihan**.
              </span>
            </div>
          )}

          {matchPhase === "resolving" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <div className="w-12 h-12 rounded-full border-2 border-t-amber-400 border-amber-900 animate-spin mb-3" />
              <span className="text-xs font-serif text-amber-300 animate-pulse">
                FHE Coprocessor Menghitung Power Ronde & Siklus Suit...
              </span>
            </motion.div>
          )}

          {(matchPhase === "resolved" || matchPhase === "finished") && (
            <div className="flex flex-col items-center">
              {/* Winner Announcement Banner */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-4 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-sm shadow-xl"
              >
                {roundWinner}
              </motion.div>

              {/* Clashing Cards in 3D */}
              <div className="flex items-center gap-8">
                {playedCardA && (
                  <motion.div
                    initial={{ x: -60, rotateY: 180 }}
                    animate={{ x: 0, rotateY: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Kartu Anda</span>
                    <TarotCard3D card={playedCardA} size="sm" isFlipped={false} interactive={true} />
                    <span className="text-xs font-bold text-amber-300">Power: {powerBreakdown?.powerA}</span>
                    <span className="text-[9px] text-zinc-500">{powerBreakdown?.calcA}</span>
                  </motion.div>
                )}

                <div className="text-2xl font-serif font-bold text-amber-400">VS</div>

                {playedCardB && (
                  <motion.div
                    initial={{ x: 60, rotateY: 180 }}
                    animate={{ x: 0, rotateY: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-[10px] text-purple-400 font-bold uppercase">Kartu Bot</span>
                    <TarotCard3D card={playedCardB} size="sm" isFlipped={false} orientation="reversed" interactive={true} />
                    <span className="text-xs font-bold text-purple-300">Power: {powerBreakdown?.powerB}</span>
                    <span className="text-[9px] text-zinc-500">{powerBreakdown?.calcB}</span>
                  </motion.div>
                )}
              </div>

              {matchPhase === "resolved" && (
                <button
                  onClick={handleNextRound}
                  className="mt-6 px-8 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-lg"
                >
                  Lanjut ke Ronde Berikutnya →
                </button>
              )}

              {matchPhase === "finished" && (
                <div className="flex flex-col items-center mt-6 gap-3">
                  <h3 className="text-xl font-serif font-bold text-amber-400">
                    {scoreA > scoreB ? "🏆 Selamat! Anda Memenangkan Pertandingan!" : "Match Berakhir!"}
                  </h3>
                  <button
                    onClick={handleRestart}
                    className="px-8 py-2.5 bg-gradient-to-r from-amber-600 to-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-lg"
                  >
                    Main Lagi Melawan Practice Bot
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Player Zone: 3D Hand Fan (Bottom) */}
        {matchPhase === "commit" && (
          <div className="w-full flex flex-col items-center mt-2">
            <span className="text-[11px] text-zinc-400 font-serif mb-2">
              Tangan Rahasia Anda (Didekripsi Lokal — Pilih 1 Kartu):
            </span>

            {/* Natural Hand Fan (Rotated angles: -10deg, 0deg, +10deg) */}
            <div className="flex items-center justify-center -space-x-8 py-2">
              {hand.map((card, idx) => {
                const isSelected = selectedHandIndex === idx;
                const fanRotation = (idx - 1) * 10; // -10, 0, 10
                return (
                  <motion.div
                    key={card.id}
                    onClick={() => setSelectedHandIndex(idx)}
                    animate={{
                      y: isSelected ? -24 : 0,
                      rotateZ: isSelected ? 0 : fanRotation,
                      scale: isSelected ? 1.08 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="cursor-pointer z-10 hover:z-20"
                  >
                    <TarotCard3D
                      card={card}
                      size="sm"
                      isFlipped={false}
                      selected={isSelected}
                      interactive={true}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Energy Allocation Control & Commit Button */}
      {matchPhase === "commit" && (
        <div className="w-full max-w-lg bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-300 font-medium">Alokasi Energi Terenkripsi:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-amber-400 font-bold">{allocatedEnergy} / {remainingEnergy} Energi</span>
              <span className="text-[10px] text-zinc-500">(Total Pool: 6)</span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={remainingEnergy}
            value={allocatedEnergy}
            onChange={(e) => setAllocatedEnergy(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>0 Energi (Hemat)</span>
            <span>*Dilindungi Zero-Revert Clamp Guard</span>
            <span>{remainingEnergy} Energi (Maksimal)</span>
          </div>

          <button
            onClick={handleCommitRound}
            disabled={selectedHandIndex === null}
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 disabled:opacity-50 text-zinc-950 font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20"
          >
            Kunci Pilihan (Commit Ronde)
          </button>
        </div>
      )}
    </div>
  );
};
