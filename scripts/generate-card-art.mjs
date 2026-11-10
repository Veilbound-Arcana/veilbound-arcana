import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDirs = [
  path.resolve(__dirname, "../frontend/public/cards/art"),
  path.resolve(__dirname, "../assets/art")
];

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Common SVG Defs for luxury golden gothic foil styling
const SVG_DEFS = `
<defs>
  <!-- Foil & Metallic Gradients -->
  <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#bf953f" />
    <stop offset="25%" stop-color="#fcf6ba" />
    <stop offset="50%" stop-color="#b38728" />
    <stop offset="75%" stop-color="#fbf5b7" />
    <stop offset="100%" stop-color="#aa771c" />
  </linearGradient>
  <linearGradient id="antiqueGold" x1="0%" y1="100%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#785918" />
    <stop offset="50%" stop-color="#d4af37" />
    <stop offset="100%" stop-color="#593e10" />
  </linearGradient>
  <linearGradient id="cosmicPurple" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#180b2b" />
    <stop offset="50%" stop-color="#2a0845" />
    <stop offset="100%" stop-color="#0b0217" />
  </linearGradient>
  <linearGradient id="fireGlow" x1="0%" y1="100%" x2="0%" y2="0%">
    <stop offset="0%" stop-color="#4a0e0e" />
    <stop offset="50%" stop-color="#8a1c14" />
    <stop offset="100%" stop-color="#ff6b35" />
  </linearGradient>
  <linearGradient id="waterGlow" x1="0%" y1="100%" x2="0%" y2="0%">
    <stop offset="0%" stop-color="#071b2f" />
    <stop offset="50%" stop-color="#0f3b5f" />
    <stop offset="100%" stop-color="#2a9d8f" />
  </linearGradient>
  <linearGradient id="airGlow" x1="0%" y1="100%" x2="0%" y2="0%">
    <stop offset="0%" stop-color="#141e30" />
    <stop offset="50%" stop-color="#243b55" />
    <stop offset="100%" stop-color="#70e1f5" />
  </linearGradient>
  <linearGradient id="earthGlow" x1="0%" y1="100%" x2="0%" y2="0%">
    <stop offset="0%" stop-color="#1a1c14" />
    <stop offset="50%" stop-color="#2c3520" />
    <stop offset="100%" stop-color="#8a9a5b" />
  </linearGradient>
  <linearGradient id="legendaryAether" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#240046" />
    <stop offset="30%" stop-color="#3c096c" />
    <stop offset="70%" stop-color="#7b2cbf" />
    <stop offset="100%" stop-color="#ff9e00" />
  </linearGradient>

  <!-- Ornate Border Pattern & Filters -->
  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="3" result="blur" />
    <feComposite in="SourceGraphic" in2="blur" operator="over" />
  </filter>
  <pattern id="sacredGrid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d4af37" stroke-width="0.5" opacity="0.15" />
    <circle cx="20" cy="20" r="8" fill="none" stroke="#d4af37" stroke-width="0.4" opacity="0.2" />
  </pattern>
</defs>
`;

function generateCardFrame(title, roman, subtitle, bgGrad) {
  return `
  <!-- Card Background -->
  <rect width="400" height="600" rx="20" fill="url(#${bgGrad})" />
  <rect width="400" height="600" rx="20" fill="url(#sacredGrid)" />

  <!-- Outer Ornate Gold Border -->
  <rect x="15" y="15" width="370" height="570" rx="14" fill="none" stroke="url(#goldFoil)" stroke-width="2.5" />
  <rect x="22" y="22" width="356" height="556" rx="10" fill="none" stroke="url(#antiqueGold)" stroke-width="1" stroke-dasharray="6,3" />

  <!-- Corner Flourishes -->
  <g fill="none" stroke="url(#goldFoil)" stroke-width="1.8">
    <!-- Top-Left -->
    <path d="M 28 48 L 28 28 L 48 28" />
    <circle cx="38" cy="38" r="4" fill="url(#goldFoil)" />
    <!-- Top-Right -->
    <path d="M 372 48 L 372 28 L 352 28" />
    <circle cx="362" cy="38" r="4" fill="url(#goldFoil)" />
    <!-- Bottom-Left -->
    <path d="M 28 552 L 28 572 L 48 572" />
    <circle cx="38" cy="562" r="4" fill="url(#goldFoil)" />
    <!-- Bottom-Right -->
    <path d="M 372 552 L 372 572 L 352 572" />
    <circle cx="362" cy="562" r="4" fill="url(#goldFoil)" />
  </g>

  <!-- Top Banner: Roman Numeral / Rank -->
  <g transform="translate(200, 52)">
    <path d="M -60 -16 L 60 -16 L 70 4 L 60 24 L -60 24 L -70 4 Z" fill="#09090b" stroke="url(#goldFoil)" stroke-width="1.5" />
    <text x="0" y="8" font-family="Cinzel, Georgia, serif" font-size="14" font-weight="bold" fill="url(#goldFoil)" text-anchor="middle" letter-spacing="3">${roman}</text>
  </g>

  <!-- Bottom Banner: Card Name -->
  <g transform="translate(200, 535)">
    <path d="M -130 -18 L 130 -18 L 145 5 L 130 28 L -130 28 L -145 5 Z" fill="#09090b" stroke="url(#goldFoil)" stroke-width="1.8" />
    <text x="0" y="3" font-family="Cinzel, Georgia, serif" font-size="15" font-weight="bold" fill="url(#goldFoil)" text-anchor="middle" letter-spacing="1.5">${title.toUpperCase()}</text>
    <text x="0" y="20" font-family="Cinzel, Georgia, serif" font-size="9" fill="#d4af37" text-anchor="middle" letter-spacing="2" opacity="0.85">${subtitle.toUpperCase()}</text>
  </g>
  `;
}

// Artwork generators for cards
const CARDS_DATA = [
  // Wands (Fire)
  {
    id: 1, title: "Page of Wands", roman: "PAGE", sub: "Minor Arcana · Wands", bg: "fireGlow",
    art: `
      <!-- Wand staff & sacred flame -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="95" fill="none" stroke="url(#goldFoil)" stroke-width="1" opacity="0.4" />
        <circle cx="0" cy="0" r="80" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Sunburst rays -->
        <g stroke="url(#goldFoil)" stroke-width="1" opacity="0.6">
          <line x1="0" y1="-75" x2="0" y2="-90" />
          <line x1="53" y1="-53" x2="64" y2="-64" />
          <line x1="75" y1="0" x2="90" y2="0" />
          <line x1="53" y1="53" x2="64" y2="64" />
          <line x1="0" y1="75" x2="0" y2="90" />
          <line x1="-53" y1="53" x2="-64" y2="64" />
          <line x1="-75" y1="0" x2="-90" y2="0" />
          <line x1="-53" y1="-53" x2="-64" y2="-64" />
        </g>
        <!-- The Staff of Fire -->
        <path d="M -6 70 L 6 70 L 4 -40 L 8 -45 L 0 -70 L -8 -45 L -4 -40 Z" fill="url(#goldFoil)" />
        <!-- Floating flame crest -->
        <path d="M 0 -65 C 15 -50 20 -30 0 -15 C -20 -30 -15 -50 0 -65 Z" fill="#ff7b00" filter="url(#goldGlow)" />
        <circle cx="0" cy="-40" r="6" fill="#fff5cc" />
        <!-- Crossed budding branches -->
        <path d="M -25 10 Q 0 -10 25 10" stroke="url(#goldFoil)" stroke-width="2" fill="none" />
        <path d="M -20 30 Q 0 10 20 30" stroke="url(#goldFoil)" stroke-width="2" fill="none" />
      </g>
    `
  },
  {
    id: 2, title: "Knight of Wands", roman: "KNIGHT", sub: "Minor Arcana · Wands", bg: "fireGlow",
    art: `
      <!-- Charging Fire Steed Motif & Sceptre -->
      <g transform="translate(200, 280)">
        <polygon points="0,-100 85,-30 55,80 -55,80 -85,-30" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <path d="M -45 50 Q -10 -60 45 -40 Q 60 10 10 70 Z" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Blazing Lance -->
        <line x1="-60" y1="70" x2="60" y2="-70" stroke="url(#goldFoil)" stroke-width="4" />
        <polygon points="60,-70 75,-85 50,-80" fill="url(#goldFoil)" />
        <!-- Salamander Fire Crest -->
        <circle cx="0" cy="0" r="30" fill="none" stroke="url(#goldFoil)" stroke-width="1.5" stroke-dasharray="4,2" />
        <path d="M 0 -25 C 20 -10 20 15 0 25 C -20 15 -20 -10 0 -25 Z" fill="#ff4d00" />
      </g>
    `
  },
  {
    id: 3, title: "Queen of Wands", roman: "QUEEN", sub: "Minor Arcana · Wands", bg: "fireGlow",
    art: `
      <!-- Royal Throne, Black Cat & Sunflower Emblem -->
      <g transform="translate(200, 280)">
        <rect x="-80" y="-85" width="160" height="170" rx="8" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Golden Sunflower -->
        <circle cx="0" cy="-20" r="36" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
        <g stroke="url(#goldFoil)" stroke-width="1.5">
          <circle cx="0" cy="-20" r="14" fill="url(#goldFoil)" />
          <path d="M 0 -56 L 0 16 M -36 -20 L 36 -20 M -25 -45 L 25 5 M -25 5 L 25 -45" />
        </g>
        <!-- Queen's Crown -->
        <path d="M -30 -60 L -15 -80 L 0 -65 L 15 -80 L 30 -60 Z" fill="url(#goldFoil)" />
        <!-- Sceptre of Command -->
        <line x1="45" y1="70" x2="45" y2="-60" stroke="url(#goldFoil)" stroke-width="3" />
        <circle cx="45" cy="-65" r="7" fill="url(#goldFoil)" />
      </g>
    `
  },
  {
    id: 4, title: "King of Wands", roman: "KING", sub: "Minor Arcana · Wands", bg: "fireGlow",
    art: `
      <!-- Imperial Fire Throne & Salamander Ouroboros -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="90" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2.5" />
        <!-- Salamander swallowing tail -->
        <circle cx="0" cy="0" r="72" fill="none" stroke="url(#goldFoil)" stroke-width="3" stroke-dasharray="12,4" />
        <!-- Grand Crown of Flames -->
        <path d="M -45 -35 L -35 -75 L -15 -50 L 0 -85 L 15 -50 L 35 -75 L 45 -35 Z" fill="url(#goldFoil)" />
        <!-- Blazing Orb & Pillar -->
        <circle cx="0" cy="15" r="22" fill="#ff7700" stroke="url(#goldFoil)" stroke-width="2" />
        <line x1="-60" y1="65" x2="60" y2="65" stroke="url(#goldFoil)" stroke-width="2.5" />
        <line x1="-40" y1="75" x2="40" y2="75" stroke="url(#goldFoil)" stroke-width="2" />
      </g>
    `
  },

  // Cups (Water)
  {
    id: 5, title: "Page of Cups", roman: "PAGE", sub: "Minor Arcana · Cups", bg: "waterGlow",
    art: `
      <!-- Holy Grail with leaping cosmic fish -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="88" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Sea waves at base -->
        <path d="M -70 50 Q -35 30 0 50 Q 35 70 70 50 L 70 75 L -70 75 Z" fill="none" stroke="url(#goldFoil)" stroke-width="1.8" />
        <!-- The Chalice -->
        <path d="M -30 -20 Q 0 -40 30 -20 L 25 15 Q 0 35 -25 15 Z" fill="url(#goldFoil)" />
        <path d="M -6 18 L 6 18 L 10 45 L -10 45 Z" fill="url(#goldFoil)" />
        <ellipse cx="0" cy="48" rx="26" ry="6" fill="url(#goldFoil)" />
        <!-- Leaping Fish Motif -->
        <path d="M -8 -45 C 15 -60 25 -35 0 -22 C -8 -28 -12 -38 -8 -45 Z" fill="#2ec4b6" stroke="url(#goldFoil)" stroke-width="1.2" />
        <!-- Pearl drops -->
        <circle cx="-15" cy="-35" r="3" fill="#ffffff" />
        <circle cx="15" cy="-45" r="2.5" fill="#ffffff" />
      </g>
    `
  },
  {
    id: 6, title: "Knight of Cups", roman: "KNIGHT", sub: "Minor Arcana · Cups", bg: "waterGlow",
    art: `
      <!-- Winged Helmet & The River of Intuition -->
      <g transform="translate(200, 280)">
        <polygon points="0,-95 80,-30 60,75 -60,75 -80,-30" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Winged Visor -->
        <path d="M -50 -30 Q 0 -60 50 -30 Q 0 0 -50 -30 Z" fill="url(#goldFoil)" />
        <!-- Golden Chalice held high -->
        <path d="M -18 0 Q 0 -15 18 0 L 15 25 Q 0 38 -15 25 Z" fill="url(#goldFoil)" />
        <rect x="-4" y="26" width="8" height="20" fill="url(#goldFoil)" />
        <ellipse cx="0" cy="48" rx="16" ry="5" fill="url(#goldFoil)" />
        <!-- Waves of destiny -->
        <path d="M -60 -70 Q 0 -95 60 -70" stroke="url(#goldFoil)" stroke-width="1.5" fill="none" stroke-dasharray="5,3" />
      </g>
    `
  },
  {
    id: 7, title: "Queen of Cups", roman: "QUEEN", sub: "Minor Arcana · Cups", bg: "waterGlow",
    art: `
      <!-- Ocean Throne, Sacred Scallop & Enclosed Cup -->
      <g transform="translate(200, 280)">
        <rect x="-80" y="-85" width="160" height="170" rx="10" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Sea Scallop Shell Halo -->
        <path d="M -55 -20 Q 0 -85 55 -20 Z" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
        <path d="M 0 -85 L -35 -20 M 0 -85 L 35 -20 M 0 -85 L -15 -20 M 0 -85 L 15 -20" stroke="url(#goldFoil)" stroke-width="1" />
        <!-- Sacred Sealed Chalice -->
        <path d="M -26 -10 C -26 25 26 25 26 -10 Z" fill="url(#goldFoil)" />
        <!-- Cherub handles -->
        <path d="M -26 -5 Q -40 -15 -26 -25 M 26 -5 Q 40 -15 26 -25" stroke="url(#goldFoil)" stroke-width="2" fill="none" />
        <path d="M -5 18 L 5 18 L 8 45 L -8 45 Z" fill="url(#goldFoil)" />
        <ellipse cx="0" cy="48" rx="24" ry="7" fill="url(#goldFoil)" />
      </g>
    `
  },
  {
    id: 8, title: "King of Cups", roman: "KING", sub: "Minor Arcana · Cups", bg: "waterGlow",
    art: `
      <!-- Floating Throne in Ocean Tempest & Sea Serpent -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="90" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2.5" />
        <!-- Cresting sea storm -->
        <path d="M -80 40 Q -40 10 0 40 Q 40 70 80 40 L 80 85 L -80 85 Z" fill="#003566" opacity="0.6" />
        <path d="M -75 35 Q -35 5 0 35 Q 35 65 75 35" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Grand Regal Cup of the Depths -->
        <path d="M -32 -25 Q 0 -45 32 -25 L 26 12 Q 0 35 -26 12 Z" fill="url(#goldFoil)" />
        <line x1="0" y1="16" x2="0" y2="45" stroke="url(#goldFoil)" stroke-width="5" />
        <ellipse cx="0" cy="48" rx="25" ry="6" fill="url(#goldFoil)" />
        <!-- Crown of Coral -->
        <path d="M -25 -40 L -15 -65 L 0 -48 L 15 -65 L 25 -40 Z" fill="url(#goldFoil)" />
      </g>
    `
  },

  // Swords (Air)
  {
    id: 9, title: "Page of Swords", roman: "PAGE", sub: "Minor Arcana · Swords", bg: "airGlow",
    art: `
      <!-- Sentinel of the Gale & Rising Blade -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="90" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Swirling astral winds -->
        <path d="M -70 -40 Q 0 -80 70 -40 Q 0 0 -70 40 Q 0 80 70 40" fill="none" stroke="url(#goldFoil)" stroke-width="1.2" stroke-dasharray="6,4" />
        <!-- The Broadsword -->
        <line x1="0" y1="75" x2="0" y2="-75" stroke="url(#goldFoil)" stroke-width="4" />
        <!-- Sword Blade Highlight -->
        <polygon points="0,-82 -8,-68 0,45 8,-68" fill="#ffffff" opacity="0.8" />
        <line x1="-25" y1="45" x2="25" y2="45" stroke="url(#goldFoil)" stroke-width="4" />
        <circle cx="0" cy="80" r="6" fill="url(#goldFoil)" />
      </g>
    `
  },
  {
    id: 10, title: "Knight of Swords", roman: "KNIGHT", sub: "Minor Arcana · Swords", bg: "airGlow",
    art: `
      <!-- Thunderclap, Charging Falcon & Cleaving Blade -->
      <g transform="translate(200, 280)">
        <polygon points="0,-100 85,-30 55,80 -55,80 -85,-30" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Lightning Strike -->
        <path d="M 45 -85 L 15 -25 L 35 -20 L -5 50" stroke="#70e1f5" stroke-width="2.5" fill="none" filter="url(#goldGlow)" />
        <!-- Diagonally Slicing Sword -->
        <line x1="-65" y1="65" x2="65" y2="-65" stroke="url(#goldFoil)" stroke-width="4" />
        <polygon points="65,-65 80,-75 60,-80" fill="url(#goldFoil)" />
        <circle cx="-68" cy="68" r="6" fill="url(#goldFoil)" />
        <!-- Wind vortex -->
        <circle cx="0" cy="0" r="45" fill="none" stroke="url(#goldFoil)" stroke-width="1.5" stroke-dasharray="8,5" />
      </g>
    `
  },
  {
    id: 11, title: "Queen of Swords", roman: "QUEEN", sub: "Minor Arcana · Swords", bg: "airGlow",
    art: `
      <!-- Cloud Throne, Winged Monarch & Sword of Truth -->
      <g transform="translate(200, 280)">
        <rect x="-80" y="-85" width="160" height="170" rx="10" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Butterfly Wing Crown -->
        <path d="M 0 -35 Q -35 -65 -15 -85 Q 0 -60 0 -35 Q 0 -60 15 -85 Q 35 -65 0 -35 Z" fill="url(#goldFoil)" />
        <!-- The Upright Sword of Reason -->
        <line x1="30" y1="65" x2="30" y2="-50" stroke="url(#goldFoil)" stroke-width="3" />
        <polygon points="30,-60 25,-48 35,-48" fill="#ffffff" />
        <line x1="18" y1="40" x2="42" y2="40" stroke="url(#goldFoil)" stroke-width="3" />
        <!-- Raised palm of peace -->
        <circle cx="-30" cy="0" r="14" fill="none" stroke="url(#goldFoil)" stroke-width="1.8" />
        <circle cx="-30" cy="0" r="4" fill="url(#goldFoil)" />
      </g>
    `
  },
  {
    id: 12, title: "King of Swords", roman: "KING", sub: "Minor Arcana · Swords", bg: "airGlow",
    art: `
      <!-- High Tribunal Throne & Dual Crescent Moons -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="92" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2.5" />
        <!-- Dual Cherub Crescents -->
        <path d="M -65 -25 Q -40 -70 -65 -85 Q -30 -60 -30 -25 Z" fill="url(#goldFoil)" />
        <path d="M 65 -25 Q 40 -70 65 -85 Q 30 -60 30 -25 Z" fill="url(#goldFoil)" />
        <!-- The Sword of Judgment -->
        <line x1="0" y1="70" x2="0" y2="-65" stroke="url(#goldFoil)" stroke-width="4.5" />
        <polygon points="0,-78 -8,-60 8,-60" fill="#ffffff" />
        <line x1="-28" y1="35" x2="28" y2="35" stroke="url(#goldFoil)" stroke-width="4" />
        <circle cx="0" cy="74" r="7" fill="url(#goldFoil)" />
      </g>
    `
  },

  // Pentacles (Earth)
  {
    id: 13, title: "Page of Pentacles", roman: "PAGE", sub: "Minor Arcana · Pentacles", bg: "earthGlow",
    art: `
      <!-- The Golden Coin of Manifestation & Sacred Grove -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="90" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Floating Pentacle Coin -->
        <circle cx="0" cy="-20" r="48" fill="#141c10" stroke="url(#goldFoil)" stroke-width="3" />
        <polygon points="0,-64 28,-2 46,-56 -16,-20 44,-20 -18,-56" stroke="url(#goldFoil)" stroke-width="2.5" fill="none" />
        <!-- Sprouting Wheat Sheaf -->
        <path d="M -30 65 Q 0 20 30 65" stroke="url(#goldFoil)" stroke-width="2" fill="none" />
        <path d="M 0 65 L 0 25" stroke="url(#goldFoil)" stroke-width="2" />
      </g>
    `
  },
  {
    id: 14, title: "Knight of Pentacles", roman: "KNIGHT", sub: "Minor Arcana · Pentacles", bg: "earthGlow",
    art: `
      <!-- The Heavy Draft Armor & Fortress Bastion -->
      <g transform="translate(200, 280)">
        <polygon points="0,-95 85,-30 55,80 -55,80 -85,-30" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Bastion Fortress Wall -->
        <rect x="-50" y="25" width="100" height="35" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
        <line x1="-25" y1="25" x2="-25" y2="60" stroke="url(#goldFoil)" stroke-width="1.5" />
        <line x1="0" y1="25" x2="0" y2="60" stroke="url(#goldFoil)" stroke-width="1.5" />
        <line x1="25" y1="25" x2="25" y2="60" stroke="url(#goldFoil)" stroke-width="1.5" />
        <!-- Heavy Shield with Star of Solitude -->
        <circle cx="0" cy="-20" r="38" fill="none" stroke="url(#goldFoil)" stroke-width="2.5" />
        <circle cx="0" cy="-20" r="28" fill="url(#goldFoil)" opacity="0.3" />
        <circle cx="0" cy="-20" r="8" fill="url(#goldFoil)" />
      </g>
    `
  },
  {
    id: 15, title: "Queen of Pentacles", roman: "QUEEN", sub: "Minor Arcana · Pentacles", bg: "earthGlow",
    art: `
      <!-- Throne of Flora, Horn of Plenty & Cosmic Coin -->
      <g transform="translate(200, 280)">
        <rect x="-80" y="-85" width="160" height="170" rx="10" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Crown of Ivy & Vines -->
        <circle cx="0" cy="-60" r="16" fill="none" stroke="url(#goldFoil)" stroke-width="2" stroke-dasharray="4,2" />
        <!-- Large Golden Pentacle in Lap -->
        <circle cx="0" cy="5" r="42" fill="#1b2814" stroke="url(#goldFoil)" stroke-width="2.5" />
        <polygon points="0,-34 25,20 40,-28 -14,2 38,2 -16,-28" stroke="url(#goldFoil)" stroke-width="2" fill="none" />
        <!-- Floral Garland -->
        <path d="M -60 55 Q 0 75 60 55" stroke="url(#goldFoil)" stroke-width="2" fill="none" />
      </g>
    `
  },
  {
    id: 16, title: "King of Pentacles", roman: "KING", sub: "Minor Arcana · Pentacles", bg: "earthGlow",
    art: `
      <!-- Bull of Abundance, Castle Keep & Golden Sceptre -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="92" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2.5" />
        <!-- The Sacred Bull Horns -->
        <path d="M -50 -45 Q -25 -75 0 -45 Q 25 -75 50 -45" stroke="url(#goldFoil)" stroke-width="3" fill="none" />
        <!-- Massive Pentacle Medallion -->
        <circle cx="0" cy="15" r="44" fill="#192e10" stroke="url(#goldFoil)" stroke-width="3" />
        <polygon points="0,-26 26,30 42,-20 -15,12 39,12 -17,-20" stroke="url(#goldFoil)" stroke-width="2.5" fill="none" />
        <circle cx="0" cy="15" r="8" fill="url(#goldFoil)" />
      </g>
    `
  },

  // Major Arcana (Legendary)
  {
    id: 17, title: "The Fool", roman: "0", sub: "Major Arcana · Mystery", bg: "legendaryAether",
    art: `
      <!-- The Precipice, White Rose & Cosmic Portal -->
      <g transform="translate(200, 280)">
        <!-- Cosmic Eclipse Sun -->
        <circle cx="0" cy="-10" r="80" fill="none" stroke="url(#goldFoil)" stroke-width="2.5" />
        <circle cx="0" cy="-10" r="60" fill="#09090b" stroke="url(#goldFoil)" stroke-width="1.5" />
        <!-- The Cliff Edge -->
        <path d="M -80 70 L -10 30 L 80 80 Z" fill="url(#goldFoil)" opacity="0.3" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- White Sacred Rose of Innocence -->
        <circle cx="-15" cy="-25" r="16" fill="none" stroke="#ffffff" stroke-width="2" />
        <circle cx="-15" cy="-25" r="6" fill="#ffffff" />
        <!-- Loyal Companion Hound -->
        <path d="M 25 25 Q 40 10 50 25 L 45 45 Z" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Cosmic Zero Portal Symbol -->
        <ellipse cx="0" cy="-10" rx="30" ry="45" fill="none" stroke="url(#goldFoil)" stroke-width="3" stroke-dasharray="10,5" />
      </g>
    `
  },
  {
    id: 18, title: "The Magician", roman: "I", sub: "Major Arcana · Omni", bg: "legendaryAether",
    art: `
      <!-- Lemniscate Infinity & 4 Elemental Relics -->
      <g transform="translate(200, 280)">
        <!-- Lemniscate Infinity Symbol -->
        <path d="M -40 -60 C -15 -85 15 -35 40 -60 C 65 -85 15 -110 -40 -60 Z" fill="none" stroke="url(#goldFoil)" stroke-width="3.5" filter="url(#goldGlow)" />
        <path d="M 40 -60 C 15 -85 -15 -35 -40 -60 C -65 -85 -15 -110 40 -60 Z" fill="none" stroke="url(#goldFoil)" stroke-width="3.5" filter="url(#goldGlow)" />
        <!-- Altar Table with 4 Relics -->
        <rect x="-70" y="20" width="140" height="45" rx="4" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Wand (Fire) -->
        <line x1="-50" y1="10" x2="-40" y2="-20" stroke="url(#goldFoil)" stroke-width="2.5" />
        <!-- Cup (Water) -->
        <path d="M -22 10 Q -15 0 -8 10 Z" fill="url(#goldFoil)" />
        <!-- Sword (Air) -->
        <line x1="12" y1="-25" x2="12" y2="10" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Pentacle (Earth) -->
        <circle cx="45" cy="0" r="8" fill="none" stroke="url(#goldFoil)" stroke-width="1.8" />
        <!-- Raised Wand to Heaven -->
        <line x1="0" y1="-15" x2="0" y2="-45" stroke="#ffffff" stroke-width="3" />
        <circle cx="0" cy="-48" r="4" fill="#ffffff" filter="url(#goldGlow)" />
      </g>
    `
  },
  {
    id: 19, title: "High Priestess", roman: "II", sub: "Major Arcana · Secret", bg: "legendaryAether",
    art: `
      <!-- Boaz & Jachin Pillars, Pomegranates & Moon Crown -->
      <g transform="translate(200, 280)">
        <!-- Pillar Boaz (B - Darkness/Black) -->
        <rect x="-85" y="-75" width="28" height="150" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2" />
        <text x="-71" y="8" font-family="Cinzel, Georgia, serif" font-size="18" font-weight="bold" fill="url(#goldFoil)" text-anchor="middle">B</text>
        <!-- Pillar Jachin (J - Light/White) -->
        <rect x="57" y="-75" width="28" height="150" fill="#ffffff" stroke="url(#goldFoil)" stroke-width="2" />
        <text x="71" y="8" font-family="Cinzel, Georgia, serif" font-size="18" font-weight="bold" fill="#09090b" text-anchor="middle">J</text>
        <!-- Lunar Horned Isis Crown -->
        <circle cx="0" cy="-55" r="14" fill="url(#goldFoil)" />
        <path d="M -24 -70 Q 0 -45 24 -70 Q 0 -95 -24 -70 Z" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
        <!-- Scroll of Divine Law (TORA) -->
        <rect x="-25" y="10" width="50" height="24" rx="4" fill="#fdfbf7" stroke="url(#goldFoil)" stroke-width="1.5" />
        <text x="0" y="26" font-family="Cinzel, Georgia, serif" font-size="10" font-weight="bold" fill="#09090b" text-anchor="middle" letter-spacing="2">TORA</text>
        <!-- Crescent Moon at Feet -->
        <path d="M -35 65 Q 0 85 35 65 Q 0 50 -35 65 Z" fill="url(#goldFoil)" />
      </g>
    `
  },
  {
    id: 20, title: "The World", roman: "XXI", sub: "Major Arcana · Cosmos", bg: "legendaryAether",
    art: `
      <!-- Astral Ouroboros Laurel Wreath & Four Sacred Tetramorphs -->
      <g transform="translate(200, 280)">
        <!-- Cosmic Laurel Wreath Oval -->
        <ellipse cx="0" cy="0" rx="65" ry="85" fill="none" stroke="url(#goldFoil)" stroke-width="4" stroke-dasharray="14,4" filter="url(#goldGlow)" />
        <!-- Dancing Cosmic Maiden Sceptres -->
        <line x1="-25" y1="-30" x2="-25" y2="30" stroke="url(#goldFoil)" stroke-width="3" />
        <circle cx="-25" cy="-32" r="5" fill="#ffffff" />
        <circle cx="-25" cy="32" r="5" fill="#ffffff" />
        <line x1="25" y1="-30" x2="25" y2="30" stroke="url(#goldFoil)" stroke-width="3" />
        <circle cx="25" cy="-32" r="5" fill="#ffffff" />
        <circle cx="25" cy="32" r="5" fill="#ffffff" />
        <!-- Ribbon Ties of Eternity -->
        <path d="M -15 -85 Q 0 -70 15 -85" stroke="url(#goldFoil)" stroke-width="2.5" fill="none" />
        <path d="M -15 85 Q 0 70 15 85" stroke="url(#goldFoil)" stroke-width="2.5" fill="none" />
        <!-- 4 Corner Tetramorph Glyphs (Angel, Eagle, Lion, Bull) -->
        <circle cx="-75" cy="-75" r="9" fill="none" stroke="url(#goldFoil)" stroke-width="1.5" />
        <circle cx="75" cy="-75" r="9" fill="none" stroke="url(#goldFoil)" stroke-width="1.5" />
        <circle cx="-75" cy="75" r="9" fill="none" stroke="url(#goldFoil)" stroke-width="1.5" />
        <circle cx="75" cy="75" r="9" fill="none" stroke="url(#goldFoil)" stroke-width="1.5" />
      </g>
    `
  }
];

// Ornate Card Back Artwork
const CARD_BACK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  ${SVG_DEFS}
  <!-- Card Background -->
  <rect width="400" height="600" rx="20" fill="url(#cosmicPurple)" />
  <rect width="400" height="600" rx="20" fill="url(#sacredGrid)" />

  <!-- Outer Ornate Gold Border -->
  <rect x="15" y="15" width="370" height="570" rx="14" fill="none" stroke="url(#goldFoil)" stroke-width="2.5" />
  <rect x="22" y="22" width="356" height="556" rx="10" fill="none" stroke="url(#antiqueGold)" stroke-width="1" stroke-dasharray="6,3" />

  <!-- Symmetrical Esoteric Mandala -->
  <g transform="translate(200, 300)">
    <!-- Concentric Sacred Rings -->
    <circle cx="0" cy="0" r="130" fill="none" stroke="url(#goldFoil)" stroke-width="1" opacity="0.3" />
    <circle cx="0" cy="0" r="110" fill="none" stroke="url(#goldFoil)" stroke-width="2" stroke-dasharray="10,5" />
    <circle cx="0" cy="0" r="85" fill="#09090b" stroke="url(#goldFoil)" stroke-width="2.5" />

    <!-- 12 Astrological Rays -->
    <g stroke="url(#goldFoil)" stroke-width="1.2" opacity="0.7">
      <line x1="0" y1="-105" x2="0" y2="105" />
      <line x1="-105" y1="0" x2="105" y2="0" />
      <line x1="-74" y1="-74" x2="74" y2="74" />
      <line x1="-74" y1="74" x2="74" y2="-74" />
    </g>

    <!-- Interlocking Hexagram Star of Hermes -->
    <polygon points="0,-70 60,35 -60,35" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
    <polygon points="0,70 60,-35 -60,-35" fill="none" stroke="url(#goldFoil)" stroke-width="2" />

    <!-- Central All-Seeing Eye of Arcana -->
    <path d="M -35 0 Q 0 -25 35 0 Q 0 25 -35 0 Z" fill="#180b2b" stroke="url(#goldFoil)" stroke-width="2" filter="url(#goldGlow)" />
    <circle cx="0" cy="0" r="12" fill="url(#goldFoil)" />
    <circle cx="0" cy="0" r="5" fill="#09090b" />
    <circle cx="-2" cy="-2" r="2" fill="#ffffff" />

    <!-- Top & Bottom Alchemical Moon Crescents -->
    <path d="M -25 -160 Q 0 -130 25 -160 Q 0 -180 -25 -160 Z" fill="url(#goldFoil)" />
    <path d="M -25 160 Q 0 130 25 160 Q 0 180 -25 160 Z" fill="url(#goldFoil)" />
  </g>

  <!-- Arcana Seal Labels -->
  <text x="200" y="55" font-family="Cinzel, Georgia, serif" font-size="12" font-weight="bold" fill="url(#goldFoil)" text-anchor="middle" letter-spacing="4">VEILBOUND</text>
  <text x="200" y="560" font-family="Cinzel, Georgia, serif" font-size="12" font-weight="bold" fill="url(#goldFoil)" text-anchor="middle" letter-spacing="4">ARCANA</text>
</svg>
`;

// Write card back
for (const dir of targetDirs) {
  fs.writeFileSync(path.join(dir, "back.svg"), CARD_BACK_SVG.trim(), "utf-8");
}
console.log("Wrote back.svg");

// Write all 20 cards
CARDS_DATA.forEach((card) => {
  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  ${SVG_DEFS}
  ${generateCardFrame(card.title, card.roman, card.sub, card.bg)}
  ${card.art}
</svg>
`;

  for (const dir of targetDirs) {
    fs.writeFileSync(path.join(dir, `${card.id}.svg`), svgContent.trim(), "utf-8");
  }
  console.log(`Wrote card ${card.id}.svg: ${card.title}`);
});

console.log("All 20 Tarot SVG Artwork Files Generated Successfully without AI Slop!");
