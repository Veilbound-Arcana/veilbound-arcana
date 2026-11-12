import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CARDS = [
  { id: 1, name: "Page of Wands", suit: "Wands", arcana: "Minor", rarity: "Common", cost: 1, power: 2, element: "Fire", desc: "Pengintai api muda yang membawa bara antusiasme pertama." },
  { id: 2, name: "Knight of Wands", suit: "Wands", arcana: "Minor", rarity: "Common", cost: 1, power: 2, element: "Fire", desc: "Penyerang api cepat yang menerjang tanpa ragu." },
  { id: 3, name: "Queen of Wands", suit: "Wands", arcana: "Minor", rarity: "Rare", cost: 2, power: 3, element: "Fire", desc: "Penguasa bara agung dengan kharisma membara dan wibawa mutlak." },
  { id: 4, name: "King of Wands", suit: "Wands", arcana: "Minor", rarity: "Epic", cost: 3, power: 4, element: "Fire", desc: "Titik puncak kekuatan api yang memimpin pertempuran dengan visi mulia." },

  { id: 5, name: "Page of Cups", suit: "Cups", arcana: "Minor", rarity: "Common", cost: 1, power: 2, element: "Water", desc: "Pembawa kabar emosi dan pesan mistis dari kedalaman samudera." },
  { id: 6, name: "Knight of Cups", suit: "Cups", arcana: "Minor", rarity: "Common", cost: 1, power: 2, element: "Water", desc: "Pelindung cawan suci yang menunggangi gelombang intuisi." },
  { id: 7, name: "Queen of Cups", suit: "Cups", arcana: "Minor", rarity: "Rare", cost: 2, power: 3, element: "Water", desc: "Penguasa kedalaman emosi dan mata air ketenangan batin." },
  { id: 8, name: "King of Cups", suit: "Cups", arcana: "Minor", rarity: "Epic", cost: 3, power: 4, element: "Water", desc: "Penguasa samudra luas yang menundukkan badai dengan kebijaksanaan." },

  { id: 9, name: "Page of Swords", suit: "Swords", arcana: "Minor", rarity: "Common", cost: 1, power: 2, element: "Air", desc: "Pemikir tajam pemula yang mengamati dari balik tabir angin." },
  { id: 10, name: "Knight of Swords", suit: "Swords", arcana: "Minor", rarity: "Common", cost: 1, power: 2, element: "Air", desc: "Terjangan badai angin puyuh yang membelah kebohongan seketika." },
  { id: 11, name: "Queen of Swords", suit: "Swords", arcana: "Minor", rarity: "Rare", cost: 2, power: 3, element: "Air", desc: "Kebijaksanaan dingin yang melihat kebenaran tanpa terdistorsi emosi." },
  { id: 12, name: "King of Swords", suit: "Swords", arcana: "Minor", rarity: "Epic", cost: 3, power: 4, element: "Air", desc: "Penghakiman udara mutlak dengan intelektualitas tak terbantahkan." },

  { id: 13, name: "Page of Pentacles", suit: "Pentacles", arcana: "Minor", rarity: "Common", cost: 1, power: 2, element: "Earth", desc: "Pelindung koin tanah yang tekun menanam fondasi kemakmuran." },
  { id: 14, name: "Knight of Pentacles", suit: "Pentacles", arcana: "Minor", rarity: "Common", cost: 1, power: 2, element: "Earth", desc: "Ketahanan benteng batu yang tak tergoyahkan oleh ujian waktu." },
  { id: 15, name: "Queen of Pentacles", suit: "Pentacles", arcana: "Minor", rarity: "Rare", cost: 2, power: 3, element: "Earth", desc: "Kemakmuran bumi yang memelihara kehidupan dengan tangan dermawan." },
  { id: 16, name: "King of Pentacles", suit: "Pentacles", arcana: "Minor", rarity: "Epic", cost: 3, power: 4, element: "Earth", desc: "Penguasa peradaban materi dan fondasi kekayaan tanah abadi." },

  { id: 17, name: "0 — The Fool", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, power: 5, element: "Aether", desc: "Permulaan mistis tanpa batas di tepi jurang takdir kosmik." },
  { id: 18, name: "I — The Magician", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, power: 5, element: "Omni", desc: "Pengendali empat elemen penciptaan: Wands, Cups, Swords, Pentacles." },
  { id: 19, name: "II — High Priestess", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, power: 5, element: "Mystery", desc: "Penjaga gerbang tabir rahasia dan hikmah tersembunyi semesta." },
  { id: 20, name: "XXI — The World", suit: "None", arcana: "Major", rarity: "Legendary", cost: 4, power: 5, element: "Cosmos", desc: "Siklus penyelesaian sempurna dan perayaan kesatuan makrokosmos." },
];

const targetDirs = [
  path.resolve(__dirname, "../assets/metadata"),
  path.resolve(__dirname, "../frontend/public/cards/metadata")
];

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

CARDS.forEach((card) => {
  const metadata = {
    name: card.name,
    description: card.desc,
    image: `ipfs://bafybeiveilboundarcana/images/${card.id}.png`,
    external_url: `https://veilbound-arcana.vercel.app/cards/${card.id}`,
    attributes: [
      { trait_type: "Arcana", value: card.arcana },
      { trait_type: "Suit", value: card.suit },
      { trait_type: "Rarity", value: card.rarity },
      { trait_type: "Cost", value: card.cost },
      { trait_type: "Base Power", value: card.power },
      { trait_type: "Element", value: card.element },
      { trait_type: "Project", value: "Veilbound Arcana" },
      { trait_type: "Disclaimer", value: "Confidential protocol. Use at your own risk." }
    ]
  };

  for (const dir of targetDirs) {
    const filePath = path.join(dir, `${card.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2), "utf-8");
  }
});

console.log(`Generated 20 metadata JSON files in assets/metadata and frontend/public/cards/metadata/`);
