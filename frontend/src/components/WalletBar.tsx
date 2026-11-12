"use client";

import React from "react";
import { CHAIN_ID, CHAIN_NAME } from "@/lib/env";
import { useWallet } from "@/lib/wallet";
import { useDecryptionSession } from "@/lib/session";

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** Global wallet + decryption-session bar (FR-01 connect, FR-02 one-signature session). */
export function WalletBar() {
  const { address, chainId, connecting, error, available, isCorrectChain, connect, disconnect, switchToSepolia } = useWallet();
  const { mode, granted, granting, error: sessionError, grantSession } = useDecryptionSession();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 backdrop-blur">
      <div className="flex items-center gap-2 flex-wrap">
        {address ? (
          <>
            <span
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                isCorrectChain ? "bg-emerald-900/60 text-emerald-300 border border-emerald-800" : "bg-red-900/60 text-red-300 border border-red-800"
              }`}
            >
              {isCorrectChain ? CHAIN_NAME : `Jaringan salah (chainId ${chainId})`}
            </span>
            <span className="font-mono text-xs text-zinc-200 bg-zinc-800/80 px-2 py-1 rounded-lg">{shortAddress(address)}</span>
            <button
              onClick={disconnect}
              className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-300 underline"
            >
              Putuskan
            </button>
          </>
        ) : (
          <button
            onClick={() => void connect()}
            disabled={connecting || !available}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all"
          >
            {connecting ? "Menghubungkan…" : available ? "Hubungkan Wallet" : "Wallet tidak terdeteksi"}
          </button>
        )}
        {address && !isCorrectChain && (
          <button
            onClick={() => void switchToSepolia()}
            className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-zinc-100 text-xs font-bold uppercase tracking-wider"
          >
            Pindah ke {CHAIN_NAME}
          </button>
        )}
        {error && <span className="text-[11px] text-red-400">{error}</span>}
      </div>

      {address && isCorrectChain && (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
              granted
                ? "bg-purple-900/50 text-purple-300 border-purple-700"
                : "bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
            title={`Mode: ${granted ? "Sesi Otorisasi EIP-712 Aktif" : "Menunggu Otorisasi"}`}
          >
            {granted ? "Sesi Dekripsi Aktif" : "Sesi Dekripsi Belum Aktif"}
          </span>
          {!granted && (
            <button
              onClick={() => void grantSession()}
              disabled={granting}
              className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:bg-zinc-700 text-zinc-100 text-[11px] font-bold uppercase tracking-wider"
            >
              {granting ? "Menunggu tanda tangan…" : "Buka Sesi (1 tanda tangan)"}
            </button>
          )}
          {sessionError && <span className="text-[11px] text-red-400">{sessionError}</span>}
        </div>
      )}
    </div>
  );
}
