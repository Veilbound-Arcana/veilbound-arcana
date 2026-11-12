"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TarotCard3D, CardData } from "./TarotCard3D";
import { DISCLAIMER, OFFICIAL_CARD_CATALOG, filterCards } from "@veilbound/sdk";
import { useCollection, useDeck } from "@/lib/game";
import { useLobby } from "@/lib/lobby";
import { useWallet } from "@/lib/wallet";

type SuitFilter = "ALL" | "WANDS" | "CUPS" | "SWORDS" | "PENTACLES" | "MAJOR";
type RarityFilter = "ALL" | "Common" | "Rare" | "Epic" | "Legendary";

export const DeckBuilder3D: React.FC = () => {
  const { address } = useWallet();
  const deck = useDeck();
  const collection = useCollection(address);
  const lobby = useLobby(address);

  const [suitFilter, setSuitFilter] = useState<SuitFilter>("ALL");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("ALL");
  const [search, setSearch] = useState("");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockNote, setLockNote] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map: Record<number, number> = {};
    deck.defIds.forEach((id) => {
      map[id] = (map[id] || 0) + 1;
    });
    return map;
  }, [deck.defIds]);

  // Ownership sets from on-chain CardDrawn enumeration
  const ownedDefIds = useMemo(() => {
    const sealed = new Set<number>();
    const unsealed = new Set<number>();
    for (const c of collection.cards) {
      if (c.isSealed) sealed.add(c.defId);
      else if (c.defId > 0) unsealed.add(c.defId);
    }
    return { sealed, unsealed };
  }, [collection.cards]);

  const filteredCards = useMemo(() => {
    const suitMap: Record<string, "Wands" | "Cups" | "Swords" | "Pentacles"> = {
      WANDS: "Wands",
      CUPS: "Cups",
      SWORDS: "Swords",
      PENTACLES: "Pentacles",
    };
    const cards = filterCards({
      suit: suitMap[suitFilter],
      arcana: suitFilter === "MAJOR" ? "Major" : undefined,
      rarity: rarityFilter === "ALL" ? undefined : (rarityFilter as never),
      search: search || undefined,
    });
    if (!ownedOnly || !address) return cards;
    return cards.filter((c) => ownedDefIds.unsealed.has(c.id));
  }, [suitFilter, rarityFilter, search, ownedOnly, address, ownedDefIds]);

  const { valid, totalCost, error } = deck.validation;

  const handleAddToDeck = (id: number) => {
    if (isLocked) return;
    deck.add(id);
  };

  const handleRemoveFromDeck = (index: number) => {
    if (isLocked) return;
    deck.remove(index);
  };

  const handleLockDeck = () => {
    if (!valid) return;
    if (address && lobby.state.status === "open" && lobby.state.room) {
      lobby.lockDeck(deck.defIds);
      setLockNote(`Deck (${deck.defIds.join(", ")}) dikirim ke ruang ${lobby.state.room.roomId} via WebSocket.`);
    } else if (address && lobby.state.status === "open") {
      lobby.lockDeck(deck.defIds);
      setLockNote("Decklist dikirim ke lobby server (akan dipakai saat match dimulai).");
    } else {
      setLockNote("Terkunci lokal — buka tab Lobby untuk mengirim decklist ke server match.");
    }
    setIsLocked(true);
  };

  return (
    <div className="flex flex-col p-6 md:p-8 bg-zinc-950 text-zinc-100 rounded-3xl border border-amber-500/20 shadow-2xl max-w-5xl mx-auto my-6 overflow-hidden">
      {/* Header & Constraint Meters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-amber-400 uppercase font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full inline-block mb-1">
            Deck Construction Engine
          </span>
          <h2 className="text-2xl font-serif font-bold text-amber-400">Altar Deck 5 Kartu (3D Altar)</h2>
          <p className="text-xs text-zinc-400">
            Pilih 5 kartu. Total cost maksimal 12, maksimal 2 duplikat per kartu. Deck disimpan lokal di browser ini.
          </p>
          {error && <p className="text-[11px] text-amber-400 mt-1">{error}</p>}
        </div>

        <div className="flex items-center gap-6 bg-zinc-900/80 px-6 py-3 rounded-2xl border border-zinc-800">
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Total Cost</span>
            <span className={`text-xl font-serif font-bold ${totalCost <= 12 ? "text-emerald-400" : "text-rose-400"}`}>
              {totalCost} / 12
            </span>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Kartu Terisi</span>
            <span className={`text-xl font-serif font-bold ${deck.defIds.length === 5 ? "text-emerald-400" : "text-amber-400"}`}>
              {deck.defIds.length} / 5
            </span>
          </div>
        </div>
      </div>

      {/* 5 3D PEDESTAL SLOTS (Active Deck) */}
      <div className="my-6">
        <span className="text-xs text-zinc-400 font-serif mb-3 block">Kartu Terpasang di Altar (klik untuk mencopot):</span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 justify-items-center bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 min-h-[260px] items-center">
          {[0, 1, 2, 3, 4].map((slotIdx) => {
            const cardId = deck.defIds[slotIdx];
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
                    <TarotCard3D card={card} size="sm" isFlipped={false} interactive={!isLocked} />
                  </motion.div>
                ) : (
                  <div className="w-36 h-56 rounded-2xl border-2 border-dashed border-zinc-700/80 bg-zinc-950/60 flex flex-col items-center justify-center text-zinc-600 gap-2 hover:border-amber-500/40 transition-colors">
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

      {/* Filters + Lock */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["ALL", "WANDS", "CUPS", "SWORDS", "PENTACLES", "MAJOR"] as SuitFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setSuitFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                suitFilter === filter ? "bg-amber-500 text-zinc-950 shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {filter}
            </button>
          ))}
          <span className="w-px h-5 bg-zinc-800 mx-1" aria-hidden />
          {(["ALL", "Common", "Rare", "Epic", "Legendary"] as RarityFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setRarityFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                rarityFilter === r ? "bg-purple-600 text-zinc-100 shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <button
          onClick={handleLockDeck}
          disabled={!valid || isLocked}
          className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
        >
          {isLocked ? "✓ Decklist Terkunci" : "Kunci Decklist"}
        </button>
      </div>

      {lockNote && (
        <div className="mb-4 text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900 rounded-xl px-4 py-2">{lockNote}</div>
      )}

      {/* Search + ownership */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama kartu…"
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-600 w-56"
          aria-label="Cari kartu"
        />
        <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            checked={ownedOnly}
            onChange={(e) => setOwnedOnly(e.target.checked)}
            disabled={!address}
            className="accent-amber-500"
          />
          {address ? "Hanya kartu unsealed milik saya" : "Hubungkan wallet untuk filter kepemilikan"}
        </label>
        {collection.loading && <span className="text-[11px] text-zinc-500">Memuat koleksi on-chain…</span>}
        {collection.error && <span className="text-[11px] text-red-400">{collection.error}</span>}
        <span className="text-[11px] text-zinc-500 ml-auto">
          Koleksi on-chain: {collection.cards.length} NFT ({collection.cards.filter((c) => c.isSealed).length} masih tersegel)
        </span>
      </div>

      {/* 3D Binder / Collection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[380px] overflow-y-auto p-2 bg-zinc-900/30 rounded-2xl border border-zinc-800/60">
        {filteredCards.map((card) => {
          const inDeckCount = counts[card.id] || 0;
          const canAdd = deck.defIds.length < 5 && inDeckCount < 2 && totalCost + card.cost <= 12;
          const owned = ownedDefIds.unsealed.has(card.id);
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -4 }}
              onClick={() => handleAddToDeck(card.id)}
              className={`relative flex flex-col items-center ${!canAdd || isLocked ? "opacity-40" : "cursor-pointer"}`}
              title={canAdd ? `Tambah ${card.name}` : "Tidak memenuhi aturan deck"}
            >
              <TarotCard3D card={card as CardData} size="sm" isFlipped={false} interactive={canAdd && !isLocked} />
              {inDeckCount > 0 && (
                <div className="absolute top-2 right-2 bg-amber-500 text-zinc-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md z-30">
                  {inDeckCount}x
                </div>
              )}
              {owned && (
                <div className="absolute top-2 left-2 bg-emerald-700 text-emerald-100 font-bold text-[9px] px-2 py-0.5 rounded-full z-30">
                  milik
                </div>
              )}
            </motion.div>
          );
        })}
        {filteredCards.length === 0 && (
          <p className="col-span-full text-center text-xs text-zinc-500 py-8">Tidak ada kartu yang cocok dengan filter.</p>
        )}
      </div>

      <p className="text-[9px] text-zinc-600 text-center mt-6">{DISCLAIMER}</p>
    </div>
  );
};
