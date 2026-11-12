import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swords, Bot, Trophy, Users, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { validateDeck } from "@/game/engine";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";

export const S13BattleLobby: React.FC = () => {
  const navigate = useNavigate();
  const { save } = useGameStore();

  const [mode, setMode] = useState<"solo" | "versus" | "ranked">("solo");

  const activeDeck = save.decks[save.activeDeckId] || {
    id: "deck-starter",
    name: "Starter Spread",
    cardIds: [],
  };

  const validation = validateDeck(activeDeck.cardIds);

  const handleStartBattle = () => {
    if (!validation.valid) {
      alert("Please ensure your active Spread has 20 cards and at least 1 Basic Veilborn.");
      return;
    }
    navigate(`/matchmaking?mode=${mode}`);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      <Header
        title="Arena of Rites"
        subtitle="Unbind Arcana in Sacred Combat"
        onBack={() => navigate("/")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Battle Mode Selection */}
        <div className="space-y-2">
          <span className="font-display font-bold text-xs text-ink">Choose Duel Mode</span>

          {/* Mode 1: Solo Trial */}
          <div
            onClick={() => setMode("solo")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              mode === "solo"
                ? "bg-white border-violet shadow-md ring-2 ring-violet/20"
                : "bg-white/80 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-ink block">Solo Trial</span>
                <span className="text-[11px] text-ink-2 font-ui">
                  Duel a mystical automaton spirit
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                mode === "solo" ? "border-violet bg-violet text-white" : "border-slate-300"
              }`}
            >
              {mode === "solo" && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          {/* Mode 2: Versus Duel */}
          <div
            onClick={() => setMode("versus")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              mode === "versus"
                ? "bg-white border-violet shadow-md ring-2 ring-violet/20"
                : "bg-white/80 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-ink block">Versus Duel</span>
                <span className="text-[11px] text-ink-2 font-ui">
                  Match with a fellow wandering Warden
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                mode === "versus" ? "border-violet bg-violet text-white" : "border-slate-300"
              }`}
            >
              {mode === "versus" && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          {/* Mode 3: Ranked Rite */}
          <div
            onClick={() => setMode("ranked")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              mode === "ranked"
                ? "bg-white border-violet shadow-md ring-2 ring-violet/20"
                : "bg-white/80 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Trophy size={20} />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-ink block">Ranked Rite</span>
                <span className="text-[11px] text-ink-2 font-ui">
                  Ascend the Sanctum leaderboard ladder
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                mode === "ranked" ? "border-violet bg-violet text-white" : "border-slate-300"
              }`}
            >
              {mode === "ranked" && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>
        </div>

        {/* Selected Deck Card */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-ink">Active Spread</span>
            <button
              onClick={() => navigate("/spreads")}
              className="text-xs font-bold text-violet hover:underline"
            >
              Change
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-display font-bold text-sm text-ink block">
                {activeDeck.name}
              </span>
              <span className="text-[11px] text-ink-2 font-mono">
                {activeDeck.cardIds.length} of 20 Arcana
              </span>
            </div>

            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                validation.valid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {validation.valid ? (
                <>
                  <ShieldCheck size={12} /> Ready
                </>
              ) : (
                <>
                  <ShieldAlert size={12} /> Incomplete
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rite Rules Summary */}
        <div className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200 text-xs text-ink-2 space-y-1">
          <span className="font-mono font-bold text-[10px] uppercase text-ink block">
            Rules of the Duel
          </span>
          <p className="font-ui text-[11px]">· First Warden to claim 3 Knockouts wins the duel.</p>
          <p className="font-ui text-[11px]">· Aether is granted automatically each turn to fuel abilities.</p>
          <p className="font-ui text-[11px]">· Aspect weaknesses inflict +20 additional damage.</p>
        </div>
      </div>

      {/* Start Button */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-200">
        <button
          onClick={handleStartBattle}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet to-purple-800 text-white font-ui font-extrabold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
        >
          <Swords size={18} />
          <span>Enter the Arena</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <TabBar />
    </div>
  );
};
