import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Shield, Zap, ArrowLeft, Sparkles } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { createMatch, applyAction } from "@/game/engine";
import { chooseBotAction } from "@/game/bot";
import { MatchState } from "@/game/types";
import { CARD_MAP } from "@/data/generateCards";
import { AspectGlyph } from "@/components/AspectGlyph";
import { playKoShatter, playWinMotif, playLossMotif } from "@/fx/audio";

export const S15BattleBoard: React.FC = () => {
  const navigate = useNavigate();
  const { save, addXp, addEchoes } = useGameStore();

  const starterDeckIds = [
    "c-001", "c-001", "c-002", "c-002", "c-003", "c-003", "c-004", "c-004",
    "c-007", "c-007", "c-010", "c-010", "c-011", "c-011", "c-013", "c-013",
    "c-015", "c-015", "c-012", "c-012"
  ];

  const activeDeck = save.decks ? (Array.isArray(save.decks) ? save.decks[0] : save.decks[save.activeDeckId]) : null;
  const playerDeckIds = activeDeck?.cardIds && activeDeck.cardIds.length === 20 ? activeDeck.cardIds : starterDeckIds;
  const oppDeckIds = [
    "c-001", "c-001", "c-004", "c-004", "c-007", "c-007", "c-005", "c-005",
    "c-010", "c-010", "c-011", "c-011", "c-014", "c-014", "c-016", "c-016",
    "c-008", "c-008", "c-012", "c-012"
  ];

  const [match, setMatch] = useState<MatchState>(() =>
    createMatch(Date.now(), playerDeckIds, oppDeckIds)
  );

  const [floatingDamage, setFloatingDamage] = useState<{
    target: "a" | "b";
    damage: number;
    weakness: boolean;
  } | null>(null);

  const [selectedHandCard, setSelectedHandCard] = useState<string | null>(null);
  const [showAbilityModal, setShowAbilityModal] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>(["Duel commenced. Wardens, begin."]);

  const botThinkingRef = useRef(false);

  const matchWinner = match.over || match.winner;

  // Bot Turn Automation
  useEffect(() => {
    if (matchWinner) return;

    if (match.current === "b" && !botThinkingRef.current) {
      botThinkingRef.current = true;

      const timer = setTimeout(() => {
        const botAction = chooseBotAction(match, "b");
        const { state: nextState, events } = applyAction(match, botAction);

        events.forEach((ev) => {
          if (ev.type === "damage") {
            setFloatingDamage({ target: "a", damage: ev.amount, weakness: false });
            setTimeout(() => setFloatingDamage(null), 1200);
          }
          if (ev.type === "ko") {
            playKoShatter();
          }
        });

        setBattleLog((prev) => [`Rival: ${botAction.type}`, ...prev.slice(0, 4)]);
        setMatch(nextState);
        botThinkingRef.current = false;
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [match, matchWinner]);

  // Handle Match Conclusion
  useEffect(() => {
    if (matchWinner === "a") {
      playWinMotif();
      addXp(120);
      addEchoes(50);
    } else if (matchWinner === "b") {
      playLossMotif();
      addXp(30);
    }
  }, [matchWinner, addXp, addEchoes]);

  const handlePlayHandCard = (cardId: string) => {
    const card = CARD_MAP[cardId];
    if (!card) return;

    if (card.kind === "veilborn" && card.stage === "basic") {
      const target = !match.a.active ? "active" : "bench";
      const { state: nextState } = applyAction(match, { type: "PlayBasic", cardId, target });
      setMatch(nextState);
      setSelectedHandCard(null);
      setBattleLog((prev) => [`You played ${card.name}`, ...prev.slice(0, 4)]);
    } else if (card.kind === "ally") {
      const { state: nextState } = applyAction(match, { type: "PlayAlly", cardId });
      setMatch(nextState);
      setSelectedHandCard(null);
      setBattleLog((prev) => [`You activated ${card.name}`, ...prev.slice(0, 4)]);
    } else if (card.kind === "tool") {
      const { state: nextState } = applyAction(match, { type: "PlayTool", cardId, target: "active" });
      setMatch(nextState);
      setSelectedHandCard(null);
      setBattleLog((prev) => [`You attached ${card.name}`, ...prev.slice(0, 4)]);
    }
  };

  const handleAttachEnergy = (slotTarget: "active" | "bench", benchIndex?: number) => {
    if (!match.a.aetherWell) return;
    const { state: nextState } = applyAction(match, {
      type: "Attach",
      target: slotTarget,
      benchIndex,
    });
    setMatch(nextState);
    setBattleLog((prev) => ["Channelled Aether to Veilborn", ...prev.slice(0, 4)]);
  };

  const handleAttack = (abilityIndex: number) => {
    const { state: nextState, events } = applyAction(match, { type: "Attack", abilityIndex });

    events.forEach((ev) => {
      if (ev.type === "damage") {
        setFloatingDamage({ target: "b", damage: ev.amount, weakness: false });
        setTimeout(() => setFloatingDamage(null), 1200);
      }
      if (ev.type === "ko") {
        playKoShatter();
      }
    });

    setMatch(nextState);
    setShowAbilityModal(false);
    setBattleLog((prev) => ["You struck with ability!", ...prev.slice(0, 4)]);
  };

  const handleEndTurn = () => {
    if (match.current !== "a") return;
    const { state: nextState } = applyAction(match, { type: "EndTurn" });
    setMatch(nextState);
    setBattleLog((prev) => ["Turn passed to rival", ...prev.slice(0, 4)]);
  };

  const playerActiveCard = match.a.active ? CARD_MAP[match.a.active.cardId] : null;
  const oppActiveCard = match.b.active ? CARD_MAP[match.b.active.cardId] : null;

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-slate-950 text-white relative select-none overflow-hidden">
      {/* Top Header / Opponent Info Strip */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/10 z-20">
        <button
          onClick={() => navigate("/battle")}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Rival Score & Tag */}
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xs text-rose-300">Rival Warden</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border border-rose-400 ${
                  i < match.b.points ? "bg-rose-500 shadow-sm" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Rival Hand & Deck Count */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span>Hand: {match.b.hand.length}</span>
          <span>Deck: {match.b.deck.length}</span>
        </div>
      </div>

      {/* Duel Arena Center Board */}
      <div className="flex-1 flex flex-col justify-between p-3 relative">
        {/* OPPONENT SIDE (TOP) */}
        <div className="flex flex-col items-center space-y-2">
          {/* Opponent Bench (up to 3) */}
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => {
              const slot = match.b.bench[idx];
              const card = slot ? CARD_MAP[slot.cardId] : null;
              return (
                <div
                  key={idx}
                  className="w-14 h-18 rounded-lg border border-dashed border-rose-900/40 bg-slate-900/50 flex flex-col items-center justify-center relative p-1"
                >
                  {card && (
                    <>
                      <AspectGlyph aspect={card.aspect} size={14} />
                      <span className="text-[7px] font-display text-slate-300 truncate w-full text-center mt-1">
                        {card.name}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-rose-400">
                        {slot.vitality}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Opponent Active Veilborn Slot */}
          <div className="relative">
            <div
              className={`w-24 h-32 rounded-xl border-2 flex flex-col items-center justify-between p-2 shadow-xl transition-all ${
                oppActiveCard
                  ? "bg-gradient-to-b from-rose-950 to-slate-900 border-rose-500/70"
                  : "border-dashed border-rose-800/40 bg-slate-900/30"
              }`}
            >
              {oppActiveCard && match.b.active ? (
                <>
                  <div className="w-full flex items-center justify-between">
                    <AspectGlyph aspect={oppActiveCard.aspect} size={14} />
                    <span className="text-[10px] font-mono font-bold text-rose-400">
                      {match.b.active.vitality} HP
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="font-display font-bold text-xs text-white block leading-tight">
                      {oppActiveCard.name}
                    </span>
                    <span className="text-[8px] text-slate-400 capitalize">
                      {oppActiveCard.stage}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {match.b.active.attached.map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    ))}
                  </div>
                </>
              ) : (
                <span className="text-[9px] text-slate-500 m-auto">Active Empty</span>
              )}
            </div>

            {/* Floating Damage Popup on Opponent */}
            {floatingDamage && floatingDamage.target === "b" && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -25, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 -top-4 flex flex-col items-center pointer-events-none z-30"
              >
                <span className="font-display font-extrabold text-xl text-amber-400 drop-shadow-md">
                  -{floatingDamage.damage}
                </span>
                {floatingDamage.weakness && (
                  <span className="font-mono text-[9px] font-bold text-rose-400 uppercase">
                    WEAKNESS!
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* CENTER NOTIFICATION & BATTLE LOG */}
        <div className="my-2 flex flex-col items-center text-center">
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md flex items-center gap-2 text-xs">
            <span className="font-mono font-bold text-amber-300">Turn {match.turn}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className={`font-ui font-semibold ${match.current === "a" ? "text-emerald-400" : "text-rose-400"}`}>
              {match.current === "a" ? "Your Turn" : "Rival Acting..."}
            </span>
          </div>

          <p className="text-[10px] text-slate-400 font-mono mt-1 truncate max-w-xs">
            {battleLog[0]}
          </p>
        </div>

        {/* PLAYER SIDE (BOTTOM) */}
        <div className="flex flex-col items-center space-y-2">
          {/* Player Active Veilborn Slot */}
          <div className="relative">
            <div
              onClick={() => {
                if (match.current === "a" && playerActiveCard) setShowAbilityModal(true);
              }}
              className={`w-28 h-36 rounded-xl border-2 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer transition-all ${
                playerActiveCard
                  ? "bg-gradient-to-b from-teal-950 to-slate-900 border-teal-500/80 active:scale-95"
                  : "border-dashed border-teal-800/40 bg-slate-900/30"
              }`}
            >
              {playerActiveCard && match.a.active ? (
                <>
                  <div className="w-full flex items-center justify-between">
                    <AspectGlyph aspect={playerActiveCard.aspect} size={16} />
                    <span className="text-[11px] font-mono font-bold text-emerald-400">
                      {match.a.active.vitality} HP
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="font-display font-bold text-sm text-white block leading-tight">
                      {playerActiveCard.name}
                    </span>
                    <span className="text-[9px] text-slate-400 capitalize">
                      {playerActiveCard.stage} · Tap to Attack
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between pt-1 border-t border-white/10 text-[9px]">
                    <span className="text-amber-300 font-mono">
                      Aether: {match.a.active.attached.length}
                    </span>
                    <span className="text-slate-400">
                      Retreat: {playerActiveCard.retreat || 0}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-[9px] text-slate-500 m-auto">
                  Play Basic from hand below
                </span>
              )}
            </div>

            {/* Floating Damage Popup on Player */}
            {floatingDamage && floatingDamage.target === "a" && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -25, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 -top-4 flex flex-col items-center pointer-events-none z-30"
              >
                <span className="font-display font-extrabold text-xl text-rose-500 drop-shadow-md">
                  -{floatingDamage.damage}
                </span>
                {floatingDamage.weakness && (
                  <span className="font-mono text-[9px] font-bold text-rose-400 uppercase">
                    WEAKNESS!
                  </span>
                )}
              </motion.div>
            )}
          </div>

          {/* Player Bench & Aether Well */}
          <div className="flex items-center gap-2">
            {/* Aether Well Orb */}
            <button
              disabled={match.current !== "a" || !match.a.aetherWell}
              onClick={() => handleAttachEnergy("active")}
              className={`w-14 h-16 rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${
                match.a.aetherWell && match.current === "a"
                  ? "border-amber-400 bg-amber-500/20 shadow-md active:scale-95 animate-pulse"
                  : "border-slate-800 bg-slate-900/40 opacity-40"
              }`}
            >
              <Zap size={16} className="text-amber-400" />
              <span className="text-[8px] font-mono text-amber-200 mt-1 leading-tight text-center">
                Channel Aether
              </span>
            </button>

            {/* Bench Slots (up to 3) */}
            {[0, 1, 2].map((idx) => {
              const slot = match.a.bench[idx];
              const card = slot ? CARD_MAP[slot.cardId] : null;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (match.current === "a" && match.a.aetherWell && slot) {
                      handleAttachEnergy("bench", idx);
                    }
                  }}
                  className="w-14 h-16 rounded-xl border border-dashed border-teal-800/40 bg-slate-900/50 flex flex-col items-center justify-center p-1 relative cursor-pointer"
                >
                  {card && slot ? (
                    <>
                      <AspectGlyph aspect={card.aspect} size={12} />
                      <span className="text-[7px] font-display text-slate-300 truncate w-full text-center mt-0.5">
                        {card.name}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-emerald-400">
                        {slot.vitality}
                      </span>
                    </>
                  ) : (
                    <span className="text-[7px] text-slate-600">Bench {idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PLAYER HAND & CONTROL BAR */}
      <div className="w-full bg-slate-900 border-t border-white/10 p-2 z-20 space-y-2">
        {/* Hand Cards Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
          {match.a.hand.map((cardId, idx) => {
            const card = CARD_MAP[cardId];
            if (!card) return null;
            const isSelected = selectedHandCard === cardId;

            return (
              <div
                key={cardId + idx}
                onClick={() => {
                  if (match.current === "a") {
                    setSelectedHandCard(isSelected ? null : cardId);
                  }
                }}
                className={`w-16 h-22 flex-shrink-0 rounded-lg border p-1 bg-slate-800 flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected ? "border-amber-400 -translate-y-2 shadow-lg" : "border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <AspectGlyph aspect={card.aspect} size={10} />
                  <span className="text-[8px] font-mono text-emerald-400">
                    {card.vitality ? `${card.vitality}` : ""}
                  </span>
                </div>
                <span className="text-[8px] font-display font-semibold text-white leading-tight truncate">
                  {card.name}
                </span>
                <span className="text-[6px] text-slate-400 uppercase">{card.kind}</span>
              </div>
            );
          })}
        </div>

        {/* Selected Card Action Row or End Turn */}
        <div className="flex items-center gap-2">
          {selectedHandCard ? (
            <button
              onClick={() => handlePlayHandCard(selectedHandCard)}
              className="flex-1 py-2 rounded-xl bg-teal-600 text-white font-ui font-bold text-xs shadow-md active:scale-95"
            >
              Play Selected Arcana
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between text-xs px-2 text-slate-300">
              <span>Your Knockouts:</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border border-emerald-400 ${
                      i < match.a.points ? "bg-emerald-500 shadow-sm" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            disabled={match.current !== "a"}
            onClick={handleEndTurn}
            className={`px-4 py-2 rounded-xl font-ui font-bold text-xs transition-all ${
              match.current === "a"
                ? "bg-violet text-white active:scale-95 shadow-md"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            Pass Turn
          </button>
        </div>
      </div>

      {/* Ability Strike Modal */}
      <AnimatePresence>
        {showAbilityModal && playerActiveCard && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end">
            <div className="bg-slate-900 border-t border-white/20 rounded-t-3xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-display font-bold text-sm text-white">
                  {playerActiveCard.name} Abilities
                </span>
                <button
                  onClick={() => setShowAbilityModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-2">
                {(playerActiveCard.abilities || []).map((ab, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-white">{ab.name}</span>
                        {ab.damage !== undefined && (
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {ab.damage} DMG
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 font-ui mt-0.5">{ab.text}</p>
                    </div>

                    <button
                      onClick={() => handleAttack(idx)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-ui font-extrabold text-xs active:scale-95 shadow-md flex items-center gap-1"
                    >
                      <Swords size={14} />
                      <span>Strike</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Victory / Defeat Modal */}
      {matchWinner && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center max-w-xs"
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                matchWinner === "a"
                  ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400/50"
                  : "bg-rose-500/20 text-rose-400 border-2 border-rose-400/50"
              }`}
            >
              {matchWinner === "a" ? <Sparkles size={40} /> : <Shield size={40} />}
            </div>

            <h1 className="font-display font-extrabold text-2xl mb-1">
              {matchWinner === "a" ? "The Veil Holds" : "The Veil Frays"}
            </h1>
            <p className="text-xs text-slate-300 mb-6 font-ui">
              {matchWinner === "a"
                ? "You claimed 3 knockouts. Victory rewarded +120 XP and +50 Echoes."
                : "Your frontline spirits have been unbound. Rekindle your Spread and try again."}
            </p>

            <button
              onClick={() => navigate("/battle")}
              className="w-full py-3 rounded-full bg-violet text-white font-ui font-bold text-xs shadow-lg active:scale-95"
            >
              Return to Sanctuary
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
