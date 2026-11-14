"use client";

import React, { useEffect, useState } from "react";

/**
 * The whole game reads its save from localStorage through the persisted
 * zustand store. Gating the tree on mount keeps the server-rendered markup and
 * the first client render identical, so hydration never mismatches.
 */
export const Boot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center bg-slate-950">
        <span className="font-display text-[10px] tracking-[0.3em] text-amber-200/40 uppercase">
          Veilbound
        </span>
      </div>
    );
  }

  return <>{children}</>;
};

export default Boot;
