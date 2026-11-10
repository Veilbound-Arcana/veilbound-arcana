"use client";

import React, { useState } from "react";
import { OFFICIAL_CARD_CATALOG } from "@veilbound/sdk";

export const DeckBuilder: React.FC = () => {
  // Selected card IDs (must be exactly 5, cost <= 12, max 2 duplicates)
  const [selectedCards, setSelectedCards] = useState<number[]>([1, 2, 5, 9, 13]);

  const allCards = Object.values(OFFICIAL_CARD_CATALOG);

  const totalCost = selectedCards.reduce((sum, id) => sum + OFFICIAL_CARD_CATALOG[id].cost, 0);

  const toggleCard = (id: number) => {
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter((c) => c !== id));
    } else {
      if (selectedCards.length < 5) {
        setSelectedCards([...selectedCards, id]);
      }
    }
  };

  const isCostValid = totalCost <= 12;
  const isCountValid = selectedCards.length === 5;

  return (
    <div className="flex flex-col p-8 bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl max-w-4xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-serif text-amber-400">Deck Builder (5 Kartu)</h2>
          <p className="text-xs text-zinc-400">Pilih 5 kartu Unsealed dari koleksi Anda untuk bertarung.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 block uppercase">Jumlah Kartu</span>
            <span className={`text-sm font-bold ${isCountValid ? "text-emerald-400" : "text-amber-400"}`}>
              {selectedCards.length} / 5
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 block uppercase">Total Cost</span>
            <span className={`text-sm font-bold ${isCostValid ? "text-emerald-400" : "text-rose-400"}`}>
              {totalCost} / 12
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Catalog Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-1">
        {allCards.map((card) => {
          const isSelected = selectedCards.includes(card.id);
          return (
            <div
              key={card.id}
              onClick={() => toggleCard(card.id)}
              className={`cursor-pointer p-3 rounded-lg border text-xs transition-all ${
                isSelected
                  ? "bg-amber-500/20 border-amber-500 shadow-md shadow-amber-500/10"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>{card.suit}</span>
                <span className="font-bold text-amber-400">C:{card.cost}</span>
              </div>
              <h5 className="font-serif font-bold text-zinc-200 truncate mb-1">{card.name}</h5>
              <div className="text-[10px] text-zinc-400">Power: {card.basePower}</div>
            </div>
          );
        })}
      </div>

      {/* Lock Deck Button */}
      <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
        <button
          disabled={!isCostValid || !isCountValid}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-zinc-950 font-bold rounded-lg transition-all text-xs"
        >
          Kunci Decklist (On-Chain Lock)
        </button>
      </div>
    </div>
  );
};
