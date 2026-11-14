/**
 * Veilbound Arcana — Original Character Illustration Engine
 * --------------------------------------------------------
 * Every card in the game is bound to a fully original character illustration.
 * Profiles are derived deterministically from the card id, then rendered as a
 * layered SVG (scene, silhouette, gear, aura, rarity filigree).
 *
 * This module is intentionally free of JSX and path aliases so the exact same
 * source drives both:
 *   - the offline generator  (scripts/generate-character-art.mjs)
 *   - the live React renderer (src/art/character/CharacterArt.tsx)
 *
 * All characters are original genre archetypes (vanguard, arcanist, beast,
 * ranger, guardian, assassin, mystic, colossus, wyrm, dancer). No third-party
 * intellectual property is referenced, copied, or implied.
 */

export type AspectName =
  | "ember"
  | "tide"
  | "verdant"
  | "volt"
  | "umbra"
  | "lumen"
  | "iron"
  | "aether";

export type RarityName =
  | "rune1"
  | "rune2"
  | "rune3"
  | "rune4"
  | "moon1"
  | "moon2"
  | "moon3"
  | "veil";

export type CharacterClass =
  | "vanguard"
  | "arcanist"
  | "beast"
  | "ranger"
  | "guardian"
  | "assassin"
  | "mystic"
  | "colossus"
  | "wyrm"
  | "dancer";

export type CharacterPose =
  | "ready"
  | "charge"
  | "cast"
  | "aim"
  | "guard";

export interface CharacterPalette {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}

export interface CharacterProfile {
  cardId: string;
  name: string;
  aspect: AspectName;
  rarity: RarityName;
  cls: CharacterClass;
  pose: CharacterPose;
  weapon: string;
  title: string;
  palette: CharacterPalette;
  scene: string;
  seed: number;
  crowned: boolean;
  /** Silhouette variant 0-3: changes proportions and worn accessories. */
  variant: number;
  /** Width multiplier for the body silhouette. */
  bulk: number;
  /** Uniform scale multiplier applied about the ground point. */
  scale: number;
}

export interface CardRef {
  id: string;
  name: string;
  aspect?: AspectName;
  rarity: RarityName;
  tarotArchetype?: string;
  number?: number;
  crowned?: boolean;
}

export const CHARACTER_CLASSES: CharacterClass[] = [
  "vanguard",
  "arcanist",
  "beast",
  "ranger",
  "guardian",
  "assassin",
  "mystic",
  "colossus",
  "wyrm",
  "dancer",
];

export const CHARACTER_POSES: CharacterPose[] = [
  "ready",
  "charge",
  "cast",
  "aim",
  "guard",
];

export const CLASS_LABEL: Record<CharacterClass, string> = {
  vanguard: "Vanguard",
  arcanist: "Arcanist",
  beast: "Wildkin",
  ranger: "Ranger",
  guardian: "Guardian",
  assassin: "Assassin",
  mystic: "Mystic",
  colossus: "Colossus",
  wyrm: "Wyrm",
  dancer: "Blade Dancer",
};

export const POSE_LABEL: Record<CharacterPose, string> = {
  ready: "Combat Ready",
  charge: "Charging",
  cast: "Channeling",
  aim: "Aiming",
  guard: "Guarding",
};

export const CLASS_WEAPONS: Record<CharacterClass, string[]> = {
  vanguard: ["greatsword", "warblade", "cleaver"],
  arcanist: ["rune staff", "orb scepter", "spiral wand"],
  beast: ["horns & claws", "mane & fangs", "tail blade"],
  ranger: ["longbow", "recurve bow", "twin shortbows"],
  guardian: ["tower shield & hammer", "bastion shield", "rammer"],
  assassin: ["twin daggers", "serrated fangs", "weighted blades"],
  mystic: ["floating orbs", "spirit lantern", "prayer beads"],
  colossus: ["stone fists", "rune hammer", "boulder arms"],
  wyrm: ["tail & wing", "fanged maw", "storm crest"],
  dancer: ["twin curved blades", "ribbon glaives", "moon sickles"],
};

const ASPECTS: AspectName[] = [
  "ember",
  "tide",
  "verdant",
  "volt",
  "umbra",
  "lumen",
  "iron",
  "aether",
];

const ASPECT_PALETTE: Record<AspectName, CharacterPalette> = {
  ember: { primary: "#F26B3A", secondary: "#FF9F43", accent: "#FFD36E", glow: "#FF7A3D" },
  tide: { primary: "#3B9DF2", secondary: "#00D2D3", accent: "#BFEFFF", glow: "#4FC3F7" },
  verdant: { primary: "#5CBF4A", secondary: "#10AC84", accent: "#D7F79B", glow: "#7ED957" },
  volt: { primary: "#F2C21B", secondary: "#FFF275", accent: "#FFFFFF", glow: "#FFE45C" },
  umbra: { primary: "#6B4FA0", secondary: "#8854D0", accent: "#C9B6FF", glow: "#9B6DFF" },
  lumen: { primary: "#F4E7A1", secondary: "#FFF7D6", accent: "#FFFFFF", glow: "#FFF0B3" },
  iron: { primary: "#8C96A5", secondary: "#A5B1C2", accent: "#E8EDF5", glow: "#C3CCDA" },
  aether: { primary: "#5DD6C8", secondary: "#48DBFB", accent: "#E0FFFB", glow: "#7AF0E0" },
};

const ASPECT_SCENE: Record<AspectName, string> = {
  ember: "emberfield",
  tide: "tidepool",
  verdant: "thornGrove",
  volt: "stormSpire",
  umbra: "umbralCrypt",
  lumen: "lumenShrine",
  iron: "ironBastion",
  aether: "aetherRift",
};

const RARITY_TIER: Record<RarityName, number> = {
  rune1: 1,
  rune2: 2,
  rune3: 3,
  rune4: 4,
  moon1: 5,
  moon2: 6,
  moon3: 7,
  veil: 8,
};

/* ------------------------------------------------------------------ */
/* Deterministic PRNG (Mulberry32) — local copy so node can run this   */
/* ------------------------------------------------------------------ */

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Profile derivation                                                  */
/* ------------------------------------------------------------------ */

export function profileForCard(card: CardRef): CharacterProfile {
  const seed = hashString(card.id + "|" + card.name);
  const rng = mulberry32(seed);
  const num = card.number ?? seed % 100;

  const aspect: AspectName = card.aspect ?? ASPECTS[seed % ASPECTS.length];
  const cls: CharacterClass = CHARACTER_CLASSES[(seed + num) % CHARACTER_CLASSES.length];
  const pose: CharacterPose = CHARACTER_POSES[Math.floor(rng() * CHARACTER_POSES.length)];
  const weapons = CLASS_WEAPONS[cls];
  const weapon = weapons[Math.floor(rng() * weapons.length)];

  const palette = ASPECT_PALETTE[aspect];
  const rarityAccent =
    card.rarity === "veil"
      ? "#F2C14E"
      : card.rarity.startsWith("moon")
      ? "#D9DEFF"
      : palette.accent;

  return {
    cardId: card.id,
    name: card.name,
    aspect,
    rarity: card.rarity,
    cls,
    pose,
    weapon,
    title: `${aspect.charAt(0).toUpperCase()}${aspect.slice(1)} ${CLASS_LABEL[cls]}`,
    palette: { ...palette, accent: rarityAccent },
    scene: ASPECT_SCENE[aspect],
    seed,
    crowned: !!card.crowned || card.rarity === "veil",
    variant: Math.floor(rng() * 4),
    bulk: 0.86 + rng() * 0.34,
    scale: 0.93 + rng() * 0.15,
  };
}

export function characterTitle(p: CharacterProfile): string {
  return p.title;
}

/* ------------------------------------------------------------------ */
/* SVG helpers                                                         */
/* ------------------------------------------------------------------ */

const n = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Merges a fixed attribute string with an optional override string,
 * dropping any fixed attribute the override redefines. Keeps generated
 * SVG well-formed (no duplicate attributes) when a caller passes
 * e.g. fill="none" through the override slot.
 */
const mergeAttrs = (base: string, extra: string): string => {
  if (!extra) return base;
  const keys = new Set<string>();
  const re = /([a-zA-Z-]+)\s*=/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(extra)) !== null) keys.add(m[1]);
  const kept = base.replace(
    /([a-zA-Z-]+)\s*=\s*"[^"]*"/g,
    (whole, k: string) => (keys.has(k) ? "" : whole)
  );
  return `${kept} ${extra}`;
};

const path = (d: string, fill: string, extra = ""): string =>
  `<path d="${d}" ${mergeAttrs(`fill="${fill}"`, extra)}></path>`;

const circle = (cx: number, cy: number, r: number, fill: string, extra = ""): string =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" ${mergeAttrs(`fill="${fill}"`, extra)}></circle>`;

const ellipse = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  fill: string,
  extra = ""
): string =>
  `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" ${mergeAttrs(
    `fill="${fill}"`,
    extra
  )}></ellipse>`;

const line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  w: number,
  extra = ""
): string =>
  `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" ${mergeAttrs(
    `stroke="${stroke}" stroke-width="${n(w)}" stroke-linecap="round"`,
    extra
  )}></line>`;

const pts = (list: Array<[number, number]>): string =>
  list.map(([x, y]) => `${n(x)},${n(y)}`).join(" ");

const poly = (list: Array<[number, number]>, fill: string, extra = ""): string =>
  `<polygon points="${pts(list)}" ${mergeAttrs(`fill="${fill}"`, extra)}></polygon>`;

interface Pt {
  x: number;
  y: number;
}

/** Hand anchor points per pose (right hand = weapon hand). */
function handPoint(pose: CharacterPose, side: 1 | -1, sw: number): Pt {
  const table: Record<CharacterPose, Pt> = {
    ready: { x: 200 + side * (sw + 34), y: 330 },
    charge: { x: 200 + side * (sw + 62), y: 252 },
    cast: { x: 200 + side * (sw + 60), y: 268 },
    aim: { x: 200 + side * (sw + 68), y: 238 },
    guard: { x: 200 + side * (sw + 40), y: 306 },
  };
  const p = table[pose];
  return { x: p.x, y: p.y };
}

/* Left-hand mirror of the weapon hand. */
function mirror(p: Pt): Pt {
  return { x: 400 - p.x, y: p.y };
}

/* ------------------------------------------------------------------ */
/* Scene backgrounds                                                   */
/* ------------------------------------------------------------------ */

function buildScene(p: CharacterProfile, uid: string): string {
  const { primary, secondary, accent } = p.palette;
  const rng = mulberry32(p.seed ^ 0x9e3779b9);
  let out = "";

  // Base wash
  out += `<rect x="0" y="0" width="400" height="560" fill="url(#va-bg-${uid})"></rect>`;

  // Horizon glow
  out += ellipse(200, 330, 210, 150, `url(#va-halo-${uid})`, 'class="va-aura"');

  const shards: string[] = [];
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(rng() * 400);
    const y = Math.floor(rng() * 560);
    const r = (rng() * 2.2 + 0.6).toFixed(2);
    shards.push(circle(x, y, parseFloat(r), accent, `opacity="${(rng() * 0.55 + 0.25).toFixed(2)}"`));
  }

  switch (p.scene) {
    case "emberfield": {
      out += poly([[0, 560], [0, 430], [70, 380], [150, 420], [230, 372], [320, 412], [400, 368], [400, 560]], "#1A0B10");
      for (let i = 0; i < 7; i++) {
        const x = 30 + rng() * 340;
        const h = 24 + rng() * 46;
        out += path(`M${n(x)} 470 q${n(6 + rng() * 8)} ${n(-h)} ${n(2 + rng() * 5)} ${n(-h * 1.6)} q${n(-8)} ${n(h * 0.7)} ${n(-3)} ${n(h * 1.6)} Z`, primary, 'opacity="0.5"');
      }
      break;
    }
    case "tidepool": {
      for (let i = 0; i < 5; i++) {
        const y = 430 + i * 26;
        out += `<path d="M0 ${n(y)} C 80 ${n(y - 18)} 140 ${n(y + 18)} 200 ${n(y)} S 330 ${n(y - 18)} 400 ${n(y)}" fill="none" stroke="${secondary}" stroke-width="3" opacity="${(0.5 - i * 0.07).toFixed(2)}"></path>`;
      }
      out += ellipse(200, 520, 180, 26, "#04223B", 'opacity="0.75"');
      break;
    }
    case "thornGrove": {
      out += poly([[0, 560], [0, 470], [60, 440], [120, 468], [200, 436], [290, 470], [400, 444], [400, 560]], "#0E1A12");
      for (let i = 0; i < 9; i++) {
        const x = 10 + rng() * 380;
        const h = 60 + rng() * 120;
        out += path(`M${n(x)} 480 C ${n(x - 14)} ${n(480 - h * 0.5)} ${n(x + 16)} ${n(480 - h * 0.7)} ${n(x + 4)} ${n(480 - h)}`, "none", `stroke="${secondary}" stroke-width="4" fill="none" opacity="0.55"`);
      }
      break;
    }
    case "stormSpire": {
      out += poly([[0, 560], [0, 300], [90, 250], [170, 330], [250, 210], [330, 320], [400, 260], [400, 560]], "#12141F");
      out += poly([[150, 560], [250, 210], [330, 560]], "#1B1F2E", 'opacity="0.85"');
      for (let i = 0; i < 4; i++) {
        const x = 60 + rng() * 280;
        out += path(`M${n(x)} ${n(120 + rng() * 60)} l ${n(-12 - rng() * 10)} 34 l ${n(14 + rng() * 8)} 6 l ${n(-18 - rng() * 10)} 32`, "none", `stroke="${accent}" stroke-width="3" fill="none" opacity="0.7"`);
      }
      break;
    }
    case "umbralCrypt": {
      out += poly([[0, 560], [0, 260], [70, 240], [120, 300], [200, 268], [290, 306], [340, 244], [400, 266], [400, 560]], "#150F22");
      for (let i = 0; i < 5; i++) {
        const x = 40 + i * 74;
        out += path(`M${n(x)} 250 L${n(x + 26)} 250 L${n(x + 20)} 470 L${n(x + 6)} 470 Z`, "#1E1630", 'opacity="0.9"');
        out += ellipse(x + 13, 250, 13, 6, "#2A1F42");
      }
      break;
    }
    case "lumenShrine": {
      out += ellipse(200, 470, 190, 60, "#2A2410", 'opacity="0.7"');
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        out += ellipse(200 + Math.cos(a) * 150, 300 + Math.sin(a) * 130, 12, 4, secondary, 'opacity="0.5"');
      }
      out += `<circle cx="200" cy="250" r="120" fill="none" stroke="${accent}" stroke-width="2" opacity="0.35" stroke-dasharray="8 10" class="va-spin"></circle>`;
      break;
    }
    case "ironBastion": {
      out += poly([[0, 560], [0, 330], [60, 330], [60, 280], [130, 280], [130, 350], [200, 350], [200, 260], [270, 260], [270, 350], [340, 350], [340, 300], [400, 300], [400, 560]], "#171B24");
      for (let i = 0; i < 4; i++) {
        out += line(20 + i * 100, 300, 20 + i * 100, 560, "#232936", 6, 'opacity="0.8"');
      }
      break;
    }
    default: {
      // aetherRift — floating geometric shards
      for (let i = 0; i < 8; i++) {
        const x = 30 + rng() * 340;
        const y = 90 + rng() * 330;
        const s = 14 + rng() * 26;
        out += poly([[x, y - s], [x + s, y], [x, y + s], [x - s, y]], secondary, `opacity="${(0.2 + rng() * 0.35).toFixed(2)}"`);
      }
      out += `<circle cx="200" cy="280" r="150" fill="none" stroke="${primary}" stroke-width="2" opacity="0.3" stroke-dasharray="4 12" class="va-spin"></circle>`;
    }
  }

  out += shards.join("");
  return out;
}

/* ------------------------------------------------------------------ */
/* Body construction                                                   */
/* ------------------------------------------------------------------ */

interface BodyOpts {
  sw: number;
  hw: number;
  headR: number;
  limb: number;
  cloth: string;
  clothDark: string;
  armor: string;
  trim: string;
  skin: string;
  handR: Pt;
  handL: Pt;
  lean?: number;
  crouch?: number;
}

function humanoid(o: BodyOpts): string {
  const { sw, hw, headR, limb, cloth, clothDark, armor, trim, skin, handR, handL } = o;
  const lean = o.lean ?? 0;
  const crouch = o.crouch ?? 0;
  const hipY = 344 + crouch;
  const shoulderY = 228 + crouch;
  const headY = shoulderY - 52;

  let g = `<g transform="rotate(${n(lean)} 200 ${n(hipY)})">`;

  // Legs
  g += line(200 - hw * 0.55, hipY, 200 - hw * 0.7 - 2, 474, clothDark, limb);
  g += line(200 + hw * 0.55, hipY, 200 + hw * 0.7 + 2, 474, clothDark, limb);
  // Boots
  g += ellipse(200 - hw * 0.7 - 2, 476, limb * 0.75, limb * 0.42, armor);
  g += ellipse(200 + hw * 0.7 + 2, 476, limb * 0.75, limb * 0.42, armor);

  // Torso
  g += path(
    `M ${n(200 - sw)} ${n(shoulderY)} Q 200 ${n(shoulderY - 18)} ${n(200 + sw)} ${n(shoulderY)} L ${n(200 + hw)} ${n(hipY)} Q 200 ${n(hipY + 14)} ${n(200 - hw)} ${n(hipY)} Z`,
    cloth
  );
  // Chest plate / trim
  g += path(
    `M ${n(200 - sw * 0.82)} ${n(shoulderY + 12)} Q 200 ${n(shoulderY - 2)} ${n(200 + sw * 0.82)} ${n(shoulderY + 12)} L ${n(200 + sw * 0.5)} ${n(shoulderY + 52)} L ${n(200 - sw * 0.5)} ${n(shoulderY + 52)} Z`,
    armor,
    'opacity="0.92"'
  );
  g += line(200, shoulderY + 16, 200, shoulderY + 48, trim, 2.4, 'opacity="0.85"');
  // Belt
  g += `<rect x="${n(200 - hw)}" y="${n(hipY - 12)}" width="${n(hw * 2)}" height="12" rx="5" fill="${clothDark}"></rect>`;
  g += circle(200, hipY - 6, 5, trim);

  // Arms
  g += line(200 - sw, shoulderY + 10, handL.x, handL.y, cloth, limb * 0.86);
  g += line(200 + sw, shoulderY + 10, handR.x, handR.y, cloth, limb * 0.86);
  g += circle(handL.x, handL.y, limb * 0.55, skin);
  g += circle(handR.x, handR.y, limb * 0.55, skin);
  // Pauldrons
  g += ellipse(200 - sw, shoulderY + 8, limb * 0.9, limb * 0.62, armor);
  g += ellipse(200 + sw, shoulderY + 8, limb * 0.9, limb * 0.62, armor);

  // Neck + head
  g += `<rect x="${n(200 - 9)}" y="${n(headY + headR - 6)}" width="18" height="18" rx="6" fill="${skin}"></rect>`;
  g += circle(200, headY, headR, skin);
  // Hood / helmet shadow on the face
  g += ellipse(200, headY + headR * 0.28, headR * 0.72, headR * 0.42, "#2A2038", 'opacity="0.28"');
  // Eyes
  g += ellipse(200 - headR * 0.34, headY - headR * 0.05, 4.6, 6.4, "#1B1426");
  g += ellipse(200 + headR * 0.34, headY - headR * 0.05, 4.6, 6.4, "#1B1426");

  g += "</g>";
  return g;
}

function capePath(sw: number, shoulderY: number, hipY: number, flutter: number): string {
  const l = 200 - sw - 4;
  const r = 200 + sw + 4;
  return `M ${n(l)} ${n(shoulderY - 6)} C ${n(l - 34 - flutter)} ${n(shoulderY + 120)} ${n(l - 20 - flutter)} ${n(hipY + 90)} ${n(l - 6)} 486 L ${n(200)} ${n(470 + flutter * 0.4)} L ${n(r + 6)} 486 C ${n(r + 20 + flutter)} ${n(hipY + 90)} ${n(r + 34 + flutter)} ${n(shoulderY + 120)} ${n(r)} ${n(shoulderY - 6)} Z`;
}

function headgear(cls: CharacterClass, p: CharacterProfile, headY: number, headR: number, sw: number, shoulderY: number): string {
  const { primary, secondary, accent, glow } = p.palette;
  let g = "";

  switch (cls) {
    case "vanguard":
    case "guardian": {
      // Plated helm with crest
      g += `<path d="M ${n(200 - headR - 4)} ${n(headY + 4)} A ${n(headR + 4)} ${n(headR + 4)} 0 0 1 ${n(200 + headR + 4)} ${n(headY + 4)} L ${n(200 + headR + 4)} ${n(headY - 6)} L ${n(200 - headR - 4)} ${n(headY - 6)} Z" fill="${secondary}"></path>`;
      g += `<path d="M ${n(200 - 6)} ${n(headY - headR - 4)} L ${n(200 + 6)} ${n(headY - headR - 4)} L ${n(200 + 2)} ${n(headY - headR - 22)} L ${n(200 - 2)} ${n(headY - headR - 22)} Z" fill="${accent}"></path>`;
      g += line(200, headY - headR - 4, 200, headY - headR - 26, glow, 3);
      break;
    }
    case "arcanist":
    case "mystic": {
      // Deep hood
      g += `<path d="M ${n(200 - headR - 14)} ${n(headY + headR * 0.9)} C ${n(200 - headR - 20)} ${n(headY - headR * 1.5)} ${n(200 + headR + 20)} ${n(headY - headR * 1.5)} ${n(200 + headR + 14)} ${n(headY + headR * 0.9)} L ${n(200 + headR - 2)} ${n(headY + headR * 0.55)} C ${n(200 + headR - 10)} ${n(headY - headR * 0.9)} ${n(200 - headR + 10)} ${n(headY - headR * 0.9)} ${n(200 - headR + 2)} ${n(headY + headR * 0.55)} Z" fill="${primary}"></path>`;
      g += `<circle cx="200" cy="${n(headY - headR - 10)}" r="4" fill="${accent}" class="va-aura"></circle>`;
      break;
    }
    case "assassin": {
      // Cowl + scarf
      g += `<path d="M ${n(200 - headR - 8)} ${n(headY + 6)} C ${n(200 - headR - 12)} ${n(headY - headR * 1.4)} ${n(200 + headR + 12)} ${n(headY - headR * 1.4)} ${n(200 + headR + 8)} ${n(headY + 6)} L ${n(200 + headR - 4)} ${n(headY + headR * 0.4)} L ${n(200 - headR + 4)} ${n(headY + headR * 0.4)} Z" fill="${primary}"></path>`;
      g += `<path d="M ${n(200 - headR)} ${n(headY + headR * 0.55)} Q 200 ${n(headY + headR * 1.15)} ${n(200 + headR)} ${n(headY + headR * 0.55)} L ${n(200 + headR)} ${n(headY + headR * 0.95)} Q 200 ${n(headY + headR * 1.5)} ${n(200 - headR)} ${n(headY + headR * 0.95)} Z" fill="${secondary}" opacity="0.9"></path>`;
      break;
    }
    case "ranger": {
      // Hood with feather
      g += `<path d="M ${n(200 - headR - 10)} ${n(headY + headR * 0.7)} C ${n(200 - headR - 14)} ${n(headY - headR * 1.3)} ${n(200 + headR + 14)} ${n(headY - headR * 1.3)} ${n(200 + headR + 10)} ${n(headY + headR * 0.7)} L ${n(200 + headR - 2)} ${n(headY + headR * 0.2)} L ${n(200 - headR + 2)} ${n(headY + headR * 0.2)} Z" fill="${primary}"></path>`;
      g += path(`M ${n(200 + headR - 2)} ${n(headY - headR * 0.7)} q 14 -18 6 -30 q -16 8 -12 26 Z`, accent);
      break;
    }
    case "dancer": {
      // Hair buns + pins
      g += circle(200 - headR * 0.85, headY - headR * 0.75, headR * 0.42, secondary);
      g += circle(200 + headR * 0.85, headY - headR * 0.75, headR * 0.42, secondary);
      g += line(200 - headR * 1.2, headY - headR * 0.9, 200 - headR * 0.2, headY - headR * 0.5, accent, 3);
      g += line(200 + headR * 1.2, headY - headR * 0.9, 200 + headR * 0.2, headY - headR * 0.5, accent, 3);
      break;
    }
    case "beast":
    case "wyrm": {
      // Horns
      g += path(`M ${n(200 - headR * 0.7)} ${n(headY - headR * 0.5)} q ${n(-16)} ${n(-18)} ${n(-10)} ${n(-30)} q 14 8 18 24 Z`, accent);
      g += path(`M ${n(200 + headR * 0.7)} ${n(headY - headR * 0.5)} q 16 -18 10 -30 q -14 8 -18 24 Z`, accent);
      break;
    }
    case "colossus": {
      // Stone crown slab
      g += `<rect x="${n(200 - headR - 8)}" y="${n(headY - headR - 12)}" width="${n(headR * 2 + 16)}" height="16" rx="6" fill="${secondary}"></rect>`;
      g += line(200 - headR * 0.5, headY - headR - 12, 200 - headR * 0.5, headY - headR - 26, glow, 3, 'opacity="0.8"');
      g += line(200 + headR * 0.5, headY - headR - 12, 200 + headR * 0.5, headY - headR - 26, glow, 3, 'opacity="0.8"');
      break;
    }
    default:
      break;
  }

  // Shoulder silhouette for broad classes
  if (cls === "guardian" || cls === "colossus") {
    g += ellipse(200 - sw - 14, shoulderY + 14, 26, 20, secondary, 'opacity="0.95"');
    g += ellipse(200 + sw + 14, shoulderY + 14, 26, 20, secondary, 'opacity="0.95"');
  }

  if (p.crowned) {
    g += `<g class="va-aura">
      <circle cx="200" cy="${n(headY - headR - 34)}" r="16" fill="none" stroke="${accent}" stroke-width="3"></circle>
      <circle cx="200" cy="${n(headY - headR - 34)}" r="7" fill="${accent}"></circle>
    </g>`;
  }

  return g;
}

function buildWeapon(cls: CharacterClass, p: CharacterProfile, handR: Pt, handL: Pt): string {
  const { primary, secondary, accent } = p.palette;
  const x = handR.x;
  const y = handR.y;
  let g = "";

  switch (cls) {
    case "vanguard": {
      g += line(x, y, x + 18, y - 96, "#3B4256", 9);
      g += path(`M ${n(x + 18)} ${n(y - 132)} L ${n(x + 34)} ${n(y - 96)} L ${n(x + 18)} ${n(y - 62)} L ${n(x + 2)} ${n(y - 96)} Z`, secondary, 'stroke="#FFFFFF" stroke-width="1.6"');
      g += circle(x + 18, y - 96, 5, accent);
      break;
    }
    case "arcanist": {
      g += line(x, y + 26, x + 4, y - 118, "#4A3560", 7);
      g += circle(x + 4, y - 126, 13, `url(#va-orb-${p.cardId})`, 'stroke="#FFFFFF" stroke-width="1.6"');
      g += `<circle cx="${n(x + 4)}" cy="${n(y - 126)}" r="22" fill="none" stroke="${accent}" stroke-width="1.6" stroke-dasharray="4 6" class="va-spin"></circle>`;
      break;
    }
    case "ranger": {
      g += `<path d="M ${n(x + 6)} ${n(y - 96)} Q ${n(x + 34)} ${n(y - 44)} ${n(x + 6)} ${n(y + 96)}" fill="none" stroke="${secondary}" stroke-width="7" stroke-linecap="round"></path>`;
      g += line(x + 6, y - 96, x + 6, y + 96, "#EAF2FF", 1.6);
      g += path(`M ${n(x - 4)} ${n(y - 6)} L ${n(x + 16)} ${n(y)} L ${n(x - 4)} ${n(y + 6)} Z`, accent);
      break;
    }
    case "guardian": {
      g += `<path d="M ${n(handL.x - 44)} ${n(handL.y - 92)} L ${n(handL.x + 34)} ${n(handL.y - 92)} L ${n(handL.x + 22)} ${n(handL.y + 40)} L ${n(handL.x - 32)} ${n(handL.y + 40)} Z" fill="${secondary}" stroke="${accent}" stroke-width="2.5"></path>`;
      g += `<path d="M ${n(handL.x - 44)} ${n(handL.y - 92)} L ${n(handL.x + 34)} ${n(handL.y - 92)} L ${n(handL.x + 22)} ${n(handL.y + 40)} L ${n(handL.x - 32)} ${n(handL.y + 40)} Z" fill="none" stroke="#FFFFFF" stroke-width="1.4" opacity="0.5"></path>`;
      g += circle(handL.x - 4, handL.y - 26, 11, primary, 'opacity="0.85"');
      g += line(x, y, x + 20, y - 78, "#4A5163", 10);
      break;
    }
    case "assassin": {
      g += path(`M ${n(x)} ${n(y)} L ${n(x + 26)} ${n(y - 46)} L ${n(x + 8)} ${n(y - 52)} L ${n(x - 6)} ${n(y - 8)} Z`, secondary, 'stroke="#FFFFFF" stroke-width="1.2"');
      const ml = mirror(handL);
      g += path(`M ${n(ml.x)} ${n(ml.y)} L ${n(ml.x - 26)} ${n(ml.y - 46)} L ${n(ml.x - 8)} ${n(ml.y - 52)} L ${n(ml.x + 6)} ${n(ml.y - 8)} Z`, secondary, 'stroke="#FFFFFF" stroke-width="1.2"');
      break;
    }
    case "mystic": {
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        g += circle(x + 4 + Math.cos(a) * 19, y - 6 + Math.sin(a) * 19, 5, accent, 'class="va-aura"');
      }
      g += `<circle cx="${n(x + 4)}" cy="${n(y - 6)}" r="25" fill="none" stroke="${primary}" stroke-width="1.4" stroke-dasharray="3 6" class="va-spin"></circle>`;
      break;
    }
    case "dancer": {
      g += `<path d="M ${n(x)} ${n(y)} Q ${n(x + 46)} ${n(y - 30)} ${n(x + 40)} ${n(y - 78)} Q ${n(x + 18)} ${n(y - 40)} ${n(x - 4)} ${n(y - 6)} Z" fill="${secondary}" stroke="#FFFFFF" stroke-width="1.4"></path>`;
      const ml = mirror(handL);
      g += `<path d="M ${n(ml.x)} ${n(ml.y)} Q ${n(ml.x - 46)} ${n(ml.y - 30)} ${n(ml.x - 40)} ${n(ml.y - 78)} Q ${n(ml.x - 18)} ${n(ml.y - 40)} ${n(ml.x + 4)} ${n(ml.y - 6)} Z" fill="${secondary}" stroke="#FFFFFF" stroke-width="1.4"></path>`;
      break;
    }
    case "colossus": {
      g += ellipse(x + 6, y + 4, 26, 22, secondary, 'stroke="#FFFFFF" stroke-width="1.6"');
      g += ellipse(x + 14, y - 2, 16, 12, primary, 'opacity="0.5"');
      const ml = mirror(handL);
      g += ellipse(ml.x - 6, ml.y + 4, 26, 22, secondary, 'stroke="#FFFFFF" stroke-width="1.6"');
      break;
    }
    case "beast":
    case "wyrm": {
      g += `<path d="M ${n(x - 14)} ${n(y - 6)} Q ${n(x + 26)} ${n(y - 26)} ${n(x + 30)} ${n(y - 72)} Q ${n(x + 8)} ${n(y - 40)} ${n(x - 12)} ${n(y - 16)} Z" fill="${secondary}" opacity="0.9"></path>`;
      break;
    }
    default:
      break;
  }

  return g;
}

/** Non-humanoid bodies (beast, wyrm, colossus) — full replacement of the humanoid. */
function buildCreature(cls: CharacterClass, p: CharacterProfile): string {
  const { primary, secondary, accent, glow } = p.palette;
  const rng = mulberry32(p.seed ^ 0x51ed);
  let g = "";

  if (cls === "beast") {
    const hipY = 360;
    g += `<g>
      ${ellipse(200, hipY, 116, 62, primary)}
      ${ellipse(200, hipY + 22, 96, 34, secondary, 'opacity="0.55"')}
      ${path(`M 118 ${n(hipY - 18)} Q 96 ${n(hipY - 66)} 132 ${n(hipY - 78)} Q 150 ${n(hipY - 40)} 146 ${n(hipY - 8)} Z`, secondary)}
      ${circle(128, hipY - 66, 30, primary)}
      ${path(`M 112 ${n(hipY - 88)} q -12 -22 -2 -34 q 12 12 12 30 Z`, accent)}
      ${path(`M 140 ${n(hipY - 90)} q 12 -22 2 -34 q -12 12 -12 30 Z`, accent)}
      ${ellipse(120, hipY - 70, 5, 7, "#1B1426")}
      ${path(`M 104 ${n(hipY - 58)} q 10 10 22 8`, "none", `stroke="${accent}" stroke-width="3" fill="none"`)}
      ${line(150, hipY + 40, 146, 474, primary, 26)}
      ${line(250, hipY + 40, 254, 474, primary, 26)}
      ${line(182, hipY + 46, 180, 474, secondary, 24)}
      ${line(222, hipY + 46, 224, 474, secondary, 24)}
      ${ellipse(146, 478, 18, 10, "#2A2038")}
      ${ellipse(254, 478, 18, 10, "#2A2038")}
      ${path(`M 292 ${n(hipY - 10)} q 40 -8 46 -52 q -34 12 -44 40 Z`, secondary)}
    </g>`;
    for (let i = 0; i < 5; i++) {
      g += circle(150 + rng() * 120, hipY - 20 + rng() * 60, 3 + rng() * 5, accent, 'opacity="0.35"');
    }
    return g;
  }

  if (cls === "wyrm") {
    g += `<g>
      ${path(`M 120 470 C 60 420 90 340 150 330 C 210 320 250 300 262 240 C 272 190 246 150 214 138 C 178 124 140 142 134 180 C 128 220 160 246 196 250`, "none", `stroke="${primary}" stroke-width="58" fill="none" stroke-linecap="round"`)}
      ${path(`M 120 470 C 60 420 90 340 150 330 C 210 320 250 300 262 240 C 272 190 246 150 214 138 C 178 124 140 142 134 180 C 128 220 160 246 196 250`, "none", `stroke="${secondary}" stroke-width="20" fill="none" stroke-linecap="round" opacity="0.7"`)}
      ${path(`M 214 138 L 196 96 L 226 128 Z`, accent)}
      ${path(`M 214 138 L 244 104 L 238 146 Z`, accent)}
      ${circle(214, 138, 30, primary)}
      ${path(`M 232 132 q 26 -6 34 12 q -20 10 -34 2 Z`, primary)}
      ${ellipse(208, 132, 5, 7, "#1B1426")}
      ${path(`M 258 142 q 14 4 18 16`, "none", `stroke="${glow}" stroke-width="3" fill="none"`)}
      ${path(`M 150 300 Q 96 268 84 200 Q 140 232 176 286 Z`, secondary, 'opacity="0.9"')}
      ${path(`M 250 286 Q 306 254 318 186 Q 262 218 226 272 Z`, secondary, 'opacity="0.9"')}
    </g>`;
    return g;
  }

  // colossus — blocky stone golem with connected limbs
  g += `<g>
    ${path(`M 138 372 L 176 372 L 172 470 L 128 470 Z`, secondary)}
    ${path(`M 262 372 L 224 372 L 228 470 L 272 470 Z`, secondary)}
    ${ellipse(150, 474, 30, 12, "#2A2038")}
    ${ellipse(250, 474, 30, 12, "#2A2038")}
    ${path(`M 126 252 L 274 252 L 292 392 L 108 392 Z`, primary)}
    ${path(`M 126 252 L 274 252 L 280 300 L 120 300 Z`, secondary, 'opacity="0.55"')}
    ${line(140, 268, 118, 392, primary, 34)}
    ${line(260, 268, 282, 392, primary, 34)}
    ${ellipse(114, 400, 34, 30, secondary, 'stroke="#FFFFFF" stroke-width="2"')}
    ${ellipse(286, 400, 34, 30, secondary, 'stroke="#FFFFFF" stroke-width="2"')}
    ${circle(200, 186, 50, primary)}
    ${path(`M 158 168 A 50 50 0 0 1 242 168 L 242 152 L 158 152 Z`, secondary)}
    ${ellipse(184, 188, 7, 10, "#1B1426")}
    ${ellipse(216, 188, 7, 10, "#1B1426")}
    ${rect(156, 138, 88, 18, 7, accent, 'opacity="0.9"')}
    ${circle(200, 330, 30, "none", `stroke="${accent}" stroke-width="4" opacity="0.85"`)}
    ${poly([[200, 312], [218, 344], [182, 344]], accent, 'opacity="0.8"')}
    ${line(150, 300, 250, 300, glow, 3, 'opacity="0.5"')}
  </g>`;
  return g;
}

function rect(x: number, y: number, w: number, h: number, r: number, fill: string, extra = ""): string {
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}" ${mergeAttrs(
    `fill="${fill}"`,
    extra
  )}></rect>`;
}

/* ------------------------------------------------------------------ */
/* Per-card accessories (silhouette variant)                           */
/* ------------------------------------------------------------------ */

function buildAccessories(
  p: CharacterProfile,
  sw: number,
  shoulderY: number,
  hipY: number,
  limb: number
): string {
  const { primary, secondary, accent } = p.palette;
  const v = p.variant;
  let g = "";

  if (v === 1) {
    // High collar + clasp
    g += `<path d="M ${n(200 - sw * 0.7)} ${n(shoulderY - 6)} Q 200 ${n(shoulderY - 26)} ${n(200 + sw * 0.7)} ${n(shoulderY - 6)} L ${n(200 + sw * 0.55)} ${n(shoulderY + 8)} L ${n(200 - sw * 0.55)} ${n(shoulderY + 8)} Z" fill="${secondary}" opacity="0.95"></path>`;
    g += circle(200, shoulderY - 2, limb * 0.34, accent, 'class="va-aura"');
  } else if (v === 2) {
    // Waist sash + pouch + hanging cloth
    g += `<rect x="${n(200 - sw * 0.86)}" y="${n(hipY - 20)}" width="${n(sw * 1.72)}" height="14" rx="7" fill="${secondary}"></rect>`;
    g += `<path d="M ${n(200 + sw * 0.5)} ${n(hipY - 6)} l 22 8 l -4 34 l -24 -6 Z" fill="${primary}" opacity="0.85"></path>`;
    g += `<path d="M ${n(200 - sw * 0.9)} ${n(hipY - 4)} l -16 6 l 6 40 l 18 -4 Z" fill="${secondary}" opacity="0.7"></path>`;
  } else if (v === 3) {
    // Knee plates + wrist bands + chest strap
    g += ellipse(200 - sw * 0.4, hipY + 74, limb * 0.72, limb * 0.5, secondary, 'opacity="0.9"');
    g += ellipse(200 + sw * 0.4, hipY + 74, limb * 0.72, limb * 0.5, secondary, 'opacity="0.9"');
    g += `<path d="M ${n(200 - sw * 0.9)} ${n(shoulderY + 26)} L ${n(200 + sw * 0.9)} ${n(shoulderY + 62)}" stroke="${accent}" stroke-width="3" opacity="0.7" fill="none"></path>`;
  }

  return g;
}

/* ------------------------------------------------------------------ */
/* Action effects per pose                                             */
/* ------------------------------------------------------------------ */

function buildActionEffect(p: CharacterProfile): string {
  const { secondary, accent, glow } = p.palette;
  const tier = RARITY_TIER[p.rarity];
  let g = "";

  switch (p.pose) {
    case "charge": {
      g += `<path d="M 96 210 Q 200 150 318 214" fill="none" stroke="${glow}" stroke-width="${n(6 + tier)}" stroke-linecap="round" opacity="0.8" class="va-slash"></path>`;
      g += `<path d="M 118 268 Q 200 220 300 272" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.55"></path>`;
      break;
    }
    case "cast": {
      const cx = 300;
      const cy = 250;
      g += `<circle cx="${cx}" cy="${cy}" r="${n(44 + tier * 2)}" fill="none" stroke="${accent}" stroke-width="3" opacity="0.8" class="va-spin"></circle>`;
      g += `<circle cx="${cx}" cy="${cy}" r="${n(30 + tier)}" fill="none" stroke="${glow}" stroke-width="2" stroke-dasharray="6 8" opacity="0.7" class="va-spin"></circle>`;
      g += poly([[cx, cy - 14], [cx + 12, cy + 8], [cx - 12, cy + 8]], accent, 'opacity="0.85"');
      break;
    }
    case "aim": {
      // Creatures have no bow — fall back to the ready ember drift.
      if (p.cls === "beast" || p.cls === "wyrm" || p.cls === "colossus") {
        const rng = mulberry32(p.seed ^ 0x1234);
        for (let i = 0; i < 8; i++) {
          const x = 120 + rng() * 160;
          const y = 470 - rng() * 60;
          g += circle(x, y, 2 + rng() * 3, accent, `opacity="${(0.25 + rng() * 0.4).toFixed(2)}"`);
        }
        break;
      }
      g += `<path d="M 250 250 L 372 236" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.9"></path>`;
      g += `<path d="M 372 236 l -16 -7 l 4 7 l -4 7 Z" fill="${accent}"></path>`;
      g += `<circle cx="372" cy="236" r="26" fill="none" stroke="${glow}" stroke-width="2" stroke-dasharray="3 6" opacity="0.6"></circle>`;
      break;
    }
    case "guard": {
      g += `<ellipse cx="150" cy="330" rx="66" ry="86" fill="none" stroke="${accent}" stroke-width="4" opacity="0.55" class="va-aura"></ellipse>`;
      g += `<ellipse cx="150" cy="330" rx="46" ry="64" fill="${secondary}" opacity="0.22"></ellipse>`;
      break;
    }
    default: {
      // ready — subtle rising embers around the feet
      const rng = mulberry32(p.seed ^ 0x1234);
      for (let i = 0; i < 8; i++) {
        const x = 120 + rng() * 160;
        const y = 470 - rng() * 60;
        g += circle(x, y, 2 + rng() * 3, accent, `opacity="${(0.25 + rng() * 0.4).toFixed(2)}"`);
      }
      break;
    }
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* Frame / filigree                                                    */
/* ------------------------------------------------------------------ */

function buildFiligree(p: CharacterProfile, uid: string): string {
  const { accent } = p.palette;
  const tier = RARITY_TIER[p.rarity];
  let g = "";

  g += `<rect x="8" y="8" width="384" height="544" rx="22" fill="none" stroke="${accent}" stroke-width="${tier >= 5 ? 3 : 1.6}" opacity="0.55"></rect>`;
  g += `<rect x="18" y="18" width="364" height="524" rx="16" fill="none" stroke="${accent}" stroke-width="1" opacity="0.28"></rect>`;

  const corners: Array<[number, number, number, number]> = [
    [26, 40, 40, 26],
    [374, 40, 360, 26],
    [26, 520, 40, 534],
    [374, 520, 360, 534],
  ];
  for (const [x1, y1, x2, y2] of corners) {
    g += `<path d="M ${x1} ${y1} A 14 14 0 0 1 ${x2} ${y2}" fill="none" stroke="${accent}" stroke-width="2.4" opacity="0.8"></path>`;
  }

  if (tier >= 6) {
    g += `<circle cx="200" cy="20" r="4" fill="${accent}"></circle>`;
    g += `<circle cx="200" cy="540" r="4" fill="${accent}"></circle>`;
    g += `<g opacity="0.5">${Array.from({ length: 24 }, (_, i) => {
      const x = 34 + i * 14.6;
      return line(x, 8, x, 14, accent, 1.2);
    }).join("")}</g>`;
  }
  if (tier >= 8) {
    g += `<g class="va-aura">
      <ellipse cx="200" cy="520" rx="150" ry="26" fill="none" stroke="${accent}" stroke-width="1.6" opacity="0.5"></ellipse>
      <ellipse cx="200" cy="520" rx="110" ry="18" fill="none" stroke="${accent}" stroke-width="1" opacity="0.35"></ellipse>
    </g>`;
  }

  // hidden id anchor used by the live renderer to key animations
  g += `<text x="4" y="556" font-size="1" fill="none" data-va="${uid}"></text>`;
  return g;
}

/* ------------------------------------------------------------------ */
/* Public builders                                                     */
/* ------------------------------------------------------------------ */

export interface BuildOptions {
  animated?: boolean;
  width?: number;
  height?: number;
  /** Render at 100% of the parent box instead of a fixed pixel size. */
  responsive?: boolean;
  /**
   * Override the SVG viewBox. The card/figure windows are ~5:7 portrait while
   * the full canvas is 400x560 with a lot of sky; a tighter box makes the
   * character fill a small window instead of appearing as a tiny figure.
   */
  viewBox?: string;
}

export function buildCharacterSvg(p: CharacterProfile, opts: BuildOptions = {}): string {
  const animated = opts.animated !== false;
  const uid = p.cardId.replace(/[^a-zA-Z0-9]/g, "");
  const { primary, secondary, accent, glow } = p.palette;
  const tier = RARITY_TIER[p.rarity];

  const pose = p.pose;
  const bulk = p.bulk;
  const swBase = p.cls === "guardian" || p.cls === "colossus" ? 62 : p.cls === "assassin" || p.cls === "dancer" || p.cls === "ranger" ? 40 : 50;
  const sw = swBase * bulk;
  const hw = sw * 0.72;
  const headR = (p.cls === "colossus" ? 30 : p.cls === "beast" ? 26 : 38) * (0.9 + bulk * 0.14);
  const limb = (p.cls === "colossus" ? 26 : p.cls === "guardian" ? 24 : 21) * (0.85 + bulk * 0.3);

  const handR = handPoint(pose, 1, sw);
  const handL = mirror(handR);
  const lean = pose === "charge" ? 6 : pose === "guard" ? -3 : pose === "cast" ? 2 : 0;
  const crouch = pose === "guard" ? 12 : 0;
  const isCreature = p.cls === "beast" || p.cls === "wyrm" || p.cls === "colossus";

  const styleBlock = animated
    ? `<style>
        @keyframes vaBreathe { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes vaAura { 0%,100% { opacity: .45; } 50% { opacity: 1; } }
        @keyframes vaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes vaSlash { 0% { stroke-dashoffset: 260; opacity: 0; } 25% { opacity: .95; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        .va-breathe { animation: vaBreathe 3.4s ease-in-out infinite; transform-origin: 200px 470px; }
        .va-aura { animation: vaAura 2.8s ease-in-out infinite; }
        .va-spin { animation: vaSpin 14s linear infinite; transform-origin: center; transform-box: fill-box; }
        .va-slash { stroke-dasharray: 260; animation: vaSlash 2.6s ease-out infinite; }
      </style>`
    : "";

  const body = isCreature
    ? buildCreature(p.cls, p)
    : humanoid({
        sw,
        hw,
        headR,
        limb,
        cloth: primary,
        clothDark: "#241B33",
        armor: secondary,
        trim: accent,
        skin: "#F0D9C4",
        handR,
        handL,
        lean,
        crouch,
      });

  const cape =
    p.cls === "ranger" || p.cls === "assassin" || p.cls === "dancer" || p.cls === "arcanist"
      ? path(capePath(sw, 228 + crouch, 344 + crouch, pose === "charge" ? 18 : 8), "#1E1730", 'opacity="0.9"')
      : "";

  const weapon =
    p.cls === "beast" || p.cls === "wyrm"
      ? ""
      : buildWeapon(p.cls, p, handR, handL);

  const gear = isCreature ? "" : buildAccessories(p, sw, 228 + crouch, 344 + crouch, limb);

  const auraR = 96 + tier * 6;
  const charTransform = `translate(200 470) scale(${n(p.scale)}) translate(-200 -470)`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${opts.viewBox ?? "0 0 400 560"}" width="${opts.responsive ? "100%" : opts.width ?? 400}" height="${opts.responsive ? "100%" : opts.height ?? 560}" role="img" aria-label="${escapeAttr(p.title)}">
  <defs>
    <linearGradient id="va-bg-${uid}" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#0A0714"></stop>
      <stop offset="55%" stop-color="#150F28"></stop>
      <stop offset="100%" stop-color="${primary}" stop-opacity="0.55"></stop>
    </linearGradient>
    <radialGradient id="va-halo-${uid}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"></stop>
      <stop offset="60%" stop-color="${glow}" stop-opacity="0.12"></stop>
      <stop offset="100%" stop-color="${glow}" stop-opacity="0"></stop>
    </radialGradient>
    <radialGradient id="va-orb-${uid}" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0%" stop-color="#FFFFFF"></stop>
      <stop offset="45%" stop-color="${accent}"></stop>
      <stop offset="100%" stop-color="${primary}"></stop>
    </radialGradient>
    <filter id="va-glow-${uid}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="${n(3 + tier * 0.5)}" result="b"></feGaussianBlur>
      <feComposite in="SourceGraphic" in2="b" operator="over"></feComposite>
    </filter>
    <radialGradient id="va-vignette-${uid}" cx="0.5" cy="0.45" r="0.75">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"></stop>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"></stop>
    </radialGradient>
    ${styleBlock}
  </defs>

  ${buildScene(p, uid)}

  <ellipse cx="200" cy="486" rx="${n(96 + sw * 0.5)}" ry="20" fill="#05030A" opacity="0.55"></ellipse>

  <g class="va-breathe" transform="${charTransform}">
    <circle cx="200" cy="330" r="${n(auraR)}" fill="${glow}" opacity="0.12" class="va-aura"></circle>
    ${cape}
    ${body}
    ${isCreature ? "" : headgear(p.cls, p, 228 + crouch - 52, headR, sw, 228 + crouch)}
    ${gear}
    ${weapon ? `<g class="va-weapon">${weapon}</g>` : ""}
  </g>

  <g filter="url(#va-glow-${uid})">${buildActionEffect(p)}</g>

  ${buildFiligree(p, uid)}

  <rect x="0" y="0" width="400" height="560" fill="url(#va-vignette-${uid})"></rect>
</svg>`;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Compact descriptor used by card metadata + detail screens. */
export interface CharacterDescriptor {
  class: CharacterClass;
  pose: CharacterPose;
  weapon: string;
  title: string;
  palette: CharacterPalette;
  scene: string;
}

export function characterProfileSummary(p: CharacterProfile): CharacterDescriptor {
  return {
    class: p.cls,
    pose: p.pose,
    weapon: p.weapon,
    title: p.title,
    palette: p.palette,
    scene: p.scene,
  };
}
