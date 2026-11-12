"use client";

import React, { useEffect } from "react";
import { MatchMode } from "@veilbound/sdk";
import { useLobby } from "@/lib/lobby";
import { useWallet } from "@/lib/wallet";
import { etherscanAddressUrl } from "@/lib/env";

const STATUS_LABEL: Record<string, string> = {
  idle: "Belum terhubung",
  connecting: "Menghubungkan…",
  open: "Terhubung ke lobby",
  closed: "Terputus — mencoba menyambung ulang…",
};

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** Lobby: room list, friendly/stake matchmaking, and the FR-20 practice bot. */
export function LobbyPanel({ onEnterDuel }: { onEnterDuel?: () => void }) {
  const { address } = useWallet();
  const lobby = useLobby(address);
  const { state, listRooms, createRoom, joinRoom, practiceChallenge, clearError } = lobby;

  useEffect(() => {
    if (state.status === "open") listRooms();
    // Only re-run on connection transitions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const busy = state.status === "connecting";

  return (
    <div className="max-w-3xl mx-auto bg-zinc-950 border border-amber-500/20 rounded-3xl p-6 md:p-8">
      <span className="text-[10px] tracking-widest text-amber-400 uppercase font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
        WebSocket Lobby · M3-07
      </span>
      <h2 className="text-2xl font-serif font-bold mt-3 mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
        Ruang Duel
      </h2>
      <p className="text-xs text-zinc-400 mb-5">
        Tantang Practice Bot secara solo, atau buka ruang friendly/stake untuk lawan pemain lain (resolusi ronde on-chain via indexer).
      </p>

      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-5">
        <span
          className={`w-2 h-2 rounded-full ${
            state.status === "open" ? "bg-emerald-400" : state.status === "connecting" ? "bg-amber-400 animate-pulse" : "bg-red-500"
          }`}
          aria-hidden
        />
        {STATUS_LABEL[state.status]}
        {state.botAddress && (
          <span className="text-zinc-600">· bot: {shortAddress(state.botAddress)}</span>
        )}
      </div>

      {!address ? (
        <p className="text-sm text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-xl p-4">Hubungkan wallet untuk masuk lobby.</p>
      ) : (
        <div className="space-y-5">
          {state.error && (
            <div role="alert" className="text-xs text-red-300 bg-red-950/40 border border-red-900 rounded-xl px-4 py-3 flex justify-between gap-3">
              <span>{state.error}</span>
              <button onClick={clearError} className="underline text-red-400">Tutup</button>
            </div>
          )}

          {/* Practice bot — the headline solo mode */}
          <div className="rounded-2xl border border-purple-700/50 bg-purple-950/20 p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="text-sm font-bold text-purple-200">Practice Match (FR-20)</div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  3 ronde blind commit vs bot. Deck kamu yang dipakai — kunci deck dulu di tab Deck Builder.
                </div>
              </div>
              <button
                onClick={() => {
                  practiceChallenge();
                  onEnterDuel?.();
                }}
                disabled={state.status !== "open" || busy}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-100 text-xs font-bold uppercase tracking-wider"
              >
                Mulai Practice Match
              </button>
            </div>
          </div>

          {/* Create room */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-sm font-bold text-zinc-200 mb-1">Buat Ruang</div>
            <div className="text-[11px] text-zinc-500 mb-3">
              Friendly (tanpa taruhan) atau Stake (ante 1 NFT — butuh persetujuan StakeEscrow). Lawan bergabung lewat daftar ruang.
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["friendly", "stake"] as MatchMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => createRoom(mode)}
                  disabled={state.status !== "open"}
                  className="px-4 py-2 rounded-xl border border-zinc-700 hover:border-amber-500 hover:text-amber-300 text-xs font-bold uppercase tracking-wider text-zinc-300 disabled:opacity-40"
                >
                  {mode === "friendly" ? "Friendly Room" : "Stake Room"}
                </button>
              ))}
            </div>
          </div>

          {/* Room list */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-zinc-200">Daftar Ruang ({state.rooms.length})</div>
              <button onClick={listRooms} disabled={state.status !== "open"} className="text-[11px] text-amber-500 underline disabled:opacity-40">
                Muat ulang
              </button>
            </div>
            {state.rooms.length === 0 ? (
              <p className="text-xs text-zinc-500">Belum ada ruang terbuka.</p>
            ) : (
              <ul className="space-y-2">
                {state.rooms.map((room) => (
                  <li key={room.roomId} className="flex items-center justify-between gap-3 text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                    <span className="font-mono text-zinc-300">
                      {room.roomId}
                      <span className="ml-2 text-zinc-500 uppercase tracking-wider text-[10px]">{room.mode}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-zinc-500">{room.state}</span>
                      {room.state === "waiting" && room.host?.toLowerCase() !== address.toLowerCase() && (
                        <button
                          onClick={() => joinRoom(room.roomId)}
                          className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-[10px] uppercase"
                        >
                          Gabung
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Current room */}
          {state.room && (
            <div className="rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4 text-xs space-y-2">
              <div className="font-bold text-amber-200">Ruang aktif: {state.room.roomId}</div>
              <div className="text-zinc-400">
                Host: {state.room.host ? shortAddress(state.room.host) : "—"} · Tamu:{" "}
                {state.room.guest ? shortAddress(state.room.guest) : "—"} · Skor{" "}
                <strong className="text-zinc-200">
                  {state.room.scoreA}–{state.room.scoreB}
                </strong>{" "}
                · Ronde {state.room.round}
              </div>
              {state.botAddress && (
                <div className="text-zinc-500">
                  Practice bot:{" "}
                  <a className="text-amber-500 underline" href={etherscanAddressUrl(state.botAddress)} target="_blank" rel="noopener noreferrer">
                    {shortAddress(state.botAddress)}
                  </a>
                </div>
              )}
              <button onClick={lobby.leaveRoom} className="text-red-400 underline">
                Keluar dari ruang
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
