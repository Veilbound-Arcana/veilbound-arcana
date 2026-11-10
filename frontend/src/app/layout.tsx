import type { Metadata } from "next";
import "./globals.css";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export const metadata: Metadata = {
  title: "Veilbound Arcana — Confidential Tarot TCG",
  description: "Confidential on-chain Tarot card battle game on Zama Protocol Sepolia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col font-sans">
        <DisclaimerBanner />
        <main className="flex-1">{children}</main>
        <footer className="py-6 border-t border-zinc-900 text-center text-xs text-zinc-500">
          Veilbound Arcana · Zama Developer Program Mainnet Season 5 · This project is not audited, endorsed or operated by Zama. Use at your own risk.
        </footer>
      </body>
    </html>
  );
}
