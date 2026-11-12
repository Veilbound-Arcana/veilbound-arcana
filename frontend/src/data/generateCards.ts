import { Card, Aspect, Rarity } from "@/game/types";
import { CONCEPT } from "@/app/concept.config";
import { mulberry32 } from "@/game/rng";

export const SHOWCASE_CARDS: Card[] = [
  {
    id: "c-001",
    number: 1,
    setId: "V1",
    name: "Emberwick",
    kind: "veilborn",
    stage: "basic",
    aspect: "ember",
    vitality: 60,
    rarity: "rune1",
    retreat: 1,
    weakness: "tide",
    abilities: [
      { name: "Kindle Spark", cost: ["ember"], damage: 20, text: "Deals 20 damage." },
    ],
    flavor: "Born from smoldering wick and whispered vows.",
    artist: "A. Vance",
  },
  {
    id: "c-002",
    number: 2,
    setId: "V1",
    name: "Tidecaller Wren",
    kind: "veilborn",
    stage: "basic",
    aspect: "tide",
    vitality: 60,
    rarity: "rune2",
    retreat: 1,
    weakness: "volt",
    abilities: [
      { name: "Swell Chirp", cost: ["tide"], damage: 20, text: "Deals 20 damage." },
    ],
    flavor: "Its dawn song pulls gentle currents ashore.",
    artist: "E. Lin",
  },
  {
    id: "c-003",
    number: 3,
    setId: "V1",
    name: "Mossbarrow Hare",
    kind: "veilborn",
    stage: "basic",
    aspect: "verdant",
    vitality: 50,
    rarity: "rune1",
    retreat: 1,
    weakness: "umbra",
    abilities: [
      { name: "Root Burrow", cost: ["verdant"], damage: 10, text: "Heals 10 on hit." },
    ],
    flavor: "Burrows beneath ancient mounds where memory sleeps.",
    artist: "M. Thorne",
  },
  {
    id: "c-004",
    number: 4,
    setId: "V1",
    name: "Static Finch",
    kind: "veilborn",
    stage: "basic",
    aspect: "volt",
    vitality: 50,
    rarity: "rune2",
    retreat: 1,
    weakness: "iron",
    abilities: [
      { name: "Flash Peck", cost: ["volt"], damage: 30, text: "Sharp 30 damage opener." },
    ],
    flavor: "Feathers snap with ozone before summer tempests.",
    artist: "S. Kova",
  },
  {
    id: "c-005",
    number: 5,
    setId: "V1",
    name: "Hollowbell Fox",
    kind: "veilborn",
    stage: "stage1",
    aspect: "umbra",
    vitality: 80,
    rarity: "moon1",
    retreat: 1,
    weakness: "lumen",
    abilities: [
      {
        name: "Somber Chime",
        cost: ["umbra", "aether"],
        damage: 40,
        text: "Deals 40 damage and puts target into Slumber.",
        effect: { type: "status", status: "slumber" },
      },
    ],
    flavor: "Tolls a brass bell heard only in twilight dreams.",
    artist: "A. Vance",
  },
  {
    id: "c-006",
    number: 6,
    setId: "V1",
    name: "Gleamstag",
    kind: "veilborn",
    stage: "stage1",
    aspect: "lumen",
    vitality: 90,
    rarity: "moon2",
    retreat: 2,
    weakness: "aether",
    abilities: [
      {
        name: "Lustrous Dawn",
        cost: ["lumen", "aether"],
        damage: 30,
        text: "Deals 30 damage and heals 30 to a benched ally.",
        effect: { type: "heal", amount: 30 },
      },
    ],
    flavor: "Its luminous antlers light lost pilgrims safely home.",
    artist: "H. Gale",
  },
  {
    id: "c-007",
    number: 7,
    setId: "V1",
    name: "Ironquill",
    kind: "veilborn",
    stage: "basic",
    aspect: "iron",
    vitality: 100,
    rarity: "rune3",
    retreat: 2,
    weakness: "ember",
    abilities: [
      { name: "Fortified Strike", cost: ["iron", "aether"], damage: 40, text: "Solid 40 damage." },
    ],
    flavor: "Plumage hardened by centuries of temple vigil.",
    artist: "M. Thorne",
  },
  {
    id: "c-008",
    number: 8,
    setId: "V1",
    name: "Mourning Leviathan",
    kind: "veilborn",
    stage: "stage2",
    aspect: "tide",
    vitality: 140,
    crowned: true,
    rarity: "veil",
    immersive: true,
    retreat: 3,
    weakness: "volt",
    abilities: [
      {
        name: "Tide of Sorrow",
        cost: ["tide", "tide", "aether"],
        damage: 80,
        text: "Massive 80 damage. Awards 2 points on KO.",
      },
    ],
    flavor: "The sea remembers what the shoreline forgot.",
    artist: "C. Moros",
  },
  {
    id: "c-009",
    number: 9,
    setId: "V1",
    name: "Marrow Queen",
    kind: "veilborn",
    stage: "stage2",
    aspect: "verdant",
    vitality: 120,
    crowned: true,
    rarity: "moon3",
    retreat: 2,
    weakness: "umbra",
    abilities: [
      {
        name: "Spore Thorns",
        cost: ["verdant", "aether"],
        damage: 50,
        text: "Deals 50 damage and 20 to one benched enemy.",
        effect: { type: "benchDamage", amount: 20 },
      },
    ],
    flavor: "Her root-throne cradles the bones of forgotten kings.",
    artist: "S. Kova",
  },
  {
    id: "c-010",
    number: 10,
    setId: "V1",
    name: "Warden Isolde",
    kind: "ally",
    rarity: "rune4",
    abilities: [
      {
        name: "Veil Mend",
        cost: [],
        text: "Heal 30 vitality from one chosen Veilborn.",
        effect: { type: "heal", amount: 30 },
      },
    ],
    flavor: "‘Hold fast to the thread; dawn is near.’",
    artist: "E. Lin",
  },
  {
    id: "c-011",
    number: 11,
    setId: "V1",
    name: "Cracked Compass",
    kind: "tool",
    rarity: "rune2",
    abilities: [
      { name: "Wayward Needle", cost: [], text: "Reduces retreat cost by 1." },
    ],
    flavor: "Its needle spins toward truth, not north.",
    artist: "H. Gale",
  },
  {
    id: "c-012",
    number: 12,
    setId: "V1",
    name: "Veilhearth Sentinel",
    kind: "veilborn",
    stage: "stage2",
    aspect: "ember",
    vitality: 130,
    crowned: true,
    rarity: "veil",
    immersive: true,
    retreat: 2,
    weakness: "tide",
    abilities: [
      {
        name: "Ashen Wither",
        cost: ["ember", "aether"],
        damage: 60,
        text: "Deals 60 damage and afflicts target with Wither.",
        effect: { type: "status", status: "wither" },
      },
    ],
    flavor: "Standing guard where hearthfire meets the infinite cold.",
    artist: "C. Moros",
  },
];

const PREFIXES = [
  "Mist", "Gloom", "Solar", "Dusk", "Frost", "Glint", "Cinder", "Briar",
  "Rune", "Hallow", "Storm", "Shimmer", "Vesper", "Sylvan", "Abyss", "Zephyr"
];

const SUFFIXES = [
  "hound", "talon", "weaver", "stride", "mantle", "drake", "specter", "moth",
  "root", "whisper", "hart", "gargoyle", "panther", "vane", "strider", "serpent"
];

const ARTISTS = ["A. Vance", "E. Lin", "M. Thorne", "S. Kova", "H. Gale", "C. Moros"];

export function generateAllCards(): Card[] {
  const cards: Card[] = [...SHOWCASE_CARDS];
  const rng = mulberry32(0x5a17e0);

  const aspects: Aspect[] = [
    "ember", "tide", "verdant", "volt", "umbra", "lumen", "iron", "aether"
  ];
  const rarities: Rarity[] = [
    "rune1", "rune1", "rune2", "rune2", "rune3", "rune4", "moon1", "moon2"
  ];

  const setIds = ["V1", "V2", "V3"] as const;

  let globalId = 13;

  for (const setId of setIds) {
    const existingInSet = cards.filter((c) => c.setId === setId).length;
    const toGenerate = 40 - existingInSet;

    for (let i = 0; i < toGenerate; i++) {
      const aspect = aspects[Math.floor(rng() * aspects.length)];
      const rarity = rarities[Math.floor(rng() * rarities.length)];
      const prefix = PREFIXES[Math.floor(rng() * PREFIXES.length)];
      const suffix = SUFFIXES[Math.floor(rng() * SUFFIXES.length)];
      const name = `${prefix}${suffix}`;
      const vitality = 50 + Math.floor(rng() * 6) * 10;
      const damage = 20 + Math.floor(rng() * 5) * 10;

      cards.push({
        id: `c-${String(globalId).padStart(3, "0")}`,
        number: existingInSet + i + 1,
        setId,
        name,
        kind: "veilborn",
        stage: "basic",
        aspect,
        vitality,
        rarity,
        retreat: 1 + Math.floor(rng() * 2),
        weakness: CONCEPT.ASPECTS[(CONCEPT.ASPECTS.indexOf(aspect) + 1) % 8],
        abilities: [
          {
            name: `${prefix} Strike`,
            cost: [aspect],
            damage,
            text: `Strikes with the power of ${aspect}.`,
          },
        ],
        flavor: "Whispering through the boundary of the unformed world.",
        artist: ARTISTS[Math.floor(rng() * ARTISTS.length)],
      });

      globalId++;
    }
  }

  return cards;
}

export const ALL_CARDS: Card[] = generateAllCards();
export const CARD_MAP: Record<string, Card> = Object.fromEntries(
  ALL_CARDS.map((c) => [c.id, c])
);
