import React from "react";
import { Aspect } from "@/game/types";
import { CONCEPT } from "@/app/concept.config";

interface AspectGlyphProps {
  aspect?: Aspect | "none";
  size?: number;
  className?: string;
  showBg?: boolean;
}

export const AspectGlyph: React.FC<AspectGlyphProps> = ({
  aspect = "aether",
  size = 20,
  className = "",
  showBg = false,
}) => {
  const color =
    aspect !== "none" && aspect ? CONCEPT.ASPECT_COLORS[aspect] : "#8C96A5";

  const renderIcon = () => {
    switch (aspect) {
      case "ember": // Flame mote
        return (
          <path
            d="M12 3C12 3 7 8 7 13C7 16.5 9 19.5 12 21C15 19.5 17 16.5 17 13C17 9.5 13.5 6 12 3Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case "tide": // Wave crest
        return (
          <path
            d="M4 14C7 10 10 10 13 14C16 18 19 15 20 12M5 19C8 16 11 16 14 19"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case "volt": // Forked glint
        return (
          <path
            d="M13 2L6 13H12L11 22L18 11H12L13 2Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case "iron": // Hex bolt
        return (
          <path
            d="M12 3L19 7.5V16.5L12 21L5 16.5V7.5L12 3Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case "verdant": // Sprout
        return (
          <path
            d="M12 21V12M12 12C12 7.5 8 7.5 5 8C5 12 8 13.5 12 12ZM12 12C12 7.5 16 7.5 19 8C19 12 16 13.5 12 12Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case "umbra": // Crescent shadow
        return (
          <path
            d="M15 4C9 4 5 8.5 5 14C5 19.5 9.5 21 13 21C18 21 20 17 20 17C17 17 13 14 13 10C13 6 15 4 15 4Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case "lumen": // Sunburst eye
        return (
          <g stroke={color} strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" fill="none" />
            <path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.9 4.9L7 7M17 17L19.1 19.1M4.9 19.1L7 17M17 7L19.1 4.9" />
          </g>
        );
      case "aether": // Spiral dot
      default:
        return (
          <path
            d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C16 22 19.5 19 19.5 15C19.5 12 17 9.5 14 9.5C11.5 9.5 9.5 11 9.5 13C9.5 14.5 10.5 15.5 12 15.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${
        showBg ? "p-1 rounded-full bg-white/80 shadow-sm" : ""
      } ${className}`}
      style={{ width: size, height: size }}
      title={aspect}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="overflow-visible"
      >
        {renderIcon()}
        {/* Inner glow dot */}
        <circle cx="12" cy="12" r="1.5" fill={color} />
      </svg>
    </div>
  );
};
