import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Boot } from "@/components/Boot";
import "@/styles/tokens.css";

export const metadata: Metadata = {
  title: "Veilbound Arcana",
  description:
    "Veilbound Arcana — an original confidential tarot card battle game. Bind Veilborn characters into Arcana cards and duel across the Veil.",
  applicationName: "Veilbound Arcana",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-900 text-slate-800 antialiased select-none font-ui">
        <Suspense
          fallback={
            <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
              <span className="font-display text-[10px] tracking-[0.3em] text-amber-200/40 uppercase">
                Veilbound
              </span>
            </div>
          }
        >
          <PhoneFrame>
            <Boot>{children}</Boot>
          </PhoneFrame>
        </Suspense>
      </body>
    </html>
  );
}
