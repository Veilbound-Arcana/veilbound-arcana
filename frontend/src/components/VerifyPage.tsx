"use client";

import React, { useEffect, useState } from "react";
import { GACHA_THRESHOLDS, DISCLAIMER } from "@veilbound/sdk";
import { ADDRESSES, CHAIN_ID, etherscanAddressUrl } from "@/lib/env";
import { getReadProvider } from "@/lib/game";
import { useLobby } from "@/lib/lobby";
import { useWallet } from "@/lib/wallet";

interface ContractStatus {
  address: string;
  deployed: boolean;
  checking: boolean;
}

const CONTRACT_LABELS: { key: keyof typeof ADDRESSES; label: string }[] = [
  { key: "fateToken", label: "FateToken ($FATE, faucet harian)" },
  { key: "cardCatalog", label: "CardCatalog (registry 20 kartu)" },
  { key: "arcanaCards", label: "ArcanaCards (ERC-721 sealed/unsealed)" },
  { key: "tarotGacha", label: "TarotGacha (spread & pity terenkripsi)" },
  { key: "duelEngine", label: "DuelEngine (commit/reveal 3 ronde)" },
  { key: "stakeEscrow", label: "StakeEscrow (ante 1 NFT)" },
  { key: "market", label: "Market (escrow swap 1-to-1)" },
];

/**
 * Honest verification page: every address comes from env, live contract code is
 * checked against Sepolia, and known implementation gaps are listed explicitly.
 */
export const VerifyPage: React.FC = () => {
  const { address } = useWallet();
  const lobby = useLobby(address);
  const [statuses, setStatuses] = useState<Record<string, ContractStatus>>({});
  const [chainOdds, setChainOdds] = useState<{ common: number; rare: number; epic: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const provider = getReadProvider();

    (async () => {
      for (const { key } of CONTRACT_LABELS) {
        const addr = ADDRESSES[key];
        setStatuses((prev) => ({ ...prev, [key]: { address: addr, deployed: false, checking: true } }));
        try {
          const code = await provider.getCode(addr);
          if (!cancelled) {
            setStatuses((prev) => ({
              ...prev,
              [key]: { address: addr, deployed: code !== "0x", checking: false },
            }));
          }
        } catch {
          if (!cancelled) {
            setStatuses((prev) => ({ ...prev, [key]: { address: addr, deployed: false, checking: false } }));
          }
        }
      }

      // Read published odds straight from the TarotGacha contract when it exists.
      try {
        const { VeilboundContracts } = await import("@veilbound/sdk");
        const gacha = VeilboundContracts.connect(provider, ADDRESSES).tarotGacha;
        const [c, r, e] = await Promise.all([gacha.contract.THRESHOLD_COMMON(), gacha.contract.THRESHOLD_RARE(), gacha.contract.THRESHOLD_EPIC()]);
        if (!cancelled) setChainOdds({ common: Number(c), rare: Number(r), epic: Number(e) });
      } catch {
        /* not deployed — source values shown instead */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const allDeployed = CONTRACT_LABELS.every(({ key }) => statuses[key]?.deployed);

  return (
    <div className="flex flex-col p-8 bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl max-w-4xl mx-auto my-8">
      <h2 className="text-xl font-serif text-amber-400 mb-1">Halaman Verifikasi &amp; Transparansi</h2>
      <p className="text-xs text-zinc-400 mb-5">
        Semua alamat diambil dari environment (NEXT_PUBLIC_*). Kode kontrak diperiksa langsung ke Sepolia RPC — tidak ada
        transaksi atau alamat yang dikarang. Tanpa bukti tx hash, klaim live tidak pernah ditampilkan di sini.
      </p>

      {/* 1. Live contract code check */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6">
        <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3">1. Status Deploy Kontrak (getCode via Sepolia RPC)</h4>
        <div className="space-y-2">
          {CONTRACT_LABELS.map(({ key, label }) => {
            const status = statuses[key];
            return (
              <div key={key} className="flex flex-wrap justify-between items-center gap-2 p-2.5 bg-zinc-950 rounded border border-zinc-800 text-xs">
                <span className="text-zinc-300">{label}</span>
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      status?.checking
                        ? "bg-zinc-800 text-zinc-400"
                        : status?.deployed
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                        : "bg-red-950 text-red-400 border border-red-900"
                    }`}
                  >
                    {status?.checking ? "memeriksa…" : status?.deployed ? "kontrak aktif" : "belum di-deploy"}
                  </span>
                  <a
                    href={etherscanAddressUrl(status?.address ?? ADDRESSES[key])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-zinc-500 text-[11px] truncate max-w-[10rem] hover:text-amber-500 underline"
                  >
                    {(status?.address ?? ADDRESSES[key]).slice(0, 10)}…
                  </a>
                </span>
              </div>
            );
          })}
        </div>
        {!allDeployed && (
          <p className="text-[11px] text-amber-400 mt-3">
            Sebagian kontrak belum ada di jaringan ini. Deployment &amp; tx hash dicatat di <code className="text-amber-300">docs/evidence-pack.md</code>{" "}
            setelah jalur deploy dijalankan — sesuai aturan kejujuran: tanpa tx hash = tanpa klaim live.
          </p>
        )}
      </div>

      {/* 2. Odds verification */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6">
        <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3">2. Odds Gacha (dibaca dari kontrak bila tersedia)</h4>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Common (0…{chainOdds?.common ?? GACHA_THRESHOLDS.common})</span>
            <strong className="text-zinc-200">{chainOdds ? `${Math.round(((chainOdds.common + 1) / 256) * 100)}%` : "60%"}</strong>
          </div>
          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Rare (…{chainOdds?.rare ?? GACHA_THRESHOLDS.rare})</span>
            <strong className="text-zinc-200">{chainOdds ? `${Math.round(((chainOdds.rare - chainOdds.common) / 256) * 100)}%` : "25%"}</strong>
          </div>
          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Epic (…{chainOdds?.epic ?? GACHA_THRESHOLDS.epic})</span>
            <strong className="text-zinc-200">{chainOdds ? `${Math.round(((chainOdds.epic - chainOdds.rare) / 256) * 100)}%` : "12%"}</strong>
          </div>
          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Legendary (sisanya)</span>
            <strong className="text-amber-400 font-bold">{chainOdds ? `${Math.round(((255 - chainOdds.epic) / 256) * 100)}%` : "3%"}</strong>
          </div>
        </div>
        <p className="text-[10px] text-zinc-500 mt-2">
          {chainOdds
            ? `Nilai threshold THRESHOLD_COMMON/RARE/EPIC dibaca langsung dari TarotGacha di chainId ${CHAIN_ID}.`
            : "Kontrak belum terdeteksi — nilai di atas berasal dari sumber kontrak di repo (contracts/gacha/TarotGacha.sol)."}
        </p>
      </div>

      {/* 3. Live indexer feed */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6">
        <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3">3. Feed Event Chain (indexer WebSocket)</h4>
        {lobby.state.chainEvents.length === 0 ? (
          <p className="text-xs text-zinc-500">
            Belum ada event diterima. Event on-chain (CardDrawn, SpreadDrawn, RoundResolved, …) akan muncul di sini secara
            live ketika backend indexer menangkapnya dari blok Sepolia.
          </p>
        ) : (
          <ul className="space-y-1.5 max-h-48 overflow-y-auto">
            {lobby.state.chainEvents.map((ev, idx) => (
              <li key={`${ev.txHash}-${idx}`} className="flex justify-between gap-3 text-[11px] bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5">
                <span className="text-amber-300 font-bold">{ev.name}</span>
                <span className="text-zinc-500">block {ev.blockNumber}</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${ev.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-zinc-500 hover:text-amber-500 truncate max-w-[9rem] underline"
                >
                  {ev.txHash.slice(0, 14)}…
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 4. Known gaps — honesty */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-red-900/60">
        <h4 className="text-xs uppercase tracking-wider text-red-400 font-bold mb-3">4. Batas Implementasi yang Diketahui (jujur)</h4>
        <ul className="text-[11px] text-zinc-400 space-y-1.5 list-disc pl-4">
          <li>
            <strong className="text-zinc-200">Unseal tanpa verifikasi kriptografis (gap M2-05):</strong> kontrak MVP menerima
            <code className="text-amber-300"> unseal(tokenId, defId) </code> dari pemilik tanpa membuktikan defId berasal dari
            dekripsi sealed handle.
          </li>
          <li>
            <strong className="text-zinc-200">Randomness gacha:</strong> memakai block entropy (prevrandao/timestamp) sebagai
            pengganti coprocessor FHE sampai integrasi coprocessor penuh aktif.
          </li>
          <li>
            <strong className="text-zinc-200">Saldo FateToken MVP bersifat plaintext view</strong> (mock ERC-7984) — bukan
            balance terenkripsi penuh.
          </li>
          <li>
            <strong className="text-zinc-200">Practice Bot menghitung ronde di server</strong> memakai formula SDK yang sama
            dengan kontrak (practice mode), bukan transaksi DuelEngine on-chain.
          </li>
          <li>
            <strong className="text-zinc-200">Belum ada tx hash deploy</strong> yang tercatat di repo saat halaman ini dibuat;
            oleh karena itu tidak ada klaim live di sini.
          </li>
        </ul>
      </div>

      <p className="text-[9px] text-zinc-600 text-center mt-6">{DISCLAIMER}</p>
    </div>
  );
};
