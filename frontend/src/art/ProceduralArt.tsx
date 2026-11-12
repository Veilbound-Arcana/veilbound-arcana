import React from "react";
import { Aspect, Rarity } from "@/game/types";
import { CONCEPT } from "@/app/concept.config";
import { mulberry32 } from "@/game/rng";

interface ProceduralArtProps {
  cardId: string;
  name?: string;
  aspect?: Aspect;
  rarity?: Rarity;
  tarotArchetype?: string;
  className?: string;
}

export const ProceduralArt: React.FC<ProceduralArtProps> = ({
  cardId,
  name: _name,
  aspect = "aether",
  rarity = "rune1",
  tarotArchetype = "",
  className = "",
}) => {
  // Hash cardId into deterministic integer seed
  let hash = 0;
  for (let i = 0; i < cardId.length; i++) {
    hash = (hash << 5) - hash + cardId.charCodeAt(i);
    hash |= 0;
  }
  const rng = mulberry32(Math.abs(hash));

  const mainColor = CONCEPT.ASPECT_COLORS[aspect] || "#5DD6C8";
  const r1 = rng();
  rng(); // advance PRNG
  const r3 = rng();
  rng(); // advance PRNG

  // Tier classification
  const isMoon = rarity.startsWith("moon");
  const isVeil = rarity === "veil";

  // Procedural gradient angles & colors
  const angle = Math.floor(r1 * 360);
  const secondaryColor =
    aspect === "ember"
      ? "#FF9F43"
      : aspect === "tide"
      ? "#00D2D3"
      : aspect === "verdant"
      ? "#10AC84"
      : aspect === "volt"
      ? "#FECA57"
      : aspect === "umbra"
      ? "#8854D0"
      : aspect === "lumen"
      ? "#FFF275"
      : aspect === "iron"
      ? "#A5B1C2"
      : "#48DBFB";

  // Particle count by rarity tier
  const starCount = isVeil ? 24 : isMoon ? 16 : 8;
  const stars = Array.from({ length: starCount }, () => ({
    cx: Math.floor(rng() * 200),
    cy: Math.floor(rng() * 200),
    r: (rng() * (isVeil ? 2.5 : 1.8) + 0.8).toFixed(1),
    opacity: (rng() * 0.7 + 0.3).toFixed(2),
  }));

  // Shape Archetype based on r3 and tarot archetype hint
  // 0 = Crowned Celestial Seraph / Moth
  // 1 = Astral Beast / Chimera
  // 2 = Sacred Stained-Glass Crystal / Spire
  // 3 = Wheel of Fortune / Cosmic Mandala
  // 4 = The High Oracle / Mystic Flame
  const shapeKind = tarotArchetype.includes("Wheel")
    ? 3
    : tarotArchetype.includes("Spire") || tarotArchetype.includes("Tower")
    ? 2
    : tarotArchetype.includes("Beast") || tarotArchetype.includes("Dragon") || tarotArchetype.includes("Chariot")
    ? 1
    : tarotArchetype.includes("Oracle") || tarotArchetype.includes("Priestess")
    ? 4
    : Math.floor(r3 * 5);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            @keyframes pulseGlow {
              0%, 100% { opacity: 0.85; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.04); }
            }
            @keyframes rotateMandala {
              0% { transform: rotate(0deg); transform-origin: 100px 105px; }
              100% { transform: rotate(360deg); transform-origin: 100px 105px; }
            }
            @keyframes shimmerFlow {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 40; }
            }
            .animate-veil-halo {
              animation: rotateMandala 20s linear infinite;
            }
            .animate-veil-pulse {
              animation: pulseGlow 4s ease-in-out infinite;
            }
            .animate-shimmer {
              animation: shimmerFlow 6s linear infinite;
            }
          `}</style>

          {/* Dynamic Linear Background Gradient */}
          <linearGradient
            id={`grad-${cardId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientTransform={`rotate(${angle})`}
          >
            <stop offset="0%" stopColor="#0B0914" />
            <stop offset="45%" stopColor={isVeil ? "#1E1138" : isMoon ? "#13132B" : "#0F172A"} />
            <stop offset="85%" stopColor={mainColor} stopOpacity={isVeil ? "0.9" : isMoon ? "0.75" : "0.55"} />
            <stop offset="100%" stopColor="#05050A" />
          </linearGradient>

          {/* Radial Center Core Aura */}
          <radialGradient id={`core-${cardId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isVeil ? "0.9" : "0.6"} />
            <stop offset="40%" stopColor={secondaryColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={mainColor} stopOpacity="0" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id={`glow-${cardId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isVeil ? "7" : isMoon ? "5" : "3"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Ambient Nebula Background */}
        <rect width="200" height="200" fill={`url(#grad-${cardId})`} />

        {/* 2. Radial Core Glow for Moon & Veil Tiers */}
        {(isMoon || isVeil) && (
          <circle
            cx="100"
            cy="105"
            r={isVeil ? "85" : "65"}
            fill={`url(#core-${cardId})`}
            className={isVeil ? "animate-veil-pulse" : ""}
          />
        )}

        {/* 3. Constellations & Stardust */}
        {stars.map((s, idx) => (
          <circle
            key={idx}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#FFFFFF"
            opacity={s.opacity}
          />
        ))}

        {/* 4. Astrological Sacred Geometry Rings (Moon & Veil) */}
        {isVeil ? (
          <g className="animate-veil-halo" opacity="0.65">
            <circle cx="100" cy="105" r="72" fill="none" stroke="#F2C14E" strokeWidth="1.2" strokeDasharray="6 4" />
            <polygon points="100,35 160,140 40,140" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.5" />
            <polygon points="100,175 40,70 160,70" fill="none" stroke="#F2C14E" strokeWidth="0.8" opacity="0.5" />
          </g>
        ) : isMoon ? (
          <g opacity="0.45">
            <circle cx="100" cy="105" r="62" fill="none" stroke={secondaryColor} strokeWidth="1" strokeDasharray="4 4" className="animate-shimmer" />
            <circle cx="100" cy="105" r="48" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
          </g>
        ) : (
          /* Rune Tier: Minimal geometric alignment line */
          <g opacity="0.3">
            <line x1="20" y1="105" x2="180" y2="105" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="100" cy="105" r="54" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
          </g>
        )}

        {/* 5. Centerpiece Tarot / Spirit Silhouette */}
        <g filter={`url(#glow-${cardId})`} className={isVeil ? "animate-veil-pulse" : ""}>
          {shapeKind === 0 && (
            // The Sacred Moth / Crowned Seraph (Veil / World / Judgement)
            <g>
              <path
                d="M100 45 C65 70 20 60 18 112 C40 120 78 102 100 142 C122 102 160 120 182 112 C180 60 135 70 100 45 Z"
                fill={mainColor}
                stroke="#FFFFFF"
                strokeWidth={isVeil ? "2" : "1.2"}
              />
              <circle cx="100" cy="85" r={isVeil ? "10" : "7"} fill="#FFFFFF" opacity="0.9" />
              <line x1="100" y1="75" x2="92" y2="55" stroke="#F2C14E" strokeWidth="1.5" />
              <line x1="100" y1="75" x2="108" y2="55" stroke="#F2C14E" strokeWidth="1.5" />
            </g>
          )}

          {shapeKind === 1 && (
            // Astral Beast / Horned Chimera (Strength / Chariot / Dragon)
            <g>
              <path
                d="M100 48 C65 48 58 92 72 122 C82 142 100 158 100 158 C100 158 118 142 128 122 C142 92 135 48 100 48 Z"
                fill={mainColor}
                stroke="#FFFFFF"
                strokeWidth={isVeil ? "2" : "1.2"}
              />
              <path d="M52 58 C64 84 82 94 88 100 C74 95 64 74 52 58 Z" fill={secondaryColor} stroke="#FFFFFF" strokeWidth="0.8" />
              <path d="M148 58 C136 84 118 94 112 100 C126 95 136 74 148 58 Z" fill={secondaryColor} stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="100" cy="95" r="5" fill="#FFFFFF" />
            </g>
          )}

          {shapeKind === 2 && (
            // Stained-Glass Spire / Crystal Monolith (The Tower / Star / Hermit)
            <g>
              <polygon
                points="100,30 142,75 128,155 100,172 72,155 58,75"
                fill={mainColor}
                stroke="#FFFFFF"
                strokeWidth={isVeil ? "2" : "1.2"}
              />
              <polygon points="100,45 125,80 100,150 75,80" fill={secondaryColor} opacity="0.8" stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="100" cy="98" r="8" fill="#FFFFFF" opacity="0.95" />
            </g>
          )}

          {shapeKind === 3 && (
            // The Ouroboros Wheel / Cosmic Vortex (Wheel of Fortune / Sun / Moon)
            <g>
              <circle cx="100" cy="105" r="48" fill={mainColor} stroke="#FFFFFF" strokeWidth={isVeil ? "2" : "1.2"} />
              <circle cx="100" cy="105" r="32" fill={secondaryColor} opacity="0.85" />
              <circle cx="100" cy="105" r="16" fill="#FFFFFF" opacity="0.95" />
              {/* Radiating Rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="100"
                  y1="105"
                  x2={100 + 48 * Math.cos((deg * Math.PI) / 180)}
                  y2={105 + 48 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  opacity="0.75"
                />
              ))}
            </g>
          )}

          {shapeKind === 4 && (
            // The Mystic Oracle / Eternal Flame (The Magician / High Priestess / Empress)
            <g>
              <path
                d="M100 35 C80 65 65 95 72 130 C78 152 92 165 100 168 C108 165 122 152 128 130 C135 95 120 65 100 35 Z"
                fill={mainColor}
                stroke="#FFFFFF"
                strokeWidth={isVeil ? "2" : "1.2"}
              />
              <path
                d="M100 60 C90 82 82 105 88 128 C92 142 98 148 100 150 C102 148 108 142 112 128 C118 105 110 82 100 60 Z"
                fill={secondaryColor}
                opacity="0.85"
              />
              <circle cx="100" cy="115" r="9" fill="#FFFFFF" opacity="0.95" />
            </g>
          )}
        </g>

        {/* 6. Foreground Filigree Frame for Moon & Veil Tiers */}
        {isVeil ? (
          <g stroke="#F2C14E" strokeWidth="1" fill="none" opacity="0.85">
            {/* Corner Ornamental Arches */}
            <path d="M 12 25 A 15 15 0 0 1 27 10" />
            <path d="M 188 25 A 15 15 0 0 0 173 10" />
            <path d="M 12 175 A 15 15 0 0 0 27 190" />
            <path d="M 188 175 A 15 15 0 0 1 173 190" />
            <circle cx="100" cy="12" r="3" fill="#F2C14E" />
            <circle cx="100" cy="188" r="3" fill="#F2C14E" />
          </g>
        ) : isMoon ? (
          <g stroke={secondaryColor} strokeWidth="0.8" fill="none" opacity="0.6">
            <circle cx="20" cy="20" r="4" />
            <circle cx="180" cy="20" r="4" />
            <circle cx="20" cy="180" r="4" />
            <circle cx="180" cy="180" r="4" />
          </g>
        ) : null}
      </svg>
    </div>
  );
};
