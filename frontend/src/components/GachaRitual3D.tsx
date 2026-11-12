"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard3D, CardData } from "./TarotCard3D";
import { TxStatus } from "./TxStatus";
import {
  DISCLAIMER,
  GACHA_THRESHOLDS,
  OFFICIAL_CARD_CATALOG,
  unitsToFate,
} from "@veilbound/sdk";
import { etherscanAddressUrl } from "@/lib/env";
import { useCollection, useFateBalance, useReadContracts, useSignerContracts, useTx } from "@/lib/game";
import { useWallet } from "@/lib/wallet";

interface DrawnCard {
  tokenId: number;
  defId: number; // 0 = still sealed
  isSealed: boolean;
  demo: boolean;
}

const ROLL_POOLS: Record<string, number[]> = {
  Legendary: [17, 18, 19, 20],
  Epic: [4, 8, 12, 16],
  Rare: [3, 7, 11, 15],
  Common: [1, 2, 5, 6, 9, 10, 13, 14],
};

function demoRoll(): number {
  const roll = Math.random() * 256;
  if (roll > GACHA_THRESHOLDS.epic) return pick(ROLL_POOLS.Legendary);
  if (roll > GACHA_THRESHOLDS.rare) return pick(ROLL_POOLS.Epic);
  if (roll > GACHA_THRESHOLDS.common) return pick(ROLL_POOLS.Rare);
  return pick(ROLL_POOLS.Common);
}

function pick(pool: number[]): number {
  return pool[Math.floor(Math.random() * pool.length)];
}

export const GachaRitual3D: React.FC = () => {
  const { address } = useWallet();
  const read = useReadContracts();
  const { contracts } = useSignerContracts();
  const { state: txState, run, reset } = useTx();
  const balance = useFateBalance(address);
  const collection = useCollection(address);

  const [spreadMode, setSpreadMode] = useState<"single" | "three">("single");
  const [ritualState, setRitualState] = useState<"idle" | "summoning" | "revealed">("idle");
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [unsealPicker, setUnsealPicker] = useState<number | null>(null);
  const [pity, setPity] = useState<{ totalPulls: number; pullsWithoutRare: number; pullsWithoutEpic: number } | null>(null);
  const [prices, setPrices] = useState<{ single: number; three: number }>({ single: 1, three: 2.5 });
  const [pageError, setPageError] = useState<string | undefined>();

  const loadChainData = useCallback(async () => {
    try {
      const [s, t] = await Promise.all([read.tarotGacha.singleSpreadPrice(), read.tarotGacha.threeSpreadPrice()]);
      setPrices({ single: unitsToFate(s), three: unitsToFate(t) });
    } catch {
      /* contract not deployed yet — defaults remain */
    }
    if (address) {
      try {
        const p = await read.tarotGacha.getPityMeter(address);
        setPity({
          totalPulls: Number(p.totalPulls),
          pullsWithoutRare: Number(p.pullsWithoutRare),
          pullsWithoutEpic: Number(p.pullsWithoutEpic),
        });
      } catch {
        setPity(null);
      }
    }
  }, [read, address]);

  useEffect(() => {
    void loadChainData();
  }, [loadChainData]);

  const price = spreadMode === "single" ? prices.single : prices.three;

  const handleOnChainDraw = async () => {
    if (!contracts) return;
    setPageError(undefined);
    setDemoMode(false);
    setRitualState("summoning");
    const receipt = await run(() =>
      spreadMode === "single" ? contracts.tarotGacha.drawSingle() : contracts.tarotGacha.drawThreeCard()
    );
    if (!receipt) {
      setRitualState("idle");
      return;
    }
    const event = contracts.tarotGacha.parseSpreadDrawn(receipt);
    const tokenIds = event ? Array.from(event.args.tokenIds as ArrayLike<bigint | number>).map(Number) : [];
    setDrawn(tokenIds.map((tokenId) => ({ tokenId, defId: 0, isSealed: true, demo: false })));
    setRitualState("revealed");
    void loadChainData();
    balance.refresh();
    collection.refresh();
  };

  /** Clearly-labelled local simulation — used only when no wallet/contract is wired. */
  const handleDemoDraw = () => {
    setPageError(undefined);
    setDemoMode(true);
    setRitualState("summoning");
    window.setTimeout(() => {
      const count = spreadMode === "single" ? 1 : 3;
      const results: DrawnCard[] = [];
      for (let i = 0; i < count; i++) {
        const defId = demoRoll();
        results.push({ tokenId: -(i + 1), defId, isSealed: false, demo: true });
      }
      setDrawn(results);
      setRitualState("revealed");
    }, 1400);
  };

  const handleUnseal = async (tokenId: number, defId: number) => {
    if (!contracts || tokenId <= 0) {
      // Demo cards are local-only: reveal directly.
      setDrawn((prev) => prev.map((c) => (c.tokenId === tokenId ? { ...c, defId, isSealed: false } : c)));
      setUnsealPicker(null);
      return;
    }
    const receipt = await run(() => contracts.arcanaCards.unseal(tokenId, defId));
    if (receipt) {
      setDrawn((prev) => prev.map((c) => (c.tokenId === tokenId ? { ...c, defId, isSealed: false } : c)));
      setUnsealPicker(null);
      collection.refresh();
    }
  };

  const sealedCount = drawn.filter((c) => c.isSealed).length;

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
          Bayar dengan $FATE, tarik kartu NFT tersegel. Odds &amp; pity dibaca dari kontrak TarotGacha di Sepolia.
        </p>
        <p className="text-[10px] text-zinc-500 mt-1">
          Saldo: <strong className="text-amber-300">{unitsToFate(balance.balance).toFixed(2)} FATE</strong>
          {address && (
            <>
              {" · "}
              <a href={etherscanAddressUrl(address)} target="_blank" rel="noopener noreferrer" className="underline text-amber-600">
                lihat di Etherscan
              </a>
            </>
          )}
        </p>
      </div>

      {demoMode && ritualState !== "idle" && (
        <div className="relative z-10 mb-4 px-4 py-2 rounded-xl bg-red-950/60 border border-red-800 text-[11px] text-red-300 text-center max-w-lg">
          <strong>MODE SIMULASI LOKAL</strong> — kartu dihasilkan di browser, tanpa transaksi on-chain dan tanpa FHE.
          Gunakan tombol on-chain saat wallet sudah terhubung.
        </div>
      )}

      {/* Spread Selector & Pity Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full max-w-lg mb-8 gap-4 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSpreadMode("single");
              setRitualState("idle");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              spreadMode === "single" ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Single ({prices.single} FATE)
          </button>
          <button
            onClick={() => {
              setSpreadMode("three");
              setRitualState("idle");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              spreadMode === "three" ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Three-Card ({prices.three} FATE)
          </button>
        </div>

        <div className="text-right w-full sm:w-auto pr-2">
          <div className="flex justify-between sm:justify-end gap-2 text-[10px] text-zinc-400 mb-1">
            <span>Pity (tanpa Epic):</span>
            <strong className="text-amber-400">{pity ? pity.pullsWithoutEpic : 0} / 12</strong>
          </div>
          <div className="w-full sm:w-28 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${((pity?.pullsWithoutEpic ?? 0) / 12) * 100}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
            />
          </div>
          <div className="text-[9px] text-zinc-600 mt-1">
            Threshold: ≤{GACHA_THRESHOLDS.common} Common · ≤{GACHA_THRESHOLDS.rare} Rare · ≤{GACHA_THRESHOLDS.epic} Epic · sisanya Legendary
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="relative z-10 w-full max-w-lg mb-4">
        <TxStatus state={txState} onReset={reset} />
        {pageError && <p className="text-xs text-red-400 mt-2 text-center">{pageError}</p>}
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
              <div className="flex items-center justify-center -space-x-12 hover:space-x-4 transition-all duration-300 py-6">
                {[1, 2, 3].map((item, idx) => (
                  <motion.div
                    key={item}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: idx * 0.4 }}
                    className="transform hover:scale-105 transition-transform"
                  >
                    <TarotCard3D card={OFFICIAL_CARD_CATALOG[1] as CardData} isFlipped={true} size="sm" interactive={true} />
                  </motion.div>
                ))}
              </div>

              {contracts ? (
                <button
                  onClick={() => void handleOnChainDraw()}
                  disabled={txState.status === "pending_signature" || txState.status === "submitted" || txState.status === "confirming"}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 disabled:from-zinc-800 disabled:to-zinc-700 disabled:text-zinc-500 text-zinc-950 font-bold rounded-2xl shadow-xl shadow-amber-500/20 text-sm tracking-wide transition-all"
                >
                  {txState.status === "pending_signature" || txState.status === "submitted"
                    ? "Menunggu transaksi…"
                    : `Ritual On-Chain (${price} FATE)`}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={handleDemoDraw}
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-zinc-950 font-bold rounded-2xl shadow-xl shadow-amber-500/20 text-sm tracking-wide"
                  >
                    Ritual Simulasi Lokal (tanpa wallet)
                  </button>
                  <span className="text-[10px] text-zinc-500">Hubungkan wallet Sepolia untuk ritual on-chain sungguhan.</span>
                </div>
              )}
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
                  {contracts && !demoMode ? "Transaksi gacha di Sepolia…" : "Menghasilkan acak lokal…"}
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
                  {sealedCount > 0
                    ? `Kartu tersegel telah di-mint (token ID: ${drawn.map((d) => d.tokenId).join(", ")}). Pilih deklarasi defId untuk unseal:`
                    : "Kartu terungkap — siap dipakai di Deck Builder:"}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
                {drawn.map((entry, idx) => {
                  const def = entry.defId > 0 ? OFFICIAL_CARD_CATALOG[entry.defId] : undefined;
                  const cardData = (def ?? OFFICIAL_CARD_CATALOG[1]) as CardData;
                  const isFlipped = entry.isSealed;
                  return (
                    <motion.div
                      key={entry.tokenId}
                      initial={{ scale: 0, y: 40 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.2, type: "spring", stiffness: 200 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <TarotCard3D card={cardData} isFlipped={isFlipped} size="md" interactive={!isFlipped} />
                      <span className="text-[10px] text-zinc-400">
                        {isFlipped
                          ? `🔒 Tersegel · token #${entry.tokenId}`
                          : `✓ ${def?.name} · #${entry.tokenId}`}
                      </span>
                      {isSealedUnsealable(entry) && (
                        <button
                          onClick={() => setUnsealPicker(entry.tokenId)}
                          className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-[10px] font-bold uppercase tracking-wider"
                        >
                          Unseal
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Unseal picker — honest note about the MVP contract gap */}
              {unsealPicker !== null && (
                <div className="w-full max-w-2xl bg-zinc-900 border border-purple-800 rounded-2xl p-4 mb-4">
                  <div className="text-xs text-purple-200 font-bold mb-1">Unseal token #{unsealPicker}</div>
                  <p className="text-[11px] text-zinc-400 mb-3">
                    Dalam alur penuh FHEVM, defId berasal dari dekripsi sealed handle melalui sesi dekripsi. Kontrak MVP menerima
                    deklarasi pemilik tanpa verifikasi kriptografis (gap M2-05) — pilih kartu yang kamu nyatakan:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                    {Object.values(OFFICIAL_CARD_CATALOG).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => void handleUnseal(unsealPicker, c.id)}
                        disabled={txState.status === "pending_signature" || txState.status === "submitted"}
                        className="text-left text-[10px] bg-zinc-950 border border-zinc-800 hover:border-purple-500 rounded-lg p-2 disabled:opacity-40"
                      >
                        <div className="font-bold text-zinc-200 truncate">{c.name}</div>
                        <div className="text-zinc-500">
                          {c.rarity} · ⚡{c.cost} · 💪{c.basePower}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setUnsealPicker(null)} className="mt-2 text-[11px] text-zinc-500 underline">
                    Batal
                  </button>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setRitualState("idle")}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition-all border border-zinc-700"
                >
                  Tarik Lagi
                </button>
                <button
                  onClick={() => collection.refresh()}
                  className="px-6 py-2.5 bg-amber-900/60 hover:bg-amber-800/60 text-amber-200 font-bold rounded-xl text-xs transition-all border border-amber-800"
                >
                  Muat Ulang Koleksi ({collection.cards.length})
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="relative z-10 text-[9px] text-zinc-600 text-center mt-6 max-w-xl">{DISCLAIMER}</p>
    </div>
  );
};

function isSealedUnsealable(entry: DrawnCard): boolean {
  return entry.isSealed && entry.tokenId > 0;
}
