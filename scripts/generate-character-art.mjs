/**
 * Veilbound Arcana — Character Art Generator
 * ------------------------------------------
 * Renders a fully original character illustration for every card in the
 * catalog and writes:
 *   frontend/public/cards/art/c-XXX.svg     card art (live app + zip delivery)
 *   assets/art/c-XXX.svg                    mirrored source asset
 *   frontend/public/cards/characters/c-XXX.json  character descriptor
 *
 * It also enriches the 20 existing NFT metadata JSON files with character
 * traits and a local image pointer.
 *
 * Run:  node scripts/generate-character-art.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { ALL_CARDS } from "../frontend/src/data/generateCards.ts";
import {
  buildCharacterSvg,
  characterProfileSummary,
  profileForCard,
  CLASS_LABEL,
  POSE_LABEL,
} from "../frontend/src/art/character/characterEngine.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const ART_DIR = path.join(root, "frontend", "public", "cards", "art");
const CHARACTER_DIR = path.join(root, "frontend", "public", "cards", "characters");
const ASSET_ART_DIR = path.join(root, "assets", "art");
const METADATA_DIR = path.join(root, "frontend", "public", "cards", "metadata");

for (const dir of [ART_DIR, CHARACTER_DIR, ASSET_ART_DIR, METADATA_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

let written = 0;
const classes = new Map();
const poses = new Map();

for (const card of ALL_CARDS) {
  const profile = profileForCard({
    id: card.id,
    name: card.name,
    aspect: card.aspect,
    rarity: card.rarity,
    tarotArchetype: card.tarotArchetype,
    number: card.number,
    crowned: card.crowned,
  });

  const svg = buildCharacterSvg(profile, { animated: true, width: 400, height: 560 });
  const svgPath = path.join(ART_DIR, `${card.id}.svg`);
  fs.writeFileSync(svgPath, svg, "utf-8");
  fs.writeFileSync(path.join(ASSET_ART_DIR, `${card.id}.svg`), svg, "utf-8");

  const summary = characterProfileSummary(profile);
  classes.set(profile.cls, (classes.get(profile.cls) ?? 0) + 1);
  poses.set(profile.pose, (poses.get(profile.pose) ?? 0) + 1);

  const descriptor = {
    card_id: card.id,
    name: card.name,
    aspect: profile.aspect,
    rarity: card.rarity,
    character: {
      title: summary.title,
      class: summary.class,
      class_label: CLASS_LABEL[summary.class],
      pose: summary.pose,
      pose_label: POSE_LABEL[summary.pose],
      weapon: summary.weapon,
      scene: summary.scene,
      palette: summary.palette,
      crowned: profile.crowned,
    },
    image: `/cards/art/${card.id}.svg`,
    animation: {
      idle: "va-breathe",
      aura: "va-aura",
      spin: "va-spin",
      slash: "va-slash",
    },
  };
  fs.writeFileSync(
    path.join(CHARACTER_DIR, `${card.id}.json`),
    JSON.stringify(descriptor, null, 2),
    "utf-8"
  );

  // Enrich the existing 20 NFT metadata files when their card number matches.
  const metaPath = path.join(METADATA_DIR, `${card.number}.json`);
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const attrs = Array.isArray(meta.attributes) ? meta.attributes : [];
    const set = (trait_type, value) => {
      const hit = attrs.find((a) => a.trait_type === trait_type);
      if (hit) hit.value = value;
      else attrs.push({ trait_type, value });
    };
    set("Character Class", CLASS_LABEL[summary.class]);
    set("Pose", POSE_LABEL[summary.pose]);
    set("Weapon", summary.weapon);
    set("Scene", summary.scene);
    meta.attributes = attrs;
    meta.local_image = `/cards/art/${card.id}.svg`;
    meta.character = descriptor.character;
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");
  }

  written++;
}

console.log(`[character-art] rendered ${written} original character illustrations`);
console.log(`[character-art]   art      -> frontend/public/cards/art/c-XXX.svg`);
console.log(`[character-art]   mirror   -> assets/art/c-XXX.svg`);
console.log(`[character-art]   profiles -> frontend/public/cards/characters/c-XXX.json`);
console.log("[character-art]   class distribution:", JSON.stringify(Object.fromEntries(classes)));
console.log("[character-art]   pose distribution: ", JSON.stringify(Object.fromEntries(poses)));
