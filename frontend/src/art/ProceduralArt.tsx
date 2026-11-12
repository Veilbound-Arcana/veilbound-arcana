import React from "react";
import { Aspect } from "@/game/types";
import { CONCEPT } from "@/app/concept.config";
import { mulberry32 } from "@/game/rng";

interface ProceduralArtProps {
  cardId: string;
  name: string;
  aspect?: Aspect;
  className?: string;
}

export const ProceduralArt: React.FC<ProceduralArtProps> = ({
  cardId,
  name: _name,
  aspect = "aether",
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

  // Procedural gradient angles & colors
  const angle = Math.floor(r1 * 360);

  // Procedural celestial / spirit particles
  const stars = Array.from({ length: 12 }, () => ({
    cx: Math.floor(rng() * 200),
    cy: Math.floor(rng() * 200),
    r: (rng() * 2 + 1).toFixed(1),
    opacity: (rng() * 0.6 + 0.3).toFixed(2),
  }));

  // Procedural silhouette type: 0 = winged crest, 1 = horned beast, 2 = radiant crystal, 3 = mystic orb
  const shapeKind = Math.floor(r3 * 4);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`grad-${cardId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientTransform={`rotate(${angle})`}
          >
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="60%" stopColor={mainColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <filter id={`glow-${cardId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background */}
        <rect width="200" height="200" fill={`url(#grad-${cardId})`} />

        {/* Constellations */}
        {stars.map((s, idx) => (
          <circle
            key={idx}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#ffffff"
            opacity={s.opacity}
          />
        ))}

        {/* Dynamic mystical silhouette centered in arched frame */}
        <g filter={`url(#glow-${cardId})`} opacity="0.95">
          {shapeKind === 0 && (
            // Winged crest
            <path
              d="M100 45 C70 70 30 60 25 110 C45 115 80 100 100 135 C120 100 155 115 175 110 C170 60 130 70 100 45 Z"
              fill={mainColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          )}

          {shapeKind === 1 && (
            // Horned astral beast
            <path
              d="M100 50 C65 50 60 90 75 120 C85 140 100 155 100 155 C100 155 115 140 125 120 C140 90 135 50 100 50 Z M55 60 C65 85 85 95 90 100 C75 95 65 75 55 60 Z M145 60 C135 85 115 95 110 100 C125 95 135 75 145 60 Z"
              fill={mainColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          )}

          {shapeKind === 2 && (
            // Radiant crystal
            <polygon
              points="100,35 140,80 125,150 100,165 75,150 60,80"
              fill={mainColor}
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}

          {shapeKind === 3 && (
            // Mystic vortex / orb
            <g>
              <circle cx="100" cy="105" r="45" fill={mainColor} />
              <circle cx="100" cy="105" r="30" fill="#ffffff" opacity="0.4" />
              <circle cx="100" cy="105" r="15" fill="#ffffff" opacity="0.8" />
            </g>
          )}
        </g>

        {/* Foreground energy ring */}
        <circle
          cx="100"
          cy="105"
          r="65"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};
