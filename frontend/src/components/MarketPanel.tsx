"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DISCLAIMER } from "@veilbound/sdk";
import { ADDRESSES } from "@/lib/env";
import { getReadProvider, useCollection, useSignerContracts, useTx } from "@/lib/game";
import { useWallet } from "@/lib/wallet";
import { TxStatus } from "./TxStatus";

interface SwapOffer {
  offerId: number;
  initiator: string;
  offeredTokenId: number;
  desiredTokenId: number;
  status: "open" | "accepted" | "cancelled";
}

/** M4-05 (stake ante) + M4-06 (atomic 1-to-1 swap escrow) — real contract wiring. */
export function MarketPanel() {
  const { address } = useWallet();
  const { contracts } = useSignerContracts();
  const getStakeEnabled = useStakeEnabledProbe();
  const collection = useCollection(address);
  const { state: txState, run, reset } = useTx();

  const [offers, setOffers] = useState<SwapOffer[]>([]);
  const [offeredTokenId, setOfferedTokenId] = useState("");
  const [desiredTokenId, setDesiredTokenId] = useState("");
  const [stakeEnabled, setStakeEnabled] = useState<boolean | null>(null);
  const [stakeMatchId, setStakeMatchId] = useState("");
  const [stakeTokenId, setStakeTokenId] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const refreshOffers = useCallback(async () => {
    try {
      const provider = getReadProvider();
      const iface = (await import("@veilbound/sdk")).MARKET_ABI;
      const { Contract } = await import("ethers");
      const market = new Contract(ADDRESSES.market, iface, provider);
      const [created, cancelled, accepted] = await Promise.all([
        market.queryFilter(market.filters.SwapCreated()),
        market.queryFilter(market.filters.SwapCancelled()),
        market.queryFilter(market.filters.SwapAccepted()),
      ]);
      const getOfferId = (log: unknown) => Number((log as { args?: { offerId?: bigint | number } })?.args?.offerId ?? 0);
      const cancelledIds = new Set(cancelled.map((l) => getOfferId(l)));
      const acceptedIds = new Set(accepted.map((l) => getOfferId(l)));
      const list: SwapOffer[] = created.map((log) => {
        const l = log as { args?: { offerId?: bigint | number; initiator?: string; offeredTokenId?: bigint | number; desiredTokenId?: bigint | number } };
        const offerId = Number(l.args?.offerId ?? 0);
        return {
          offerId,
          initiator: String(l.args?.initiator ?? ""),
          offeredTokenId: Number(l.args?.offeredTokenId ?? 0),
          desiredTokenId: Number(l.args?.desiredTokenId ?? 0),
          status: cancelledIds.has(offerId) ? "cancelled" : acceptedIds.has(offerId) ? "accepted" : "open",
        };
      });
      setOffers(list.reverse());
    } catch {
      /* market not deployed yet */
    }
  }, []);

  useEffect(() => {
    void refreshOffers();
    let alive = true;
    (async () => {
      try {
        const enabled = await getStakeEnabled();
        if (alive) setStakeEnabled(enabled);
      } catch {
        if (alive) setStakeEnabled(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refreshOffers, getStakeEnabled]);

  const handleCreateOffer = async () => {
    if (!contracts) return;
    setNote(null);
    const receipt = await run(() => contracts.market.createSwapOffer(Number(offeredTokenId), Number(desiredTokenId)));
    if (receipt) {
      setNote(`Tawaran swap dibuat untuk token #${offeredTokenId} → #${desiredTokenId}.`);
      setOfferedTokenId("");
      setDesiredTokenId("");
      await refreshOffers();
      collection.refresh();
    }
  };

  const handleAccept = async (offerId: number) => {
    if (!contracts) return;
    const receipt = await run(() => contracts.market.acceptSwapOffer(offerId));
    if (receipt) {
      setNote(`Swap offer #${offerId} diterima — pertukaran selesai atomik.`);
      await refreshOffers();
      collection.refresh();
    }
  };

  const handleCancel = async (offerId: number) => {
    if (!contracts) return;
    const receipt = await run(() => contracts.market.cancelSwapOffer(offerId));
    if (receipt) {
      setNote(`Tawaran #${offerId} dibatalkan.`);
      await refreshOffers();
    }
  };

  const handleStake = async () => {
    if (!contracts) return;
    setNote(null);
    const receipt = await run(() => contracts.stakeEscrow.depositStake(Number(stakeMatchId), Number(stakeTokenId)));
    if (receipt) {
      setNote(`Stake token #${stakeTokenId} didepositkan untuk match ${stakeMatchId}.`);
      collection.refresh();
    }
  };

  const openOffers = offers.filter((o) => o.status === "open");

  return (
    <div className="max-w-3xl mx-auto bg-zinc-950 border border-amber-500/20 rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <span className="text-[10px] tracking-widest text-amber-400 uppercase font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
          Marketplace · M4-05 / M4-06
        </span>
        <h2 className="text-2xl font-serif font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
          Pasar NFT: Swap &amp; Stake
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Tukar kartu 1-to-1 secara atomik lewat escrow Market, atau pasang ante 1 NFT via StakeEscrow (beda tier rarity
          maksimal 1 tingkat).
        </p>
      </div>

      <TxStatus state={txState} onReset={reset} />
      {note && <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900 rounded-xl px-4 py-2">{note}</div>}

      {/* Create swap offer */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="text-sm font-bold text-zinc-200 mb-1">Buat Tawaran Swap</div>
        <div className="text-[11px] text-zinc-500 mb-3">Token yang kamu tawarkan harus unsealed &amp; milikmu. ID kartu terlihat di tab Deck Builder / koleksi.</div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            min={1}
            value={offeredTokenId}
            onChange={(e) => setOfferedTokenId(e.target.value)}
            placeholder="Token ID kamu"
            aria-label="Token ID yang ditawarkan"
            className="w-36 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs"
          />
          <span className="text-zinc-500 text-xs">→</span>
          <input
            type="number"
            min={1}
            value={desiredTokenId}
            onChange={(e) => setDesiredTokenId(e.target.value)}
            placeholder="Token ID diinginkan"
            aria-label="Token ID yang diinginkan"
            className="w-36 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs"
          />
          <button
            onClick={() => void handleCreateOffer()}
            disabled={!contracts || !offeredTokenId || !desiredTokenId}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 text-xs font-bold uppercase tracking-wider"
          >
            Tawarkan
          </button>
        </div>
        <div className="mt-3 text-[11px] text-zinc-500">
          Koleksi kamu:{" "}
          {collection.cards.filter((c) => !c.isSealed).map((c) => `#${c.tokenId} (${c.name})`).join(", ") || "belum ada kartu unsealed"}
        </div>
      </div>

      {/* Open offers */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-zinc-200">Tawaran Terbuka ({openOffers.length})</div>
          <button onClick={() => void refreshOffers()} className="text-[11px] text-amber-500 underline">
            Muat ulang
          </button>
        </div>
        {openOffers.length === 0 ? (
          <p className="text-xs text-zinc-500">Belum ada tawaran terbuka.</p>
        ) : (
          <ul className="space-y-2">
            {openOffers.map((o) => {
              const mine = o.initiator.toLowerCase() === address?.toLowerCase();
              return (
                <li key={o.offerId} className="flex items-center justify-between gap-3 text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                  <span className="font-mono text-zinc-300">
                    #{o.offerId} · token #{o.offeredTokenId} → #{o.desiredTokenId}
                    <span className="ml-2 text-zinc-600">oleh {mine ? "kamu" : `${o.initiator.slice(0, 8)}…`}</span>
                  </span>
                  <span className="flex gap-2">
                    {!mine && (
                      <button
                        onClick={() => void handleAccept(o.offerId)}
                        disabled={!contracts}
                        className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-[10px] font-bold uppercase disabled:opacity-40"
                      >
                        Terima
                      </button>
                    )}
                    {mine && (
                      <button
                        onClick={() => void handleCancel(o.offerId)}
                        disabled={!contracts}
                        className="px-3 py-1 rounded-lg bg-red-900 hover:bg-red-800 text-[10px] font-bold uppercase disabled:opacity-40"
                      >
                        Batalkan
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Stake ante */}
      <div className="rounded-2xl border border-purple-900/60 bg-purple-950/20 p-4">
        <div className="text-sm font-bold text-purple-200 mb-1">Ante Stake 1 NFT</div>
        <div className="text-[11px] text-zinc-400 mb-3">
          Status StakeEscrow:{" "}
          {stakeEnabled === null ? "tidak terbaca (kontrak belum di-deploy)" : stakeEnabled ? "aktif" : "dinonaktifkan owner"}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={stakeMatchId}
            onChange={(e) => setStakeMatchId(e.target.value)}
            placeholder="matchId"
            aria-label="matchId"
            className="w-28 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs"
          />
          <input
            type="number"
            value={stakeTokenId}
            onChange={(e) => setStakeTokenId(e.target.value)}
            placeholder="tokenId"
            aria-label="tokenId"
            className="w-28 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs"
          />
          <button
            onClick={() => void handleStake()}
            disabled={!contracts || !stakeMatchId || !stakeTokenId || stakeEnabled === false}
            className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-100 text-xs font-bold uppercase tracking-wider"
          >
            Deposit Stake
          </button>
        </div>
      </div>

      <p className="text-[9px] text-zinc-600 text-center">{DISCLAIMER}</p>
    </div>
  );
}

function useStakeEnabledProbe(): () => Promise<boolean> {
  const { contracts } = useSignerContracts();
  return useCallback(async () => {
    if (contracts) return contracts.stakeEscrow.stakeEnabled();
    const { VeilboundContracts } = await import("@veilbound/sdk");
    return VeilboundContracts.connect(getReadProvider(), ADDRESSES).stakeEscrow.stakeEnabled();
  }, [contracts]);
}
