import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Flame, Coins, Check, HelpCircle } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";

export const S17Shop: React.FC = () => {
  const navigate = useNavigate();
  const { save, addShards, deductShards, addEchoes, openPack } = useGameStore();

  const [claimedDaily, setClaimedDaily] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setPurchaseToast(msg);
    setTimeout(() => setPurchaseToast(null), 2000);
  };

  const handleClaimDaily = () => {
    if (claimedDaily) return;
    addShards(50);
    setClaimedDaily(true);
    showToast("Claimed 50 Daily Veil Shards!");
  };

  const handleBuyPack = (cost: number, packCount: number) => {
    if (save.currencies.shards < cost) {
      alert("Insufficient Veil Shards. Claim daily allowance or refill.");
      return;
    }
    deductShards(cost);
    for (let i = 0; i < packCount; i++) {
      // Direct pack purchase
    }
    showToast(`Acquired ${packCount} Arcana Pack${packCount > 1 ? "s" : ""}!`);
    navigate(`/open?set=V1`);
  };

  const handleRefreshCandle = () => {
    if (save.currencies.shards < 50) {
      alert("Insufficient Veil Shards (50 needed).");
      return;
    }
    deductShards(50);
    openPack();
    showToast("Vigil Candle kindled! Ready to unbind.");
    navigate("/open?set=V1");
  };

  const handleExchangeEchoes = () => {
    if (save.currencies.shards < 100) {
      alert("Requires 100 Veil Shards.");
      return;
    }
    deductShards(100);
    addEchoes(500);
    showToast("Exchanged for 500 Echoes!");
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      <Header
        title="Sanctuary Shop"
        subtitle="Offerings & Shard Exchange"
        onBack={() => navigate("/")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Currencies Pill Overview */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet/10 text-violet flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-ink-2 uppercase block">Veil Shards</span>
              <span className="font-display font-extrabold text-sm text-ink">
                {save.currencies.shards}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Coins size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-ink-2 uppercase block">Echoes</span>
              <span className="font-display font-extrabold text-sm text-ink">
                {save.currencies.echoes}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Vigil Gift */}
        <div className="bg-gradient-to-r from-violet to-purple-800 rounded-3xl p-4 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-wider opacity-80 block">
              DAILY WARDEN TRIBUTE
            </span>
            <span className="font-display font-bold text-base text-amber-300">
              50 Free Veil Shards
            </span>
            <span className="text-[10px] text-purple-200 block">Available once per dawn</span>
          </div>

          <button
            disabled={claimedDaily}
            onClick={handleClaimDaily}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-ui active:scale-95 transition-all ${
              claimedDaily
                ? "bg-white/20 text-white/50 cursor-default"
                : "bg-amber-400 text-slate-950 shadow-md"
            }`}
          >
            {claimedDaily ? (
              <span className="flex items-center gap-1">
                <Check size={14} /> Claimed
              </span>
            ) : (
              "Claim"
            )}
          </button>
        </div>

        {/* Instant Candle Kindling */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-ink block">
                Kindle Vigil Candle
              </span>
              <span className="text-[11px] text-ink-2">Bypass wait time to unbind 1 pack</span>
            </div>
          </div>

          <button
            onClick={handleRefreshCandle}
            className="px-3 py-1.5 rounded-xl bg-violet text-white text-xs font-bold font-ui active:scale-95 shadow-sm"
          >
            50 Shards
          </button>
        </div>

        {/* Arcana Pack Bundles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-ink">Arcana Pack Offerings</span>
            <button
              onClick={() => setShowRatesModal(true)}
              className="flex items-center gap-1 text-[11px] text-violet font-semibold hover:underline"
            >
              <HelpCircle size={12} />
              <span>Drop Rates</span>
            </button>
          </div>

          <div className="space-y-2">
            {/* 1 Pack */}
            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-display font-bold text-sm text-ink block">1 Arcana Pack</span>
                <span className="text-[10px] text-ink-2 font-mono">5 Cards · Set V1</span>
              </div>
              <button
                onClick={() => handleBuyPack(100, 1)}
                className="px-4 py-2 rounded-xl bg-violet text-white text-xs font-bold active:scale-95 shadow-sm"
              >
                100 Shards
              </button>
            </div>

            {/* 5 Packs (10% off) */}
            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm text-ink">5 Arcana Packs</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                    10% OFF
                  </span>
                </div>
                <span className="text-[10px] text-ink-2 font-mono">25 Cards · Set V1</span>
              </div>
              <button
                onClick={() => handleBuyPack(450, 5)}
                className="px-4 py-2 rounded-xl bg-violet text-white text-xs font-bold active:scale-95 shadow-sm"
              >
                450 Shards
              </button>
            </div>

            {/* 10 Packs (15% off) */}
            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm text-ink">10 Arcana Packs</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    15% OFF
                  </span>
                </div>
                <span className="text-[10px] text-ink-2 font-mono">50 Cards · Set V1</span>
              </div>
              <button
                onClick={() => handleBuyPack(850, 10)}
                className="px-4 py-2 rounded-xl bg-violet text-white text-xs font-bold active:scale-95 shadow-sm"
              >
                850 Shards
              </button>
            </div>
          </div>
        </div>

        {/* Currency Conversion */}
        <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 pb-16">
          <span className="font-display font-bold text-xs text-ink">Echo Conversion</span>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="font-ui font-semibold text-ink block">500 Echoes</span>
              <span className="text-[10px] text-ink-2">Used for card trade fees</span>
            </div>
            <button
              onClick={handleExchangeEchoes}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-ui font-bold text-xs active:scale-95 shadow-sm"
            >
              100 Shards
            </button>
          </div>
        </div>
      </div>

      {/* Drop Rates Disclosure Modal */}
      {showRatesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl space-y-3">
            <h3 className="font-display font-bold text-base text-ink">Sanctuary Drop Disclosures</h3>
            <p className="text-[11px] text-ink-2 leading-tight">
              Deterministic probabilities computed via Mulberry32 PRNG per pack:
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-ink">Rune I–IV (Common/Uncommon)</span>
                <span className="font-mono font-bold text-slate-700">80.0%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-ink">Moon I–III (Rare Foil)</span>
                <span className="font-mono font-bold text-amber-600">18.0%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-ink">Veil (Full-Art Immersive)</span>
                <span className="font-mono font-bold text-purple-600">2.0%</span>
              </div>
            </div>

            <button
              onClick={() => setShowRatesModal(false)}
              className="w-full py-2.5 rounded-xl bg-violet text-white text-xs font-bold font-ui shadow-sm active:scale-95"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {purchaseToast && (
        <div className="fixed bottom-20 inset-x-4 z-50 flex justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-ui font-bold shadow-xl border border-white/20">
            {purchaseToast}
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
};
