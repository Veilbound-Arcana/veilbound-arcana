"use client";

import React from "react";
import { TX_STATUS_LABELS } from "@veilbound/sdk";
import { TxState, txStatusLabel } from "@/lib/game";
import { etherscanTxUrl } from "@/lib/env";

/** Honest, non-blank progress indicator for every encrypted/contract action. */
export function TxStatus({ state, onReset }: { state: TxState; onReset?: () => void }) {
  if (state.status === "idle" && !state.error) return null;

  const isError = state.status === "error" || Boolean(state.error && state.status === "idle");
  const done = state.status === "ready";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full text-left text-xs rounded-xl px-4 py-3 border ${
        isError
          ? "bg-red-950/40 border-red-800 text-red-300"
          : done
          ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
          : "bg-zinc-900/80 border-zinc-800 text-zinc-300"
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="flex items-center gap-2">
          {!done && !isError && (
            <span className="inline-block w-3 h-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" aria-hidden />
          )}
          {txStatusLabel(state)}
        </span>
        <span className="flex items-center gap-3">
          {state.txHash && (
            <a
              href={etherscanTxUrl(state.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-amber-400 hover:text-amber-300"
            >
              Lihat di Etherscan
            </a>
          )}
          {(isError || done) && onReset && (
            <button onClick={onReset} className="text-zinc-400 hover:text-zinc-200 underline">
              Tutup
            </button>
          )}
        </span>
      </div>
      {state.txHash && done && <div className="mt-1 break-all text-[10px] opacity-70">{state.txHash}</div>}
      {!done && !isError && (
        <div className="mt-1 text-[10px] opacity-60">{TX_STATUS_LABELS[state.status]}</div>
      )}
    </div>
  );
}
