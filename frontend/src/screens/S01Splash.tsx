import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/useGameStore";
import { useI18n } from "@/i18n/i18n";

export const S01Splash: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const tutorialDone = useGameStore((s) => s.save.tutorialDone);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (!tutorialDone) {
              navigate("/tutorial");
            } else {
              navigate("/");
            }
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [navigate, tutorialDone]);

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-between p-8 bg-cool-mist relative overflow-hidden">
      {/* Concentric Mystic Arena Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[340px] h-[340px] rounded-full border border-violet animate-pulse" />
        <div className="w-[240px] h-[240px] rounded-full border border-violet/70 absolute" />
        <div className="w-[140px] h-[140px] rounded-full border border-violet/50 absolute" />
      </div>

      <div className="w-full flex justify-end">
        <span className="text-[10px] text-ink-3 tracking-widest uppercase font-mono">
          PWA v1.0
        </span>
      </div>

      {/* Mascot: Original Wisp-Moth Emblem */}
      <div className="flex flex-col items-center z-10">
        <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Concentric ambient halo */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#7B5CF0" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
            <circle cx="50" cy="50" r="32" fill="#7B5CF0" fillOpacity="0.1" />

            {/* Wisp-Moth Wings */}
            <path
              d="M50 48 C30 20 5 35 15 65 C25 80 45 60 50 52 C55 60 75 80 85 65 C95 35 70 20 50 48 Z"
              fill="url(#mothGrad)"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Moth Antennae & Eye */}
            <path d="M48 40 Q40 25 35 22 M52 40 Q60 25 65 22" stroke="#F2C14E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="46" r="3" fill="#F2C14E" />

            <defs>
              <linearGradient id="mothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B5CF0" />
                <stop offset="50%" stopColor="#5DD6C8" />
                <stop offset="100%" stopColor="#3B9DF2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Wordmark in Cinzel with Thin Vertical Slit of Light (the Veil) */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-display font-extrabold text-xl md:text-2xl text-ink tracking-widest">
            VEILBOUND
          </span>
          <div className="w-[1.5px] h-6 bg-gradient-to-b from-transparent via-violet to-transparent shadow-[0_0_8px_#7B5CF0]" />
          <span className="font-display font-extrabold text-xl md:text-2xl text-ink tracking-widest">
            ARCANA
          </span>
        </div>

        <p className="text-xs text-ink-2 font-ui tracking-wide">
          {t("app.loading")}
        </p>
      </div>

      {/* Progress Bar & Footer */}
      <div className="w-full max-w-[240px] flex flex-col items-center gap-3 z-10">
        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden border border-white/40">
          <div
            className="h-full bg-gradient-to-r from-violet to-teal-400 transition-all duration-150 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] text-ink-3 italic">
          {t("app.credits")}
        </span>
      </div>
    </div>
  );
};
