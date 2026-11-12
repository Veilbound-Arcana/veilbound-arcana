"use client";

import React, { useState } from "react";
import { GachaRitual3D } from "@/components/GachaRitual3D";
import { DuelArena3D } from "@/components/DuelArena3D";
import { DeckBuilder3D } from "@/components/DeckBuilder3D";
import { VerifyPage } from "@/components/VerifyPage";
import { FaucetPanel } from "@/components/FaucetPanel";
import { LobbyPanel } from "@/components/LobbyPanel";
import { MarketPanel } from "@/components/MarketPanel";
import { WalletBar } from "@/components/WalletBar";

type Tab = "faucet" | "gacha" | "deck" | "lobby" | "duel" | "market" | "verify";

const TABS: { id: Tab; label: string }[] = [
  { id: "faucet", label: "Faucet" },
  { id: "gacha", label: "Ritual Gacha" },
  { id: "deck", label: "Deck Builder" },
  { id: "lobby", label: "Lobby" },
  { id: "duel", label: "Duel Arena" },
  { id: "market", label: "Market" },
  { id: "verify", label: "Verifikasi" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("faucet");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Brand Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-2">
          VEILBOUND ARCANA
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Confidential Tarot Trading Card Game on FHEVM Sepolia. Sealed NFT Gacha spreads &amp; 3-round psychological
          bluff duels.
        </p>
      </div>

      <WalletBar />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-zinc-800 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? "page" : undefined}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id ? "bg-amber-500 text-zinc-950 shadow-lg" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic View */}
      <div>
        {activeTab === "faucet" && <FaucetPanel />}
        {activeTab === "gacha" && <GachaRitual3D />}
        {activeTab === "deck" && <DeckBuilder3D />}
        {activeTab === "lobby" && <LobbyPanel onEnterDuel={() => setActiveTab("duel")} />}
        {activeTab === "duel" && <DuelArena3D />}
        {activeTab === "market" && <MarketPanel />}
        {activeTab === "verify" && <VerifyPage />}
      </div>
    </div>
  );
}
