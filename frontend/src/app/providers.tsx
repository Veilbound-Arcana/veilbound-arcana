"use client";

import React from "react";
import { WalletProvider } from "@/lib/wallet";
import { SessionProvider } from "@/lib/session";

/** Client-side provider tree: wallet first, then the confidential decryption session. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <SessionProvider>{children}</SessionProvider>
    </WalletProvider>
  );
}
