"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard3D, CardData } from "./TarotCard3D";
import { OFFICIAL_CARD_CATALOG } from "@veilbound/sdk";
import { useLobby } from "@/lib/lobby";
import { useWallet } from "@/lib/wallet";
import { useDeck } from "@/lib/game";
import { LobbyPanel } from "./LobbyPanel";

const ROUND_TIMEOUT_S = 120; // demo standard (docs/kamus-angka.md)

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Phase = "idle" | "commit" | "resolving" | "resolved" | "finished";

export const DuelArena3D: React.FC = () => {
  const { address } = useWallet();
  const deck = useDeck();
  const lobby = useLobby(address);
  const { state, practiceChallenge, commitRound, leaveRoom, clearError } = lobby;

  const practice = state.practice;
  const resolution = state.lastResolution;

  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedHandIndex, setSelectedHandIndex] = useState(0);
  const [allocatedEnergy, setAllocatedEnergy] = useState(2);
  const [pendingRound, setPendingRound] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_TIMEOUT_S);
  const deckLockedRef = useRef(false);

  // Auto-lock the local deck into the practice match (pre-round 1 only).
  useEffect(() => {
    if (practice && !deckLockedRef.current && practice.round === 1 && practice.scoreA === 0 && practice.scoreB === 0) {
      if (deck.defIds.length === 5 && deck.validation.valid) {
        lobby.lockDeck(deck.defIds);
        deckLockedRef.current = true;
      }
    }
  }, [practice, deck.defIds, deck.validation.valid, lobby]);

  // Phase derived from server state.
  useEffect(() => {
    if (!practice) {
      setPhase("idle");
      return;
    }
    if (practice.finished) {
      setPhase("finished");
      return;
    }
    if (pendingRound !== null && resolution && resolution.round === pendingRound) {
      setPhase("resolved");
      return;
    }
    if (pendingRound === null) setPhase("commit");
  }, [practice, resolution, pendingRound]);

  // Fresh energy allocation when the round/pool changes.
  useEffect(() => {
    if (practice) {
      setAllocatedEnergy(Math.min(2, practice.playerEnergy));
      setSelectedHandIndex(0);
    }
  }, [practice?.round, practice?.playerEnergy]);

  // Commit countdown (demo timeout window, 120s).
  useEffect(() => {
    if (phase !== "commit" || !practice) return;
    setSecondsLeft(ROUND_TIMEOUT_S);
    const t = setInterval(() => setSecondsLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [phase, practice?.round]);

  const handCards = useMemo(() => {
    if (!practice) return [];
    return practice.hand.map((c) => ({
      ...c,
      data: (OFFICIAL_CARD_CATALOG[c.cardId] ?? OFFICIAL_CARD_CATALOG[1]) as CardData,
    }));
  }, [practice]);

  const handleCommit = useCallback(() => {
    if (!practice || phase !== "commit") return;
    const slot = Math.min(selectedHandIndex, Math.max(0, practice.hand.length - 1));
    const energy = Math.max(0, Math.min(allocatedEnergy, practice.playerEnergy));
    commitRound(practice.round, slot, energy);
    setPendingRound(practice.round);
    setPhase("resolving");
  }, [practice, phase, selectedHandIndex, allocatedEnergy, commitRound]);

  const handleNextRound = () => {
    setPendingRound(null);
    setPhase("commit");
  };

  const handlePlayAgain = () => {
    leaveRoom();
    deckLockedRef.current = false;
    window.setTimeout(() => practiceChallenge(), 300);
  };

  const handleForfeit = () => {
    leaveRoom();
    deckLockedRef.current = false;
  };

  /* ------------------------------- no wallet ------------------------------- */
  if (!address) {
    return (
      <div className="max-w-2xl mx-auto bg-zinc-950 border border-amber-500/20 rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-amber-400 mb-2">Duel Arena</h2>
        <p className="text-sm text-zinc-400">Hubungkan wallet untuk masuk arena dan melawan Practice Bot.</p>
      </div>
    );
  }

  /* --------------------------- no active match ---------------------------- */
  if (!practice) {
    return (
      <div className="space-y-6">
        <LobbyPanel onEnterDuel={() => undefined} />
        {state.error && (
          <div role="alert" className="max-w-3xl mx-auto text-xs text-red-300 bg-red-950/40 border border-red-900 rounded-xl px-4 py-3 flex justify-between gap-3">
            <span>{state.error}</span>
            <button onClick={clearError} className="underline">
              Tutup
            </button>
          </div>
        )}
        <p className="text-center text-[11px] text-zinc-500">
          Saat match dimulai, arena akan terbuka di sini secara otomatis. Deck aktif:{" "}
          <strong className="text-zinc-300">{deck.defIds.length === 5 ? deck.defIds.length + " kartu siap" : "belum lengkap (butuh 5)"}</strong>
        </p>
      </div>
    );
  }

  const resolutionText =
    resolution?.winner === "A"
      ? "Ronde ini dimenangkan Anda!"
      : resolution?.winner === "B"
      ? "Ronde ini dimenangkan Practice Bot!"
      : "Ronde berakhir seri (0 poin).";

  return (
    <div className="relative flex flex-col items-center justify-between p-6 md:p-8 bg-zinc-950 text-zinc-100 rounded-3xl border border-amber-500/20 shadow-2xl max-w-5xl mx-auto my-6 overflow-hidden">
      {/* Top Banner & Match Header */}
      <div className="w-full flex flex-wrap justify-between items-center pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Practice Match · Server-side resolution (FR-20)
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-400">Ronde {practice.round} dari 3</h2>
          {phase === "commit" && (
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
              <span>Waktu commit:</span>
              <span
                className={`font-mono font-bold ${secondsLeft <= 15 ? "text-red-400 animate-pulse" : "text-amber-300"}`}
                aria-live="polite"
              >
                {formatClock(secondsLeft)}
              </span>
              {secondsLeft === 0 && <span className="text-red-400">— batas waktu demo terlampaui</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 bg-zinc-900/80 px-6 py-2.5 rounded-2xl border border-zinc-800 backdrop-blur-md">
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Player A (Anda)</span>
            <span className="text-3xl font-serif font-bold text-amber-400">{practice.scoreA}</span>
          </div>
          <span className="text-zinc-600 font-bold text-xl">:</span>
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Practice Bot (FR-20)</span>
            <span className="text-3xl font-serif font-bold text-purple-400">{practice.scoreB}</span>
          </div>
        </div>
      </div>

      {/* Opponent committed indicator */}
      {phase !== "finished" && state.opponentCommitted.includes(practice.round) && phase !== "resolved" && (
        <div className="mt-3 text-[11px] text-purple-300 bg-purple-950/40 border border-purple-900 rounded-xl px-4 py-2">
          Lawan sudah mengunci pilihan untuk ronde ini (blind commit).
        </div>
      )}

      {/* 3D BATTLEFIELD STAGE */}
      <div className="relative w-full min-h-[380px] flex flex-col items-center justify-center my-4">
        {/* Opponent Zone (Top) — hidden hand */}
        <div className="w-full flex justify-center items-center gap-4 mb-4 opacity-80 scale-90">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="transform -rotate-2 hover:rotate-0 transition-transform">
              <TarotCard3D
                card={(OFFICIAL_CARD_CATALOG[(idx % 4) + 1] ?? OFFICIAL_CARD_CATALOG[1]) as CardData}
                isFlipped={true}
                size="sm"
                interactive={false}
              />
            </div>
          ))}
        </div>

        {/* Combat Clash Area (Center) */}
        <div className="relative flex items-center justify-center gap-8 py-4 w-full">
          <AnimatePresence mode="wait">
            {phase === "commit" && (
              <motion.div
                key="commit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6 max-w-md"
              >
                <span className="text-xs font-serif text-zinc-400 block leading-relaxed">
                  Pilih satu kartu dari tangan rahasia, alokasikan energi tersisa (
                  <strong className="text-amber-300">{practice.playerEnergy}</strong> pool), lalu kunci pilihan sebelum
                  hitung mundur habis.
                </span>
                {deckLockedRef.current && <span className="text-[10px] text-emerald-400 mt-2 block">✓ Deck kamu terkunci untuk match ini</span>}
              </motion.div>
            )}

            {phase === "resolving" && (
              <motion.div
                key="resolving"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center justify-center py-6"
              >
                <div className="w-12 h-12 rounded-full border-2 border-t-amber-400 border-amber-900 animate-spin mb-3" />
                <span className="text-xs font-serif text-amber-300 animate-pulse">
                  Menunggu commit bot &amp; resolusi ronde di server…
                </span>
              </motion.div>
            )}

            {(phase === "resolved" || phase === "finished") && (
              <motion.div
                key="resolved"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-4 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-sm shadow-xl text-center"
                >
                  {phase === "finished"
                    ? state.finished
                      ? `Match selesai — skor ${state.finished.scoreA}:${state.finished.scoreB}`
                      : "Match berakhir"
                    : resolutionText}
                </motion.div>

                {resolution && (
                  <div className="grid grid-cols-2 gap-4 max-w-lg w-full mb-4">
                    <div className="bg-zinc-900 border border-amber-800/50 rounded-xl p-3 text-center">
                      <div className="text-[10px] uppercase text-zinc-500">Power Anda</div>
                      <div className="text-2xl font-bold text-amber-300">{resolution.powerA ?? "—"}</div>
                      {resolution.breakdownA && <div className="text-[9px] text-zinc-500 mt-1">{resolution.breakdownA}</div>}
                    </div>
                    <div className="bg-zinc-900 border border-purple-800/50 rounded-xl p-3 text-center">
                      <div className="text-[10px] uppercase text-zinc-500">Power Bot</div>
                      <div className="text-2xl font-bold text-purple-300">{resolution.powerB ?? "—"}</div>
                      {resolution.breakdownB && <div className="text-[9px] text-zinc-500 mt-1">{resolution.breakdownB}</div>}
                    </div>
                  </div>
                )}

                {phase === "resolved" && practice.round <= 3 && !practice.finished && (
                  <button
                    onClick={handleNextRound}
                    className="px-8 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-lg"
                  >
                    Lanjut ke Ronde Berikutnya →
                  </button>
                )}

                {phase === "finished" && (
                  <div className="flex flex-col items-center gap-3">
                    <h3 className="text-xl font-serif font-bold text-amber-400">
                      {practice.scoreA > practice.scoreB
                        ? "Selamat! Anda memenangkan pertandingan!"
                        : practice.scoreB > practice.scoreA
                        ? "Practice Bot memenangkan pertandingan."
                        : "Pertandingan berakhir seri."}
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={handlePlayAgain}
                        className="px-8 py-2.5 bg-gradient-to-r from-amber-600 to-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-lg"
                      >
                        Main Lagi
                      </button>
                      <button onClick={handleForfeit} className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs border border-zinc-700">
                        Kembali ke Lobby
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Player Zone: 3D Hand Fan */}
        {phase === "commit" && (
          <div className="w-full flex flex-col items-center mt-2">
            <span className="text-[11px] text-zinc-400 font-serif mb-2">
              Tangan rahasia kamu (dikirim terenkripsi — pilih 1 kartu):
            </span>
            <div className="flex items-center justify-center -space-x-8 py-2">
              {handCards.map((card, idx) => {
                const isSelected = selectedHandIndex === idx;
                const fanRotation = (idx - 1) * 10;
                return (
                  <motion.div
                    key={`${card.cardId}-${idx}`}
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
                      card={card.data}
                      size="sm"
                      isFlipped={false}
                      selected={isSelected}
                      interactive={true}
                      orientation={card.orientation}
                    />
                    <div className="text-center text-[9px] text-zinc-500 mt-1">
                      {card.name} · ⚡{card.cost}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Energy Allocation Control & Commit Button */}
      {phase === "commit" && (
        <div className="w-full max-w-lg bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-300 font-medium">Alokasi Energi Terenkripsi:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-amber-400 font-bold">
                {allocatedEnergy} / {practice.playerEnergy} Energi
              </span>
              <span className="text-[10px] text-zinc-500">(pool awal 6)</span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(0, practice.playerEnergy)}
            value={Math.min(allocatedEnergy, practice.playerEnergy)}
            onChange={(e) => setAllocatedEnergy(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
            aria-label="Alokasi energi"
          />

          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>0 Energi (Hemat)</span>
            <span>*Dilindungi Zero-Revert Clamp Guard</span>
            <span>{practice.playerEnergy} Energi (Maksimal)</span>
          </div>

          <button
            onClick={handleCommit}
            disabled={handCards.length === 0 || secondsLeft === 0}
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 disabled:opacity-50 text-zinc-950 font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20"
          >
            Kunci Pilihan (Commit Ronde {practice.round})
          </button>
          {secondsLeft === 0 && (
            <p className="text-[10px] text-red-400 text-center mt-2">
              Hitung mundur habis. Practice server tidak memaksa timeout — ronde tetap dapat dikunci (mode demo).
            </p>
          )}
        </div>
      )}
    </div>
  );
};
