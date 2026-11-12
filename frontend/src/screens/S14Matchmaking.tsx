import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { playChoirSwell } from "@/fx/audio";
import { useGameStore } from "@/store/useGameStore";

export const S14Matchmaking: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = params.get("mode") || "solo";
  const { save } = useGameStore();

  const [seconds, setSeconds] = useState(0);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // Auto find match after 1.8s
    const matchTimer = setTimeout(() => {
      setMatched(true);
      playChoirSwell(save.settings.fxVolume, save.settings.muted);

      setTimeout(() => {
        navigate(`/duel?mode=${mode}`);
      }, 1200);
    }, 1800);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimer);
    };
  }, [mode, navigate, save.settings.fxVolume, save.settings.muted]);

  const formatTimer = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-slate-950 text-white relative select-none overflow-hidden p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between z-20">
        <span className="font-display font-bold text-xs text-amber-300 uppercase tracking-widest">
          {mode.toUpperCase()} RITE
        </span>

        {!matched && (
          <button
            onClick={() => navigate("/battle")}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 active:scale-95"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Center Radar / Wisp-Moth Mascot Arena */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Concentric Pulsing Radar Rings */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-violet/50"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1.6], opacity: [0.8, 0.4, 0] }}
            transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-4 rounded-full border border-amber-400/40"
          />

          {/* Original Wisp-Moth Mascot Emblem */}
          <motion.div
            animate={matched ? { scale: [1, 1.2, 1] } : { y: [-4, 4, -4] }}
            transition={{ duration: matched ? 0.4 : 3, repeat: matched ? 1 : Infinity, ease: "easeInOut" }}
            className="w-28 h-28 rounded-full bg-gradient-to-tr from-violet to-purple-900 border-2 border-amber-300/80 shadow-2xl flex items-center justify-center relative z-10"
          >
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-300 fill-current">
              <path d="M50 25 C45 35 30 38 15 35 C12 50 25 65 42 62 C46 68 44 80 50 85 C56 80 54 68 58 62 C75 65 88 50 85 35 C70 38 55 35 50 25 Z" opacity="0.9" />
              <circle cx="50" cy="22" r="3" fill="#ffffff" />
              <line x1="50" y1="20" x2="45" y2="10" stroke="#f2c14e" strokeWidth="2" />
              <line x1="50" y1="20" x2="55" y2="10" stroke="#f2c14e" strokeWidth="2" />
            </svg>
          </motion.div>
        </div>

        {/* Status Messaging */}
        <div className="mt-8 text-center">
          {matched ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-display font-extrabold text-sm">
                <Sparkles size={16} />
                <span>RIVAL ENCOUNTERED!</span>
              </div>
              <h2 className="font-display font-bold text-xl text-white">Warden Thorne</h2>
              <p className="text-xs text-slate-300 font-mono">Level 6 · Ember Affinity</p>
            </motion.div>
          ) : (
            <>
              <h2 className="font-display font-bold text-base text-white">
                Seeking a Rival Warden...
              </h2>
              <p className="text-xs text-slate-400 font-ui mt-1">
                Listening to echoes across the thin Veil
              </p>
              <div className="mt-4 px-3 py-1 rounded-full bg-white/10 font-mono text-xs text-amber-300 inline-block">
                {formatTimer(seconds)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Guidance */}
      <div className="text-center text-[10px] text-slate-500 font-ui pb-2">
        Wardens, prepare your Spreads for the first clash.
      </div>
    </div>
  );
};
