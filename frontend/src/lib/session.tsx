"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ADDRESSES } from "./env";
import { useWallet } from "./wallet";

export type SessionMode = "idle" | "active";

export interface SessionValue {
  mode: SessionMode;
  /** true when one signature has opened the decryption session (FR-02). */
  granted: boolean;
  hasPermit?: boolean;
  granting: boolean;
  error?: string;
  grantSession: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

const SESSION_STORAGE_KEY = "veilbound.decryption-session";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { address } = useWallet();
  const [granted, setGranted] = useState(false);
  const [granting, setGranting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Restore existing session from storage if valid and not expired.
  useEffect(() => {
    if (!address) {
      setGranted(false);
      return;
    }
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { address?: string; expiry?: number };
        if (
          parsed.address?.toLowerCase() === address.toLowerCase() &&
          (parsed.expiry ?? 0) > Math.floor(Date.now() / 1000)
        ) {
          setGranted(true);
          return;
        }
      }
    } catch {
      /* Corrupted entry — ignore */
    }
    setGranted(false);
  }, [address]);

  const grantSession = useCallback(async () => {
    setGranting(true);
    setError(undefined);
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("Wallet provider tidak terdeteksi di browser.");
      }
      if (!address) {
        throw new Error("Hubungkan wallet terlebih dahulu.");
      }
      const { BrowserProvider } = await import("ethers");
      const { createDecryptionSession } = await import("@veilbound/sdk");
      const provider = new BrowserProvider(window.ethereum as never, "any");
      const signer = await provider.getSigner();
      const session = await createDecryptionSession(signer, ADDRESSES.fateToken);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      setGranted(true);
    } catch (err) {
      setError((err as Error).message || "Gagal membuka sesi dekripsi rahasia.");
    } finally {
      setGranting(false);
    }
  }, [address]);

  const mode: SessionMode = granted ? "active" : "idle";

  const value = useMemo<SessionValue>(
    () => ({
      mode,
      granted,
      hasPermit: granted,
      granting,
      error,
      grantSession,
    }),
    [mode, granted, granting, error, grantSession]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useDecryptionSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useDecryptionSession must be used inside <SessionProvider>");
  return ctx;
}
