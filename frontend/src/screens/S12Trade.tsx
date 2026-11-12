import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftRight, Check, Sparkles, AlertCircle } from "lucide-react";
import { MOCK_FRIENDS } from "@/data/friends";
import { ALL_CARDS, CARD_MAP } from "@/data/generateCards";
import { useGameStore } from "@/store/useGameStore";
import { Header } from "@/components/Header";
import { CardView } from "@/components/CardView";
import { playChoirSwell } from "@/fx/audio";

export const S12Trade: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const friendId = params.get("friendId") || MOCK_FRIENDS[0].id;

  const friend = MOCK_FRIENDS.find((f) => f.id === friendId) || MOCK_FRIENDS[0];
  const { save, addCards, removeCard, deductEchoes } = useGameStore();

  const [mySelectedCardId, setMySelectedCardId] = useState<string | null>(null);
  const [partnerSelectedCardId, setPartnerSelectedCardId] = useState<string | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState(false);

  // My duplicate cards available to trade (count >= 2)
  const myDuplicates = ALL_CARDS.filter((c) => (save.cards[c.id] || 0) >= 2);

  // Partner tradable cards
  const partnerCards = friend.tradableCardIds
    .map((id) => CARD_MAP[id])
    .filter((c): c is NonNullable<typeof c> => !!c);

  const myCard = mySelectedCardId ? CARD_MAP[mySelectedCardId] : null;
  const partnerCard = partnerSelectedCardId ? CARD_MAP[partnerSelectedCardId] : null;

  // Rarity check rule: same rarity tier
  const isSameRarity =
    myCard && partnerCard
      ? myCard.rarity.split("_")[0] === partnerCard.rarity.split("_")[0]
      : false;

  const hasEchoes = save.currencies.echoes >= 100;
  const canConfirmTrade = myCard && partnerCard && isSameRarity && hasEchoes && !isTrading;

  const handleExecuteTrade = () => {
    if (!canConfirmTrade || !mySelectedCardId || !partnerSelectedCardId) return;

    setIsTrading(true);

    // 1.5s simulated partner agreement sequence
    setTimeout(() => {
      deductEchoes(100);
      removeCard(mySelectedCardId);
      addCards([partnerSelectedCardId]);

      playChoirSwell(save.settings.fxVolume, save.settings.muted);
      setIsTrading(false);
      setTradeSuccess(true);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      <Header
        title="Arcana Exchange"
        subtitle={`Ritual with ${friend.name}`}
        onBack={() => navigate("/friends")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Exchange Stage (My Card <=> Partner Card) */}
        <div className="bg-white/90 rounded-3xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          {/* My Offered Card Slot */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-ink-2 mb-1">YOUR OFFERING</span>
            <div className="w-[100px] h-[140px] rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-center relative overflow-hidden">
              {myCard ? (
                <CardView card={myCard} />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <span className="text-[10px] font-ui">Select duplicate</span>
                </div>
              )}
            </div>
          </div>

          {/* Central Exchange Icon */}
          <div className="flex flex-col items-center px-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isTrading ? "bg-amber-400 animate-spin text-slate-900" : "bg-violet/10 text-violet"
              }`}
            >
              <ArrowLeftRight size={18} />
            </div>
            <span className="text-[9px] font-mono text-ink-2 mt-1">Fee: 100 Echoes</span>
          </div>

          {/* Partner Wanted Card Slot */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-ink-2 mb-1">{friend.name.toUpperCase()}</span>
            <div className="w-[100px] h-[140px] rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-center relative overflow-hidden">
              {partnerCard ? (
                <CardView card={partnerCard} />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <span className="text-[10px] font-ui">Select desired</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation or Fee Alert */}
        {myCard && partnerCard && !isSameRarity && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle size={16} />
            <span>Trades require matching rarity tiers (e.g. Rune with Rune).</span>
          </div>
        )}

        {!hasEchoes && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
            <AlertCircle size={16} />
            <span>Insufficient Echoes (100 required for the trade fee).</span>
          </div>
        )}

        {/* Section 1: My Available Duplicates */}
        <div className="bg-white/80 rounded-2xl p-3 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-ink">Your Duplicate Arcana</span>
            <span className="text-[10px] text-ink-2 font-mono">{myDuplicates.length} available</span>
          </div>

          {myDuplicates.length === 0 ? (
            <p className="text-xs text-ink-2 italic text-center py-3">
              No duplicate cards available to trade. Open packs to collect spares.
            </p>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {myDuplicates.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setMySelectedCardId(c.id)}
                  className={`w-[78px] h-[110px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    mySelectedCardId === c.id
                      ? "ring-2 ring-violet scale-105"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <CardView card={c} ownedCount={save.cards[c.id]} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Partner's Available Tradables */}
        <div className="bg-white/80 rounded-2xl p-3 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-ink">
              {friend.name}'s Offerings
            </span>
            <span className="text-[10px] text-ink-2 font-mono">Tap to select</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {partnerCards.map((c) => (
              <div
                key={c.id}
                onClick={() => setPartnerSelectedCardId(c.id)}
                className={`w-[78px] h-[110px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all ${
                  partnerSelectedCardId === c.id
                    ? "ring-2 ring-amber-400 scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <CardView card={c} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trade Confirm Bottom Bar */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-200">
        <button
          disabled={!canConfirmTrade}
          onClick={handleExecuteTrade}
          className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-ui font-extrabold text-xs shadow-md transition-all ${
            canConfirmTrade
              ? "bg-violet text-white active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <Sparkles size={16} />
          <span>{isTrading ? "Performing Ritual..." : "Seal Exchange (100 Echoes)"}</span>
        </button>
      </div>

      {/* Success Modal */}
      {tradeSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Check size={36} />
          </div>
          <h2 className="font-display font-bold text-xl mb-1">The Exchange is Sealed</h2>
          <p className="text-xs text-slate-300 max-w-xs mb-6">
            You received {partnerCard?.name} into your Archive.
          </p>
          <button
            onClick={() => navigate("/archive")}
            className="px-6 py-2.5 rounded-full bg-violet text-white text-xs font-bold font-ui active:scale-95 shadow-lg"
          >
            View Archive
          </button>
        </div>
      )}
    </div>
  );
};
