"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { CHAIN_ID, CHAIN_NAME } from "./env";

interface Eip1193 extends Eip1193Provider {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
  on?(event: string, handler: (...args: unknown[]) => void): void;
  removeListener?(event: string, handler: (...args: unknown[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: Eip1193;
  }
}

interface WalletValue {
  address?: string;
  chainId?: number;
  connecting: boolean;
  error?: string;
  available: boolean;
  isCorrectChain: boolean;
  provider?: BrowserProvider;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToSepolia: () => Promise<void>;
}

const WalletContext = createContext<WalletValue | null>(null);

const STORAGE_KEY = "veilbound.wallet";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [available, setAvailable] = useState(false);

  const provider = useMemo(
    () => (typeof window !== "undefined" && window.ethereum ? new BrowserProvider(window.ethereum as Eip1193Provider, "any") : undefined),
    [available]
  );

  const refresh = useCallback(async () => {
    const eth = window.ethereum;
    if (!eth) return;
    try {
      const accounts = (await eth.request({ method: "eth_accounts" })) as string[];
      const cid = (await eth.request({ method: "eth_chainId" })) as string;
      setAddress(accounts?.[0]);
      setChainId(Number.parseInt(cid, 16));
      if (accounts?.[0]) localStorage.setItem(STORAGE_KEY, accounts[0]);
    } catch {
      // Wallet locked or refused — keep previous state.
    }
  }, []);

  useEffect(() => {
    const eth = window.ethereum;
    setAvailable(Boolean(eth));
    if (!eth) return;

    void refresh();

    const onAccounts = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setAddress(accounts?.[0]);
      if (!accounts?.[0]) localStorage.removeItem(STORAGE_KEY);
    };
    const onChain = (...args: unknown[]) => {
      const cid = args[0] as string;
      setChainId(Number.parseInt(cid, 16));
    };

    eth.on?.("accountsChanged", onAccounts);
    eth.on?.("chainChanged", onChain);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, [refresh]);

  const connect = useCallback(async () => {
    const eth = window.ethereum;
    if (!eth) {
      setError("Wallet tidak terdeteksi. Pasang MetaMask/Rabby/Coinbase Wallet.");
      return;
    }
    setConnecting(true);
    setError(undefined);
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      const cid = (await eth.request({ method: "eth_chainId" })) as string;
      setAddress(accounts?.[0]);
      setChainId(Number.parseInt(cid, 16));
      localStorage.setItem(STORAGE_KEY, accounts?.[0] ?? "");
    } catch (err) {
      setError((err as Error).message || "Gagal menghubungkan wallet.");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(undefined);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const switchToSepolia = useCallback(async () => {
    const eth = window.ethereum;
    if (!eth) return;
    const hexChain = `0x${CHAIN_ID.toString(16)}`;
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hexChain }] });
    } catch (err) {
      const code = (err as { code?: number }).code;
      if (code === 4902) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexChain,
              chainName: `Ethereum ${CHAIN_NAME}`,
              nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: [process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } else {
        setError((err as Error).message || "Gagal berpindah jaringan.");
      }
    }
  }, []);

  const value: WalletValue = {
    address,
    chainId,
    connecting,
    error,
    available,
    isCorrectChain: chainId === CHAIN_ID,
    provider,
    connect,
    disconnect,
    switchToSepolia,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");
  return ctx;
}
