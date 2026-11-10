"use client";

import React, { useState } from "react";
import { GachaRitual3D } from "@/components/GachaRitual3D";
import { DuelArena3D } from "@/components/DuelArena3D";
import { DeckBuilder3D } from "@/components/DeckBuilder3D";
import { VerifyPage } from "@/components/VerifyPage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"gacha" | "deck" | "duel" | "verify">("gacha");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Brand Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-2">
          VEILBOUND ARCANA
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Confidential Tarot Trading Card Game on Zama FHEVM Sepolia. Sealed NFT Gacha spreads & 3-round psychological bluff duels.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-2 mb-8 border-b border-zinc-800 pb-4">
        <button
          onClick={() => setActiveTab("gacha")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "gacha" ? "bg-amber-500 text-zinc-950 shadow-lg" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Ritual Gacha
        </button>
        <button
          onClick={() => setActiveTab("deck")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "deck" ? "bg-amber-500 text-zinc-950 shadow-lg" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Deck Builder
        </button>
        <button
          onClick={() => setActiveTab("duel")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "duel" ? "bg-amber-500 text-zinc-950 shadow-lg" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Duel Arena
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "verify" ? "bg-amber-500 text-zinc-950 shadow-lg" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Verifikasi Kripto
        </button>
      </div>

      {/* Dynamic View */}
      <div>
        {activeTab === "gacha" && <GachaRitual3D />}
        {activeTab === "deck" && <DeckBuilder3D />}
        {activeTab === "duel" && <DuelArena3D />}
        {activeTab === "verify" && <VerifyPage />}
      </div>
    </div>
  );
}
