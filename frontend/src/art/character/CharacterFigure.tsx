import React from "react";
import { motion } from "framer-motion";
import type { Aspect, Rarity } from "@/game/types";
import { CharacterArt } from "./CharacterArt";

export type FigureState = "idle" | "attack" | "hurt" | "ko";

export interface CharacterFigureProps {
  cardId: string;
  name?: string;
  aspect?: Aspect;
  rarity?: Rarity;
  tarotArchetype?: string;
  crowned?: boolean;
  state?: FigureState;
  /** "player" lunges upward into the arena, "rival" lunges downward. */
  side?: "player" | "rival";
  reduceMotion?: boolean;
  className?: string;
  /** Show the impact burst on attack (defaults to true). */
  impact?: boolean;
}

const LUNGE: Record<"player" | "rival", { y: number; scale: number }> = {
  player: { y: -30, scale: 1.14 },
  rival: { y: 30, scale: 1.14 },
};

/**
 * Animated battle sprite for a card's character.
 *
 * Layers:
 *  - the character illustration itself (idle breathing / aura / ember drift,
 *    generated in `characterArt.ts`)
 *  - a weapon-swing pass driven by `.va-figure--attack .va-weapon`
 *  - a framer-motion lunge / shake / knockout transition on the wrapper
 *  - an impact burst that flashes on the target
 */
export const CharacterFigure: React.FC<CharacterFigureProps> = ({
  cardId,
  name,
  aspect,
  rarity,
  tarotArchetype,
  crowned,
  state = "idle",
  side = "player",
  reduceMotion = false,
  className = "",
  impact = true,
}) => {
  const lunge = LUNGE[side];

  const animate =
    state === "attack"
      ? { y: lunge.y, scale: lunge.scale, rotate: side === "player" ? -4 : 4, opacity: 1 }
      : state === "hurt"
      ? { x: [0, -9, 9, -6, 6, 0], y: 0, scale: 1, rotate: 0, opacity: 1 }
      : state === "ko"
      ? {
          y: side === "player" ? 46 : -46,
          scale: 0.62,
          rotate: side === "player" ? 16 : -16,
          opacity: 0,
        }
      : { x: 0, y: [0, -5, 0], scale: 1, rotate: 0, opacity: 1 };

  const transition =
    state === "idle" && !reduceMotion
      ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const }
      : state === "hurt"
      ? { duration: 0.45, ease: "easeOut" as const }
      : { duration: 0.42, ease: "easeOut" as const };

  return (
    <div className={`va-figure va-figure--${state} ${className}`}>
      <motion.div
        className="va-figure__inner"
        animate={animate}
        transition={transition}
        initial={false}
      >
        <CharacterArt
          cardId={cardId}
          name={name}
          aspect={aspect}
          rarity={rarity}
          tarotArchetype={tarotArchetype}
          crowned={crowned}
          animated={!reduceMotion}
          crop
          svgClassName="va-figure__art"
        />
      </motion.div>

      {impact && state === "attack" && (
        <div className="va-figure__impact" aria-hidden="true" />
      )}
      {state === "hurt" && (
        <div className="va-figure__hurt" aria-hidden="true" />
      )}
    </div>
  );
};

export default CharacterFigure;
