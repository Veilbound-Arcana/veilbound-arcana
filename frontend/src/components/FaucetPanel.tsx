"use client";

import React, { useEffect, useState } from "react";
import { DISCLAIMER, unitsToFate } from "@veilbound/sdk";
import { etherscanAddressUrl } from "@/lib/env";
import { useFateBalance, useSignerContracts, useTx, txStatusLabel } from "@/lib/game";
import { useWallet } from "@/lib/wallet";
import { TxStatus } from "./TxStatus";

function formatCooldown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}j ${m}m ${s}d`;
}

/** FR-11: daily 10 FATE testnet faucet with an honest cooldown countdown. */
export function FaucetPanel() {
  const { address } = useWallet();
  const faucet = useFateBalance(address);
  const { contracts } = useSignerContracts();
  const { state, run, reset } = useTx();
  const [, forceTick] = useState(0);

  // Tick every second while a cooldown is active.
  useEffect(() => {
    if (faucet.cooldownRemaining <= 0) return;
    const t = setInterval(() => forceTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [faucet.cooldownRemaining]);

  const claimable = address && faucet.cooldownRemaining === 0;

  const handleClaim = async () => {
    if (!contracts) return;
    const receipt = await run(() => contracts.fateToken.claimFaucet());
    if (receipt) faucet.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-950 border border-amber-500/20 rounded-3xl p-6 md:p-8">
      <span className="text-[10px] tracking-widest text-amber-400 uppercase font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
        Testnet Faucet · FR-11
      </span>
      <h2 className="text-2xl font-serif font-bold mt-3 mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
        Klaim $FATE Harian
      </h2>
      <p className="text-xs text-zinc-400 mb-6">
        10 $FATE per 24 jam untuk mencoba ritual gacha dan duel di Sepolia. Token testnet ini tidak memiliki nilai moneter.
      </p>

      {!address ? (
        <p className="text-sm text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          Hubungkan wallet terlebih dahulu untuk melihat saldo dan mengklaim faucet.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Saldo $FATE</div>
              <div className="text-2xl font-bold text-amber-300">
                {faucet.loading ? "…" : unitsToFate(faucet.balance).toFixed(2)}
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">dibaca langsung dari FateToken</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Status Cooldown</div>
              <div className={`text-2xl font-bold ${claimable ? "text-emerald-400" : "text-zinc-300"}`}>
                {claimable ? "Siap klaim" : formatCooldown(faucet.cooldownRemaining)}
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">10 FATE / 24 jam</div>
            </div>
          </div>

          {faucet.error && <p className="text-xs text-red-400">{faucet.error}</p>}

          <button
            onClick={() => void handleClaim()}
            disabled={!claimable || !contracts || state.status === "pending_signature" || state.status === "submitted"}
            className="w-full px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 disabled:from-zinc-800 disabled:to-zinc-700 disabled:text-zinc-500 text-zinc-950 font-bold text-sm tracking-wide transition-all"
          >
            {state.status === "pending_signature" || state.status === "submitted"
              ? "Memproses…"
              : claimable
              ? "Klaim 10 $FATE"
              : "Cooldown aktif"}
          </button>

          <TxStatus state={state} onReset={reset} />

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            {DISCLAIMER} Kontrak faucet:{" "}
            <a
              className="text-amber-500 underline"
              href={etherscanAddressUrl(process.env.NEXT_PUBLIC_FATE_TOKEN_ADDRESS || "")}
              target="_blank"
              rel="noopener noreferrer"
            >
              FateToken di Etherscan
            </a>
            . Jika alamat kontrak belum di-deploy, transaksi akan gagal — lihat tab Verifikasi untuk status deploy aktual.
          </p>
        </div>
      )}
    </div>
  );
}
