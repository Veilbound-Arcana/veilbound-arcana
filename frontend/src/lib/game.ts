"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrowserProvider, ContractTransactionReceipt, ContractTransactionResponse, JsonRpcProvider, Signer } from "ethers";
import {
  OFFICIAL_CARD_CATALOG,
  TX_STATUS_LABELS,
  TxStatusLabel,
  VeilboundContracts,
  validateDeck,
  DeckValidation,
} from "@veilbound/sdk";
import { ADDRESSES, DEPLOY_BLOCK, SEPOLIA_RPC_URL } from "./env";
import { useWallet } from "./wallet";

/* ---------------------------------- providers ---------------------------------- */

let sharedReadProvider: JsonRpcProvider | undefined;

export function getReadProvider(): JsonRpcProvider {
  if (!sharedReadProvider) {
    sharedReadProvider = new JsonRpcProvider(SEPOLIA_RPC_URL, 11155111, { staticNetwork: true });
  }
  return sharedReadProvider;
}

/** Read-only contract bundle (works without a wallet). */
export function useReadContracts(): VeilboundContracts {
  return useMemo(() => VeilboundContracts.connect(getReadProvider(), ADDRESSES), []);
}

/** Signer-bound bundle for writes — null until a wallet is connected on Sepolia. */
export function useSignerContracts(): { contracts: VeilboundContracts | null; signer: Signer | null } {
  const { address, provider, isCorrectChain } = useWallet();
  const [signer, setSigner] = useState<Signer | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!address || !provider || !isCorrectChain) {
        if (!cancelled) setSigner(null);
        return;
      }
      try {
        const s = await provider.getSigner();
        if (!cancelled) setSigner(s);
      } catch {
        if (!cancelled) setSigner(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [address, provider, isCorrectChain]);

  const contracts = useMemo(() => (signer ? VeilboundContracts.connectSigner(signer, ADDRESSES) : null), [signer]);
  return { contracts, signer };
}

/* ---------------------------------- tx status ---------------------------------- */

export interface TxState {
  status: TxStatusLabel;
  txHash?: string;
  error?: string;
}

const IDLE: TxState = { status: "idle" };

/** Runs a contract write with honest, human-readable progress (PRD NFR: no blank screens). */
export function useTx() {
  const [state, setState] = useState<TxState>(IDLE);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const reset = useCallback(() => setState(IDLE), []);

  const run = useCallback(async (fn: () => Promise<ContractTransactionResponse>) => {
    try {
      setState({ status: "pending_signature" });
      const tx = await fn();
      if (!mounted.current) return;
      setState({ status: "submitted", txHash: tx.hash });
      const receipt: ContractTransactionReceipt | null = await tx.wait();
      if (!mounted.current) return;
      if (!receipt || receipt.status === 0) throw new Error("Transaksi revert di jaringan Sepolia.");
      setState({ status: "ready", txHash: tx.hash });
      return receipt;
    } catch (err) {
      if (!mounted.current) return;
      const e = err as { code?: number | string; shortMessage?: string; message?: string };
      if (e.code === 4001 || e.code === "ACTION_REJECTED") {
        setState({ status: "idle", error: "Tanda tangan ditolak di wallet." });
        return;
      }
      setState({ status: "error", error: e.shortMessage || e.message || "Transaksi gagal." });
      return undefined;
    }
  }, []);

  return { state, run, reset };
}

export function txStatusLabel(state: TxState): string {
  if (state.error && state.status === "error") return `${TX_STATUS_LABELS.error}: ${state.error}`;
  return TX_STATUS_LABELS[state.status];
}

/* ------------------------------------ faucet ----------------------------------- */

export interface FaucetInfo {
  balance: bigint;
  lastClaim: bigint;
  cooldownRemaining: number; // seconds, 0 = claimable
  loading: boolean;
  error?: string;
  refresh: () => void;
}

const COOLDOWN = 24 * 60 * 60;

export function useFateBalance(address?: string): FaucetInfo {
  const contracts = useReadContracts();
  const [balance, setBalance] = useState<bigint>(0n);
  const [lastClaim, setLastClaim] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!address) {
      setBalance(0n);
      setLastClaim(0n);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    Promise.all([contracts.fateToken.balanceOf(address), contracts.fateToken.lastFaucetClaim(address)])
      .then(([b, l]) => {
        if (!cancelled) {
          setBalance(b);
          setLastClaim(l);
        }
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message || "Gagal membaca saldo $FATE.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [contracts, address, tick]);

  const cooldownRemaining = useMemo(() => {
    const next = Number(lastClaim) + COOLDOWN;
    return lastClaim > 0n ? Math.max(0, next - Math.floor(Date.now() / 1000)) : 0;
  }, [lastClaim, tick]);

  return { balance, lastClaim, cooldownRemaining, loading, error, refresh };
}

/* ---------------------------------- collection --------------------------------- */

export interface OwnedCard {
  tokenId: number;
  defId: number;
  isSealed: boolean;
  name: string;
  suit: string;
  rarity: string;
  cost: number;
  basePower: number;
}

export interface CollectionState {
  cards: OwnedCard[];
  loading: boolean;
  error?: string;
  refresh: () => void;
}

/**
 * Enumerates card NFTs owned by an address via CardDrawn logs (ArcanaCards has
 * no Enumerable) and verifies current ownership with ownerOf.
 */
export function useCollection(address?: string): CollectionState {
  const read = useReadContracts();
  const [cards, setCards] = useState<OwnedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!address) {
      setCards([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    (async () => {
      try {
        const provider = getReadProvider();
        const iface = read.arcanaCards.interface;
        const topics = iface.encodeFilterTopics("CardDrawn", [address]);
        const logs = await provider.getLogs({
          address: ADDRESSES.arcanaCards,
          topics,
          fromBlock: DEPLOY_BLOCK,
          toBlock: "latest",
        });

        const tokenIds = new Set<number>();
        for (const log of logs) {
          const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
          if (parsed) tokenIds.add(Number(parsed.args.tokenId));
        }

        const owned: OwnedCard[] = [];
        for (const tokenId of tokenIds) {
          const [instance, owner] = await Promise.all([
            read.arcanaCards.getCardInstance(tokenId),
            read.arcanaCards.ownerOf(tokenId),
          ]);
          if (owner.toLowerCase() !== address.toLowerCase()) continue; // sold/burned since draw
          const defId = Number(instance.defId);
          const def = OFFICIAL_CARD_CATALOG[defId];
          owned.push({
            tokenId,
            defId,
            isSealed: Boolean(instance.isSealed),
            name: def?.name ?? `Kartu Tersegel #${tokenId}`,
            suit: def?.suit ?? "?",
            rarity: def?.rarity ?? "?",
            cost: def?.cost ?? 0,
            basePower: def?.basePower ?? 0,
          });
        }
        owned.sort((a, b) => a.tokenId - b.tokenId);
        if (!cancelled) setCards(owned);
      } catch (err) {
        if (!cancelled) setError((err as Error).message || "Gagal memuat koleksi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [read, address, tick]);

  return { cards, loading, error, refresh };
}

/* ------------------------------------- deck ------------------------------------ */

const DECK_KEY = "veilbound.deck";

export interface DeckState {
  defIds: number[];
  validation: DeckValidation;
  add: (defId: number) => boolean;
  remove: (index: number) => void;
  clear: () => void;
}

export function useDeck(): DeckState {
  const [defIds, setDefIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DECK_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setDefIds(parsed.filter((v): v is number => typeof v === "number"));
      }
    } catch {
      /* ignore corrupted deck */
    }
  }, []);

  const persist = useCallback((next: number[]) => {
    setDefIds(next);
    localStorage.setItem(DECK_KEY, JSON.stringify(next));
  }, []);

  const add = useCallback(
    (defId: number) => {
      const check = validateDeck([...defIds, defId].slice(0, 20));
      // canAdd semantics: reject when the card would break deck rules
      const wouldExceedSize = defIds.length >= 5;
      const copies = defIds.filter((id) => id === defId).length;
      const cost = defIds.reduce((s, id) => s + (OFFICIAL_CARD_CATALOG[id]?.cost ?? 0), 0) + (OFFICIAL_CARD_CATALOG[defId]?.cost ?? 0);
      if (wouldExceedSize || copies >= 2 || cost > 12 || !OFFICIAL_CARD_CATALOG[defId] || !check) return false;
      persist([...defIds, defId]);
      return true;
    },
    [defIds, persist]
  );

  const remove = useCallback(
    (index: number) => {
      persist(defIds.filter((_, i) => i !== index));
    },
    [defIds, persist]
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { defIds, validation: validateDeck(defIds), add, remove, clear };
}
