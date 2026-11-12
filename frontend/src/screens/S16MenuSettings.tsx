import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX, Globe, EyeOff, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";

export const S16MenuSettings: React.FC = () => {
  const navigate = useNavigate();
  const { save, updateSettings, resetSave } = useGameStore();

  const [confirmReset, setConfirmReset] = useState(false);

  const handleToggleMute = () => {
    updateSettings({ muted: !save.settings.muted });
  };

  const handleToggleReduceMotion = () => {
    updateSettings({ reduceMotion: !save.settings.reduceMotion });
  };

  const handleLanguageChange = (lang: "en" | "id") => {
    updateSettings({ language: lang });
  };

  const handleReplayTutorial = () => {
    updateSettings({ tutorialCompleted: false });
    navigate("/tutorial");
  };

  const handleResetData = () => {
    resetSave();
    setConfirmReset(false);
    navigate("/");
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      <Header
        title="Sanctuary Rites"
        subtitle="Settings & Lore Governance"
        onBack={() => navigate("/")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Audio Controls */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-ink">Audio Resonances</span>
            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold ${
                save.settings.muted ? "bg-red-100 text-red-600" : "bg-slate-100 text-ink-2"
              }`}
            >
              {save.settings.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{save.settings.muted ? "Muted" : "Active"}</span>
            </button>
          </div>

          {/* Music Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-ink-2">
              <span>Mystic Harmony (Music)</span>
              <span className="font-mono">{Math.round(save.settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={save.settings.musicVolume}
              onChange={(e) => updateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-violet cursor-pointer"
            />
          </div>

          {/* Effects Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-ink-2">
              <span>Card Resonances (Effects)</span>
              <span className="font-mono">{Math.round(save.settings.fxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={save.settings.fxVolume}
              onChange={(e) => updateSettings({ fxVolume: parseFloat(e.target.value) })}
              className="w-full accent-violet cursor-pointer"
            />
          </div>
        </div>

        {/* Accessibility & Visuals */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <span className="font-display font-bold text-xs text-ink">Visuals & Flow</span>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff size={16} className="text-violet" />
              <div>
                <span className="font-ui font-semibold text-xs text-ink block">
                  Reduce Motion
                </span>
                <span className="text-[10px] text-ink-2">
                  Minimizes 3D parallax tilt and full-screen flashes
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleReduceMotion}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                save.settings.reduceMotion ? "bg-violet" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  save.settings.reduceMotion ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-violet" />
            <span className="font-display font-bold text-xs text-ink">Language / Bahasa</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold font-ui transition-all ${
                save.settings.language === "en"
                  ? "bg-violet text-white shadow-sm"
                  : "bg-slate-100 text-ink-2 hover:bg-slate-200"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange("id")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold font-ui transition-all ${
                save.settings.language === "id"
                  ? "bg-violet text-white shadow-sm"
                  : "bg-slate-100 text-ink-2 hover:bg-slate-200"
              }`}
            >
              Bahasa Indonesia
            </button>
          </div>
        </div>

        {/* Tutorial & Progression */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <span className="font-display font-bold text-xs text-ink">Warden Journey</span>

          <button
            onClick={handleReplayTutorial}
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-xs font-bold font-ui text-ink active:scale-95"
          >
            <RotateCcw size={14} />
            <span>Replay Initial Initiation</span>
          </button>
        </div>

        {/* Legal Disclaimer & Originality Notice */}
        <div className="bg-slate-100/90 rounded-2xl p-4 border border-slate-200 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-display font-bold text-ink">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Originality Guarantee</span>
          </div>
          <p className="text-[11px] text-ink-2 font-ui leading-relaxed">
            "Veilbound Arcana is an original game and is not affiliated with any other trading-card game."
          </p>
          <span className="text-[10px] text-slate-400 font-mono block pt-1">
            Build v1.0.0-mist · Procedural Engine
          </span>
        </div>

        {/* Danger Zone: Reset Profile */}
        <div className="pt-2 pb-16 text-center">
          <button
            onClick={() => setConfirmReset(true)}
            className="text-[11px] font-ui font-semibold text-rose-500 hover:underline"
          >
            Reset All Profile Save Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-display font-bold text-base text-ink">Reset Profile?</h3>
            <p className="text-xs text-ink-2">
              All unlocked Arcana, Echoes, and customized Spreads will be erased and reset to fresh beginner state.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-ink-2 text-xs font-bold font-ui"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold font-ui shadow-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
};
