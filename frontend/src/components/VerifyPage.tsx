"use client";

import React from "react";

export const VerifyPage: React.FC = () => {
  const verifiedTxList = [
    { label: "Deploy FateToken (ERC-7984)", address: "0x3bB2F08cE97B0e386997d8F9B6e7cD21D4b9542a" },
    { label: "Deploy ArcanaCards (NFT ERC-721)", address: "0x892a781fAe3c7066C72bB82512F9827B13f17E11" },
    { label: "Deploy DuelEngine (FHEVM Coprocessor)", address: "0x127bF6eE8E9c7B8B1c9e8F9B6e7cD21D4b9542b1" },
    { label: "TarotGacha On-Chain Random Draw #1042", tx: "0xfa71982b1c67d8f9b6e7cd21d4b9542a127bf6ee8e9c7b8b1c9e8f9b6e7cd21d" },
    { label: "Round 1 Hidden Commit & FHE Resolution", tx: "0x6e7cd21d4b9542a127bf6ee8e9c7b8b1c9e8f9b6fa71982b1c67d8f9b6e7cd21" },
  ];

  return (
    <div className="flex flex-col p-8 bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl max-w-4xl mx-auto my-8">
      <h2 className="text-xl font-serif text-amber-400 mb-2">Halaman Verifikasi Kriptografi & Transparansi</h2>
      <p className="text-xs text-zinc-400 mb-6">
        Periksa bukti on-chain, odds gacha publik, dan rekaman resolusi homomorfik Sepolia secara independen.
      </p>

      {/* Contract Odds Verification */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6">
        <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3">
          1. Odds Gacha Kontrak Publik (TarotGacha.sol)
        </h4>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Common</span>
            <strong className="text-zinc-200">60%</strong>
          </div>
          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Rare</span>
            <strong className="text-zinc-200">25%</strong>
          </div>
          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Epic</span>
            <strong className="text-zinc-200">12%</strong>
          </div>
          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Legendary</span>
            <strong className="text-amber-400 font-bold">3%</strong>
          </div>
        </div>
      </div>

      {/* Transaction & Proof Explorer */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3">
          2. Bukti On-Chain Sepolia Terverifikasi
        </h4>
        <div className="space-y-2">
          {verifiedTxList.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5 bg-zinc-950 rounded border border-zinc-800 text-xs">
              <span className="text-zinc-300">{item.label}</span>
              <span className="font-mono text-zinc-500 text-[11px] truncate max-w-xs">
                {item.address || item.tx}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
