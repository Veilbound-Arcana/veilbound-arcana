import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CircleDot, Flame } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

export const CurrencyBar: React.FC = () => {
  const navigate = useNavigate();
  const { save } = useGameStore();

  return (
    <div className="w-full px-4 py-2 flex items-center justify-between gap-2 z-20">
      {/* Profile & Level */}
      <button
        onClick={() => navigate("/menu")}
        className="flex items-center gap-2 bg-white/70 hover:bg-white border border-white rounded-full py-1 px-2.5 shadow-sm active:scale-95 transition-all min-h-[44px]"
        aria-label="Profile and level"
      >
        <div className="w-6 h-6 rounded-full bg-violet text-white flex items-center justify-center text-xs font-bold font-display">
          {save.wardenName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-ink leading-tight truncate max-w-[80px]">
            {save.wardenName}
          </span>
          <span className="text-[9px] font-extrabold text-violet leading-none">
            Lv. {save.level}
          </span>
        </div>
      </button>

      {/* Currency Badges */}
      <div className="flex items-center gap-1.5">
        {/* Shards */}
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-1 bg-white/70 hover:bg-white border border-white rounded-full py-1 px-2 shadow-sm active:scale-95 transition-all min-h-[44px]"
          aria-label="Veil Shards"
        >
          <Sparkles size={13} className="text-violet shrink-0" />
          <span className="text-xs font-bold text-ink font-ui tabular-nums">
            {save.currencies.shards}
          </span>
        </button>

        {/* Echoes */}
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-1 bg-white/70 hover:bg-white border border-white rounded-full py-1 px-2 shadow-sm active:scale-95 transition-all min-h-[44px]"
          aria-label="Echoes"
        >
          <CircleDot size={13} className="text-blue-500 shrink-0" />
          <span className="text-xs font-bold text-ink font-ui tabular-nums">
            {save.currencies.echoes}
          </span>
        </button>

        {/* Candles */}
        <button
          onClick={() => navigate("/open/V1")}
          className="flex items-center gap-1 bg-white/70 hover:bg-white border border-white rounded-full py-1 px-2 shadow-sm active:scale-95 transition-all min-h-[44px]"
          aria-label="Vigil Candles"
        >
          <Flame size={13} className="text-amber-500 shrink-0" />
          <span className="text-xs font-bold text-ink font-ui tabular-nums">
            {save.currencies.candles}
          </span>
        </button>
      </div>
    </div>
  );
};
