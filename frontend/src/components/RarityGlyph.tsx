import React from "react";
import { Rarity } from "@/game/types";

interface RarityGlyphProps {
  rarity: Rarity;
  size?: number;
  className?: string;
}

export const RarityGlyph: React.FC<RarityGlyphProps> = ({
  rarity,
  size = 18,
  className = "",
}) => {
  const getGlyphs = () => {
    switch (rarity) {
      case "rune1":
        return [{ type: "rune", id: 1 }];
      case "rune2":
        return [
          { type: "rune", id: 1 },
          { type: "rune", id: 2 },
        ];
      case "rune3":
        return [
          { type: "rune", id: 1 },
          { type: "rune", id: 2 },
          { type: "rune", id: 3 },
        ];
      case "rune4":
        return [
          { type: "rune", id: 1 },
          { type: "rune", id: 2 },
          { type: "rune", id: 3 },
          { type: "rune", id: 4 },
        ];
      case "moon1":
        return [{ type: "moon", id: 1 }];
      case "moon2":
        return [
          { type: "moon", id: 1 },
          { type: "moon", id: 2 },
        ];
      case "moon3":
        return [
          { type: "moon", id: 1 },
          { type: "moon", id: 2 },
          { type: "moon", id: 3 },
        ];
      case "veil":
        return [{ type: "veil", id: 1 }];
    }
  };

  const glyphs = getGlyphs();

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {glyphs.map((g, idx) => (
        <svg
          key={idx}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className="text-gold fill-gold filter drop-shadow-[0_1px_2px_rgba(242,193,78,0.4)]"
        >
          {g.type === "rune" && (
            <polygon points="12,2 20,8 16,21 8,21 4,8" stroke="#F2C14E" strokeWidth="1.5" />
          )}
          {g.type === "moon" && (
            <path
              d="M14 3C8.5 3 4 7.5 4 13C4 18.5 8.5 23 14 23C12.5 20.5 12 17 12 13C12 9 12.5 5.5 14 3Z"
              stroke="#F2C14E"
              strokeWidth="1.5"
            />
          )}
          {g.type === "veil" && (
            <g stroke="#F2C14E" strokeWidth="1.5" fill="none">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3V21M7 7L17 17M7 17L17 7" />
            </g>
          )}
        </svg>
      ))}
    </div>
  );
};
