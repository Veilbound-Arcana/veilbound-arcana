import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Gift, Sparkles, Check } from "lucide-react";
import { SETS, SET_MAP } from "@/data/sets";
import { ALL_CARDS } from "@/data/generateCards";
import { useGameStore } from "@/store/useGameStore";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";
import { CardView } from "@/components/CardView";

export const S08SetProgress: React.FC = () => {
  const navigate = useNavigate();
  const { save, addEchoes, addShards } = useGameStore();

  const [activeSetId, setActiveSetId] = useState("V1");
  const [claimedMilestones, setClaimedMilestones] = useState<Record<string, boolean>>({});

  const activeSet = SET_MAP[activeSetId] || SETS[0];
  const setCards = ALL_CARDS.filter((c) => c.setId === activeSet.id);

  // Calculate owned cards in this set
  const ownedSetCards = setCards.filter((c) => (save.cards[c.id] || 0) > 0);
  const completionPercent = Math.round((ownedSetCards.length / setCards.length) * 100);

  const milestones = [
    { count: 10, rewardText: "100 Echoes", type: "echoes", value: 100 },
    { count: 20, rewardText: "250 Echoes", type: "echoes", value: 250 },
    { count: 30, rewardText: "100 Veil Shards", type: "shards", value: 100 },
    { count: 40, rewardText: "Crowned Master Foil", type: "foil", value: 0 },
  ];

  const handleClaim = (milestoneKey: string, type: string, value: number) => {
    if (claimedMilestones[milestoneKey]) return;
    if (type === "echoes") addEchoes(value);
    if (type === "shards") addShards(value);
    setClaimedMilestones((prev) => ({ ...prev, [milestoneKey]: true }));
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      <Header
        title="Set Folio"
        subtitle={`${activeSet.title} (${ownedSetCards.length}/${setCards.length})`}
        onBack={() => navigate("/")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Set Selector Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/70 rounded-2xl border border-slate-200">
          {SETS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSetId(s.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-display font-bold transition-all ${
                activeSetId === s.id
                  ? "bg-violet text-white shadow-sm"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {s.badge} · {s.id}
            </button>
          ))}
        </div>

        {/* Set Progress Overview Card */}
        <div className="bg-white/80 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-violet tracking-wider block">
              SET PROGRESS
            </span>
            <h2 className="font-display font-bold text-lg text-ink">{activeSet.title}</h2>
            <p className="text-xs text-ink-2 mt-0.5">
              {ownedSetCards.length} of {setCards.length} Arcana collected ({completionPercent}%)
            </p>
          </div>

          {/* Progress Ring / Percentage Box */}
          <div className="w-14 h-14 rounded-full border-4 border-violet/20 border-t-violet flex items-center justify-center font-display font-extrabold text-sm text-violet">
            {completionPercent}%
          </div>
        </div>

        {/* Milestone Reward Track */}
        <div className="bg-white/80 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 font-display font-bold text-xs text-ink">
            <Award size={16} className="text-amber-500" />
            <span>Milestone Offerings</span>
          </div>

          <div className="space-y-2">
            {milestones.map((m) => {
              const reached = ownedSetCards.length >= m.count;
              const key = `${activeSet.id}-${m.count}`;
              const claimed = claimedMilestones[key];

              return (
                <div
                  key={m.count}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        reached ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {m.count}
                    </div>
                    <div>
                      <span className="font-ui font-semibold text-ink block">{m.rewardText}</span>
                      <span className="text-[10px] text-ink-2 font-mono">
                        {reached ? "Requirement met" : `${m.count - ownedSetCards.length} more cards needed`}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!reached || claimed}
                    onClick={() => handleClaim(key, m.type, m.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-ui transition-all ${
                      claimed
                        ? "bg-slate-200 text-slate-500 cursor-default"
                        : reached
                        ? "bg-amber-400 text-slate-900 shadow-sm active:scale-95"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {claimed ? (
                      <span className="flex items-center gap-1">
                        <Check size={12} /> Claimed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Gift size={12} /> Claim
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1–40 Numbered Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-ink">Set Chronicle (1–40)</span>
            <span className="text-[10px] text-ink-2 font-mono">Tap owned to view</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pb-20">
            {setCards.map((card, index) => {
              const count = save.cards[card.id] || 0;
              const isOwned = count > 0;
              const cardNum = String(index + 1).padStart(3, "0");

              return (
                <div
                  key={card.id}
                  onClick={() => isOwned && navigate(`/card/${card.id}`)}
                  className={`aspect-[5/7] rounded-xl border flex flex-col items-center justify-center text-center p-1 relative overflow-hidden transition-all ${
                    isOwned
                      ? "bg-white border-slate-300 shadow-sm cursor-pointer active:scale-95"
                      : "bg-slate-200/50 border-dashed border-slate-300 opacity-60"
                  }`}
                >
                  {isOwned ? (
                    <div className="w-full h-full relative">
                      <CardView card={card} ownedCount={count} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Sparkles size={16} className="mb-1 opacity-50" />
                      <span className="font-mono font-bold text-[10px]">#{cardNum}</span>
                      <span className="text-[8px] font-ui">Veiled</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
};
