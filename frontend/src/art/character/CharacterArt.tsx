import React, { useMemo } from "react";
import type { Aspect, Rarity } from "@/game/types";
import {
  buildCharacterSvg,
  profileForCard,
  type CharacterProfile,
} from "./characterEngine";

export interface CharacterArtProps {
  cardId: string;
  name?: string;
  aspect?: Aspect;
  rarity?: Rarity;
  tarotArchetype?: string;
  crowned?: boolean;
  /** Pre-built profile, when the caller already resolved it from the card. */
  profile?: CharacterProfile;
  animated?: boolean;
  className?: string;
  /** Exposes the inline SVG root, e.g. to attach state classes for battle FX. */
  svgClassName?: string;
  title?: string;
  /**
   * Zoom the viewBox onto the character so it fills a card/figure window.
   * Leave off for full-scene contexts (immersive view, standalone SVG files).
   */
  crop?: boolean;
}

/** Tight box around the character, matched to a 5:7 card window. */
export const CARD_VIEWBOX = "44 58 312 450";

/**
 * Renders the card's original character illustration as inline SVG.
 *
 * The markup is generated deterministically from the card's own data by
 * `buildCharacterSvg` (no user-supplied strings), so injecting it with
 * `dangerouslySetInnerHTML` is safe. Inline rendering keeps the illustration's
 * internal idle animation (breathing, aura, weapon shimmer) alive and lets
 * global CSS target `.va-weapon` / `.va-aura` for battle-state effects.
 */
export const CharacterArt: React.FC<CharacterArtProps> = ({
  cardId,
  name = "",
  aspect,
  rarity = "rune1",
  tarotArchetype,
  crowned,
  profile,
  animated = true,
  className = "",
  svgClassName = "",
  title,
  crop = false,
}) => {
  const svg = useMemo(() => {
    const resolved =
      profile ??
      profileForCard({
        id: cardId,
        name,
        aspect,
        rarity,
        tarotArchetype,
        crowned,
      });
    return buildCharacterSvg(resolved, {
      animated,
      responsive: true,
      viewBox: crop ? CARD_VIEWBOX : undefined,
    });
  }, [cardId, name, aspect, rarity, tarotArchetype, crowned, profile, animated, crop]);

  const html = svg.replace(
    "<svg ",
    `<svg class="${svgClassName || "va-art"}" aria-label="${(title ?? name ?? "card character").replace(/"/g, "&quot;")}" `
  );

  return (
    <div
      className={`va-art-frame ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default CharacterArt;
