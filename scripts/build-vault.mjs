import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const vaultRoot = path.resolve(__dirname, "../vault");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeNote(subPath, content) {
  const fullPath = path.join(vaultRoot, subPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + "\n", "utf-8");
}

console.log("Building Veilbound Arcana Vault...");
ensureDir(vaultRoot);

// -----------------------------------------------------------------------------
// 1. Arcana Hub.md (Root MOC)
// -----------------------------------------------------------------------------
writeNote("Arcana Hub.md", `
# 🔮 Veilbound Arcana — Central Knowledge Vault (Hub)

> **Mandatory Disclaimer:** *This project is not audited, endorsed or operated by any third party. Use at your own risk.*

Selamat datang di repositori kebenaran desain, arsitektur, dan eksekusi teknik **Veilbound Arcana** untuk kompetisi **Developer Program Mainnet Season 5 (Confidential Gaming)** di Ethereum Sepolia.

---

## 🗺️ Peta Konten Vault (Map of Content)

### [[00 Log]]
- [[00 Log/Progress Arcana|Progress Arcana (Daily Execution Log)]]
- [[00 Log/Rehearsals/Rehearsal Run 1 - Sepolia Testnet|Rehearsal Run 1 - Sepolia Testnet]]
- [[00 Log/Rehearsals/Rehearsal Run 2 - Dry Run Submission|Rehearsal Run 2 - Dry Run Submission]]

### [[01 Konsep & Gameplay]]
- [[01 Konsep & Gameplay/Arcana - Visi Masalah & Solusi|Visi, Masalah Chain Transparan & Solusi FHE]]
- [[01 Konsep & Gameplay/Arcana - Game Loop & Siklus Hidup Kartu|Game Loop & Siklus Hidup Kartu (Sealed → Unseal → Duel)]]
- [[01 Konsep & Gameplay/Arcana - Bluffing Game Theory & Psikologi TCG|Game Theory Bluffing & Psikologi Kartu Rahasia]]
- [[01 Konsep & Gameplay/Arcana - Persona Pengguna & User Journey|Persona Pengguna & Alur Perjalanan (User Journey)]]

### [[02 Game Design & Balancing]]
- [[02 Game Design & Balancing/Arcana - Model Data & Kamus Angka Resmi|Kamus Angka Resmi (Single Source of Truth)]]
- [[02 Game Design & Balancing/Arcana - Katalog Lengkap 20 Kartu MVP|Katalog Lengkap 20 Kartu MVP (Stat, Power, Cost)]]
- [[02 Game Design & Balancing/Arcana - Formula Resolusi Power & Siklus Suit|Formula Resolusi Power & Siklus Keunggulan Suit]]
- [[02 Game Design & Balancing/Arcana - Mekanisme Tarot Flip Orientasi|Mekanisme Tarot Flip (Upright vs Reversed Modifier)]]
- [[02 Game Design & Balancing/Arcana - Sistem Energi & Auction Dynamics|Sistem Energi (Pool 6 Energi & Auction Dynamics)]]
- [[02 Game Design & Balancing/Arcana - Mode Duel (Friendly, Stake Ante, Practice Bot)|Mode Duel: Friendly, Stake Ante, & Practice Bot]]

### [[03 Ekonomi & Falsifiers]]
- [[03 Ekonomi & Falsifiers/Arcana - Tokenomics ($FATE ERC-7984) & Faucet|Tokenomics $FATE (ERC-7984 Confidential Balance) & Faucet]]
- [[03 Ekonomi & Falsifiers/Arcana - Probabilitas Gacha & Pity Counter Math|Probabilitas Gacha Tarot Spread & Pity Counter Math]]
- [[03 Ekonomi & Falsifiers/Arcana - Teori Permainan Mode Ante & Anti-Griefing|Teori Permainan Mode Ante (1-NFT Staking) & Anti-Griefing]]
- [[03 Ekonomi & Falsifiers/Arcana - Pasar & Atomic Swap Escrow 1-on-1|Pasar & Atomic Swap Escrow 1-on-1]]
- [[03 Ekonomi & Falsifiers/Arcana - Economic Falsifiers (F-01..F-05)|Economic Falsifiers (F-01..F-05)]]

### [[04 Arsitektur & FHEVM]]
- [[04 Arsitektur & FHEVM/Arcana - Arsitektur Modular & Diagram Sistem|Arsitektur Modular & Diagram Interaksi FHEVM]]
- [[04 Arsitektur & FHEVM/Arcana - Matriks Data Konfidensialitas & Kebocoran Disengaja|Matriks Data Konfidensialitas & Intentional Information Leaks]]
- [[04 Arsitektur & FHEVM/Arcana - Kebijakan ACL & Siklus Sealed-Unsealed|Kebijakan Access Control List (ACL) FHEVM]]
- [[04 Arsitektur & FHEVM/Arcana - Analisis Anggaran HCU & Batas Devnet Sepolia|Analisis Anggaran HCU (Homomorphic Computation Units)]]
- **Architecture Decision Records (ADR):**
  - [[04 Arsitektur & FHEVM/ADR/ADR-001 Desain Zero-Revert Clamp Guard (FHE.select)|ADR-001: Desain Zero-Revert Clamp Guard (FHE.select)]]
  - [[04 Arsitektur & FHEVM/ADR/ADR-002 Alur 2-Langkah Gacha (Bayar, Encrypted Draw, Unseal)|ADR-002: Alur 2-Langkah Gacha]]
  - [[04 Arsitektur & FHEVM/ADR/ADR-003 Permutasi Tangan Terenkripsi vs Deck Publik|ADR-003: Permutasi Tangan Terenkripsi vs Deck Publik]]
  - [[04 Arsitektur & FHEVM/ADR/ADR-004 Standar Token ERC-7984 vs Native ETH|ADR-004: Standar Token ERC-7984 vs Native ETH]]
  - [[04 Arsitektur & FHEVM/ADR/ADR-005 Migrasi dari Relayer SDK ke fhevm React SDK|ADR-005: Migrasi ke fhevm React SDK]]

### [[05 Frontend & Ritual UI]]
- [[05 Frontend & Ritual UI/Arcana - Panduan UX & Visual Gotik Mistik|Panduan UX & Tema Visual Gotik Mistik]]
- [[05 Frontend & Ritual UI/Arcana - Desain Ritual Gacha & 3D Flip Framer Motion|Desain Ritual Gacha & 3D Flip Card]]
- [[05 Frontend & Ritual UI/Arcana - Desain Arena Duel & Confidential Hand View|Desain Arena Duel & Tangan Rahasia]]
- [[05 Frontend & Ritual UI/Arcana - Desain Deck Builder & Rule Validations|Desain Deck Builder & Validasi Aturan]]
- [[05 Frontend & Ritual UI/Arcana - Integrasi fhevm React SDK & 1-Signature Session|Integrasi fhevm React SDK & 1-Signature Session]]

### [[06 Backend & Practice Bot]]
- [[06 Backend & Practice Bot/Arcana - Spesifikasi WebSocket & REST API Lobby|Spesifikasi WebSocket & REST API Lobby]]
- [[06 Backend & Practice Bot/Arcana - Automated Practice Bot Engine (FR-20)|Automated Practice Bot Engine (FR-20)]]
- [[06 Backend & Practice Bot/Arcana - Sepolia Event Indexer & State Reconciliation|Sepolia Event Indexer & State Reconciliation]]

### [[07 Verifikasi & Evidence Pack]]
- [[07 Verifikasi & Evidence Pack/Arcana - Evidence Pack & Verification Manifest|Evidence Pack & Verification Manifest Sepolia]]
- [[07 Verifikasi & Evidence Pack/Arcana - Checklist KPI Hackathon (22 KPI Rows)|Checklist KPI Hackathon (22 KPI Rows)]]
- [[07 Verifikasi & Evidence Pack/Arcana - Audit Keamanan & Batas Klaim|Audit Keamanan & Batas Klaim (No Testnet Hash = No Claim)]]

### [[08 Dokumen Submission]]
- [[08 Dokumen Submission/Arcana - Video Pitch Script 3 Menit (Real Human)|Script Video Pitch 3 Menit (Wajah & Suara Asli)]]
- [[08 Dokumen Submission/Arcana - Shotlist Video & Storyboard|Shotlist Video & Storyboard]]
- [[08 Dokumen Submission/Arcana - Thread X (Twitter) 6-Post Launch|Thread X (Twitter) 6-Post Launch Hackathon]]
- [[08 Dokumen Submission/Arcana - Checklist Final Kepatuhan Juri Mainnet Season 5|Checklist Final Kepatuhan Juri Mainnet Season 5]]
- [[08 Dokumen Submission/Arcana - Post-Mortem & Roadmap Pasca-Hackathon|Post-Mortem & Roadmap Pasca-Hackathon]]

### [[09 Backlog & Tim]]
- [[09 Backlog & Tim/Arcana - Backlog Master|Backlog Master (Itemized @arya, @yavin, @adrian)]]
- [[09 Backlog & Tim/Arcana - Pembagian Tim & Kompensasi (70 Arya, 15 Yavin, 15 Adrian)|Pembagian Tim, RACI, & Pembagian Hasil (70:15:15)]]
- [[09 Backlog & Tim/Arcana - Rencana Sprint & Milestones (Sprint 1..5)|Rencana Sprint & Milestones (Sprint 1..5)]]

---

## 📌 Aturan Kerja Wajib Tim (Standing Rules)
1. **Kamus Angka Resmi adalah Kebenaran Tunggal:** Seluruh nilai stat kartu, probabilitas gacha, rumus power, batas HCU harus merujuk ke [[02 Game Design & Balancing/Arcana - Model Data & Kamus Angka Resmi]].
2. **Zero-Revert Guard:** Tidak ada percabangan FHE yang me-revert transaksi saat input rahasia tidak sah. Gunakan \`FHE.select\` untuk clamp senyap demi mencegah kebocoran informasi.
3. **Aturan Kejujuran (Honesty Rule):** Tidak ada transaksi hash Sepolia = tidak ada klaim live.
4. **Alokasi Eksekusi:** Setiap pekerjaan merujuk pada label pemilik di [[09 Backlog & Tim/Arcana - Backlog Master]].
`);

// -----------------------------------------------------------------------------
// 00 Log/Progress Arcana.md
// -----------------------------------------------------------------------------
writeNote("00 Log/Progress Arcana.md", `
# 📝 Progress Log — Veilbound Arcana

Dokumen log ini bersifat **append-only**. Setiap sesi kerja wajib mencatat pencapaian, kendala, dan bukti transaksi/tes.

---

## 2026-11-10 07:15 UTC (Setup Polyrepo & Vault)
- **Done:**
  - Inisialisasi GitHub Organization \`https://github.com/Veilbound-Arcana\` dengan 7 repositori:
    - \`veilbound-arcana\` (Umbrella meta-repo)
    - \`contracts\` (Solidity FHEVM v0.13)
    - \`backend\` (WebSocket lobby & Practice Bot FR-20)
    - \`frontend\` (Next.js & fhevm React SDK)
    - \`sdk\` (@veilbound/sdk)
    - \`scripts\` (deployer, HCU profiler, demo replay)
    - \`veilbound-vault\` (Obsidian Central Knowledge Base)
  - Pembagian job dan kompensasi resmi (Arya 70%, Yavin 15%, Adrian 15%) terdokumentasi di [[09 Backlog & Tim/Arcana - Pembagian Tim & Kompensasi (70 Arya, 15 Yavin, 15 Adrian)]].
  - 20 file metadata JSON kartu Tarot ERC-721 dibuat dan diunggah ke \`assets/metadata/\` dan \`frontend/public/cards/metadata/\`.
  - Simulasi taktis duel CLI (\`scripts/simulate-match.mjs\`) memvalidasi siklus elemental Wands > Swords > Pentacles > Cups > Wands dan aturan zero-revert clamp.
  - Setup CI workflow \`.github/workflows/ci.yml\` untuk automated test and replay check.
- **Evidence:**
  - Replay test lulus: \`npm run demo:replay\` (Output 5/5 valid).
  - Claims check lulus: \`npm run verify:thesis\` (Output 4/4 claims verified).
  - Git commit hash lokal: \`04c5f8e\` (polyrepo initial) & \`b95c125\` (assets & CI).
- **Decisions:**
  - Seluruh smart contract FHEVM menggunakan FHEVM v0.13 dan OpenZeppelin Confidential Contracts.
  - Alur gacha menggunakan pola 2-langkah (bayar & roll tersegel, unseal melalui publikasi dekripsi terverifikasi).
- **Next Steps:**
  - Selesaikan kompilasi Hardhat dan unit test FHE mock untuk M1-04 dan M1-05.
`);

// -----------------------------------------------------------------------------
// 02 Game Design & Balancing/Arcana - Model Data & Kamus Angka Resmi.md
// -----------------------------------------------------------------------------
writeNote("02 Game Design & Balancing/Arcana - Model Data & Kamus Angka Resmi.md", `
# 📐 Kamus Angka Resmi — Veilbound Arcana (Model Data)

Dokumen ini adalah **sumber kebenaran tunggal (single source of truth)** untuk seluruh konstanta angka, probabilitas, parameter duel, dan batas komputasi kriptografi FHEVM pada proyek Veilbound Arcana. Angka di dalam smart contract, backend, frontend, dan SDK **wajib mengikuti nilai di dokumen ini**.

---

## 1. Parameter Dasar Pertarungan (Duel Arena)

| Parameter | Nilai Resmi | Keterangan & Dasar Desain |
| :--- | :---: | :--- |
| **Ukuran Deck Resmi** | **5 Kartu** | Wajib Unsealed, terverifikasi on-chain saat match dimulai |
| **Batas Total Biaya (Cost) Deck** | **Maksimal 12** | Menghindari deck 'all-legendary' (4 Legendary = 16 cost > 12) |
| **Batas Duplikat Kartu** | **Maksimal 2 Salinan** | Maksimal 2 kartu dengan \`cardDefId\` yang sama per deck |
| **Ukuran Tangan (Hand)** | **3 Kartu** | Diambil dan diacak terenkripsi on-chain dari 5 kartu deck |
| **Jumlah Ronde per Match** | **3 Ronde** | Best of 3 format standar TCG cepat |
| **Ambang Kemenangan Match** | **2 Poin Ronde** | Pemain pertama yang memenangkan 2 ronde langsung menang match |
| **Pool Energi Match** | **6 Unit Energi** | Pool energi dibagi bebas oleh pemain lintas 3 ronde (cth: 2-2-2 atau 4-1-1) |
| **Timeout Commit Ronde** | **120 Detik (Demo) / 300 Detik (Std)** | Batas waktu tunggu commit sebelum lawan berhak klaim menang |

---

## 2. Rumus Power Ronde & Modifiers

$$\\text{Power Akhir Ronde} = \\text{Power Dasar Kartu} + \\text{Alokasi Energi} + \\text{Bonus Siklus Suit} + \\text{Efek Orientasi}$$

### A. Siklus Keunggulan Suit (Suit Advantage Cycle)
Siklus batu-gunting-kertas 4 elemen Tarot klasik:
$$\\text{Wands (Api)} > \\text{Swords (Udara)} > \\text{Pentacles (Tanah)} > \\text{Cups (Air)} > \\text{Wands (Api)}$$

- Jika Suit pemain menang terhadap Suit lawan: **+1 Power Bonus**
- Jika Suit sama atau kalah: **+0 Power Bonus**
- Kartu Major Arcana (Legendary) bertipe **Neutral / None**: Tidak memiliki keunggulan suit (+0) dan tidak bisa dikalahkan oleh bonus suit lawan (+0).

### B. Efek Orientasi Kartu (Tarot Flip)
Setiap kartu yang masuk ke tangan mendapatkan orientasi acak terenkripsi on-chain (\`ebool\`):
- **Upright (Tegak):** **+1 Power Modifier**
- **Reversed (Terbalik):** **-1 Power Modifier**

### C. Resolusi & Seri
- Pemain dengan Power Akhir lebih tinggi memenangkan ronde (+1 Poin).
- Jika Power Akhir sama: **Ronde Seri (0 Poin untuk kedua pemain)**.
- Jika setelah 3 ronde skor imbang: **Match Seri (Draw)**.

---

## 3. Peluang Gacha (Tarot Spread Drop Odds)

| Tier Rarity | Odds Gacha | Rentang Ambang Random 8-bit (\`0–255\`) | Jaminan Pity |
| :--- | :---: | :---: | :--- |
| **Common** | **60%** | \`0\` s/d \`152\` | Default tier drop |
| **Rare** | **25%** | \`153\` s/d \`216\` | Jaminan pada tarikan ke-5 tanpa Rare+ |
| **Epic** | **12%** | \`217\` s/d \`247\` | Jaminan pada tarikan ke-12 tanpa Epic+ |
| **Legendary** | **3%** | \`248\` s/d \`255\` | Hard pity pada tarikan ke-25 |

---

## 4. Batas Komputasi FHEVM (Sepolia Devnet)

| Kategori Batas | Batas Maksimum | Aturan Penanganan Veilbound Arcana |
| :--- | :---: | :--- |
| **Global HCU per Transaksi** | **20.000.000 HCU** | Pecah alur gacha (bayar $\\rightarrow$ draw $\\rightarrow$ unseal) |
| **Depth HCU per Transaksi** | **5.000.000 HCU** | Hindari operasi matematika terenkripsi bertingkat |
| **Aturan Zero-Revert (Clamp)** | **Wajib 100%** | Input energi $> \\text{sisa energi}$ otomatis di-clamp ke sisa energi via \`FHE.select\` |
`);

// -----------------------------------------------------------------------------
// 02 Game Design & Balancing/Arcana - Katalog Lengkap 20 Kartu MVP.md
// -----------------------------------------------------------------------------
writeNote("02 Game Design & Balancing/Arcana - Katalog Lengkap 20 Kartu MVP.md", `
# 🎴 Katalog Lengkap 20 Kartu MVP — Veilbound Arcana

Setiap kartu didefinisikan secara permanen di dalam smart contract \`CardCatalog.sol\`.

| ID | Nama Kartu | Arcana | Suit | Rarity | Cost | Base Power | Elemen | Deskripsi Mistik |
| :-: | :--- | :--- | :--- | :--- | :-: | :-: | :--- | :--- |
| **1** | Page of Wands | Minor | Wands | Common | 1 | 2 | Fire | Pengintai api muda yang membawa bara antusiasme pertama. |
| **2** | Knight of Wands | Minor | Wands | Common | 1 | 2 | Fire | Penyerang api cepat yang menerjang tanpa ragu. |
| **3** | Queen of Wands | Minor | Wands | Rare | 2 | 3 | Fire | Penguasa bara agung dengan kharisma membara dan wibawa mutlak. |
| **4** | King of Wands | Minor | Wands | Epic | 3 | 4 | Fire | Titik puncak kekuatan api yang memimpin pertempuran dengan visi mulia. |
| **5** | Page of Cups | Minor | Cups | Common | 1 | 2 | Water | Pembawa kabar emosi dan pesan mistis dari kedalaman samudera. |
| **6** | Knight of Cups | Minor | Cups | Common | 1 | 2 | Water | Pelindung cawan suci yang menunggangi gelombang intuisi. |
| **7** | Queen of Cups | Minor | Cups | Rare | 2 | 3 | Water | Penguasa kedalaman emosi dan mata air ketenangan batin. |
| **8** | King of Cups | Minor | Cups | Epic | 3 | 4 | Water | Penguasa samudra luas yang menundukkan badai dengan kebijaksanaan. |
| **9** | Page of Swords | Minor | Swords | Common | 1 | 2 | Air | Pemikir tajam pemula yang mengamati dari balik tabir angin. |
| **10** | Knight of Swords | Minor | Swords | Common | 1 | 2 | Air | Terjangan badai angin puyuh yang membelah kebohongan seketika. |
| **11** | Queen of Swords | Minor | Swords | Rare | 2 | 3 | Air | Kebijaksanaan dingin yang melihat kebenaran tanpa terdistorsi emosi. |
| **12** | King of Swords | Minor | Swords | Epic | 3 | 4 | Air | Penghakiman udara mutlak dengan intelektualitas tak terbantahkan. |
| **13** | Page of Pentacles | Minor | Pentacles | Common | 1 | 2 | Earth | Pelindung koin tanah yang tekun menanam fondasi kemakmuran. |
| **14** | Knight of Pentacles | Minor | Pentacles | Common | 1 | 2 | Earth | Ketahanan benteng batu yang tak tergoyahkan oleh ujian waktu. |
| **15** | Queen of Pentacles | Minor | Pentacles | Rare | 2 | 3 | Earth | Kemakmuran bumi yang memelihara kehidupan dengan tangan dermawan. |
| **16** | King of Pentacles | Minor | Pentacles | Epic | 3 | 4 | Earth | Penguasa peradaban materi dan fondasi kekayaan tanah abadi. |
| **17** | 0 — The Fool | Major | None | Legendary | 4 | 5 | Aether | Permulaan mistis tanpa batas di tepi jurang takdir kosmik. |
| **18** | I — The Magician | Major | None | Legendary | 4 | 5 | Omni | Pengendali empat elemen penciptaan: Wands, Cups, Swords, Pentacles. |
| **19** | II — High Priestess | Major | None | Legendary | 4 | 5 | Mystery | Penjaga gerbang tabir rahasia dan hikmah tersembunyi semesta. |
| **20** | XXI — The World | Major | None | Legendary | 4 | 5 | Cosmos | Siklus penyelesaian sempurna dan perayaan kesatuan makrokosmos. |
`);

// -----------------------------------------------------------------------------
// 04 Arsitektur & FHEVM/ADR/ADR-001 Desain Zero-Revert Clamp Guard (FHE.select).md
// -----------------------------------------------------------------------------
writeNote("04 Arsitektur & FHEVM/ADR/ADR-001 Desain Zero-Revert Clamp Guard (FHE.select).md", `
# ADR-001: Desain Zero-Revert Clamp Guard via FHE.select

## Status
**Accepted & Enforced**

## Konteks
Pada smart contract EVM konvensional, transaksi yang menerima parameter tidak sah (seperti pemain menawar energi melebihi sisa energi yang dimiliki, atau memilih slot kartu yang tidak ada di tangan) biasanya akan memicu \`revert("Invalid energy bid")\`.

Namun, pada FHEVM, nilai energi dan slot kartu berada dalam bentuk ciphertext (\`euint8\`). Jika smart contract melakukan \`require()\` atau percabangan \`revert\` berdasarkan nilai terenkripsi:
1. **Revert membocorkan informasi rahasia:** Pengamat blok explorer dapat melakukan binary search untuk menebak nilai rahasia berdasarkan transaksi mana yang sukses dan mana yang gagal.
2. **HCU & Execution Hazard:** FHEVM tidak mengizinkan percabangan kondisional publik berdasarkan ciphertext tanpa dekripsi terlebih dahulu.

## Keputusan
Kami mengimplementasikan **Zero-Revert Clamp Guard**:
- Smart contract tidak pernah me-revert transaksi ronde karena nilai tawaran energi yang tidak valid.
- Jika pemain mengirimkan tawaran energi terenkripsi $E_{\\text{bid}}$ yang lebih besar daripada sisa energi pemain $E_{\\text{rem}}$, kontrak secara homomorfik menggunakan \`FHE.select\`:
  \`\`\`solidity
  ebool isExceeded = FHE.gt(encryptedBid, encryptedRemaining);
  euint8 effectiveEnergy = FHE.select(isExceeded, encryptedRemaining, encryptedBid);
  \`\`\`
- Nilai efektif yang digunakan dalam pertarungan di-clamp secara otomatis dan senyap ke nilai sah tertinggi.

## Konsekuensi
- **Positif:** 100% aman dari eksploitasi kebocoran informasi melalui revert transaksi di block explorer.
- **Positif:** Pengalaman pengguna tidak terganggu oleh kegagalan transaksi yang membuang gas.
- **Negatif:** Menambah sedikit konsumsi HCU per ronde (sekitar 320.000 HCU untuk komparasi \`FHE.gt\` dan operasi \`FHE.select\`), namun tetap sangat jauh di bawah batas 20M HCU Sepolia.
`);

// -----------------------------------------------------------------------------
// 04 Arsitektur & FHEVM/ADR/ADR-002 Alur 2-Langkah Gacha (Bayar, Encrypted Draw, Unseal).md
// -----------------------------------------------------------------------------
writeNote("04 Arsitektur & FHEVM/ADR/ADR-002 Alur 2-Langkah Gacha (Bayar, Encrypted Draw, Unseal).md", `
# ADR-002: Alur 2-Langkah Gacha (Bayar, Encrypted Draw, Unseal)

## Status
**Accepted**

## Konteks
Tantangan teknis TD-1 pada PRD menyebutkan: Transfer token konfidensial (ERC-7984) tidak revert saat saldo kurang dalam komputasi terenkripsi, dan pencetakan NFT ERC-721 publik tidak dapat langsung bersyarat pada ciphertext boolean tanpa membuka hasil ke publik. Selain itu, menggabungkan pembayaran, undian acak FHE, dan mint NFT dalam satu transaksi dapat melampaui batas HCU atau gas blok.

## Keputusan
Kami memisahkan siklus hidup penarikan gacha menjadi 2 langkah terpisah:
1. **Langkah 1: Draw (Penarikan Tersegel):**
   - Pemain memanggil \`TarotGacha.drawSingle()\`.
   - Kontrak memotong biaya 1 $FATE.
   - Kontrak menghasilkan angka acak terenkripsi on-chain \`FHE.randEuint8()\` dan menentukan identitas kartu.
   - Kontrak mencetak NFT \`ArcanaCards\` dengan status \`isSealed = true\` dan ciphertext \`sealedDefId\`.
   - Izin dekripsi (\`FHE.allow\`) hanya diberikan kepada pemilik NFT.
2. **Langkah 2: Unseal (Pembukaan Kartu):**
   - Pemain menandatangani sesi dekripsi satu kali di frontend untuk melihat kartu membalik (3D tarot flip).
   - Pemain menekan tombol **Unseal** untuk mempublikasikan bukti dekripsi on-chain.
   - Kontrak mengubah \`isSealed = false\` dan menyimpan \`defId\` plaintext di katalog.
   - Kartu sekarang resmi aktif untuk masuk ke dalam deck 5 kartu atau ditransfer/dipertaruhkan.

## Konsekuensi
- Memastikan batas HCU per transaksi tetap rendah (< 2.000.000 HCU).
- Mencegah bot mengintip isi kartu sebelum memutuskan membatalkan transaksi.
- Memenuhi standar kepatuhan trading NFT ERC-721 konvensional.
`);

// -----------------------------------------------------------------------------
// 08 Dokumen Submission/Arcana - Video Pitch Script 3 Menit (Real Human).md
// -----------------------------------------------------------------------------
writeNote("08 Dokumen Submission/Arcana - Video Pitch Script 3 Menit (Real Human).md", `
# 🎬 Script Video Pitch 3 Menit — Veilbound Arcana

> **Peraturan Wajib Mainnet Season 5:** Video demo wajib berdurasi maksimal 3 menit dan dipresentasikan oleh **orang sungguhan (wajah & suara asli manusia)**. Penggunaan avatar AI atau suara sintetis AI akan langsung mendiskualifikasi submission.

---

### Segment 1: Hook Masalah On-Chain Gaming (0:00 – 0:30)
- **Visual:** Kamera menampilkan wajah presenter (Adrian / Arya), kemudian cut ke layar explorer Sepolia dengan transaksi kartu transparan.
- **Presenter (Bicara):**
  > "Halo juri Mainnet Season 5! Game kartu on-chain saat ini memiliki masalah fatal: transparansi mutlak. Saat Anda menarik gacha, bot bisa membatalkan transaksi bila hasilnya jelek atau men-snipe kartu langka. Dan saat bertarung, tangan dan langkah Anda terlihat di mempool, membunuh esensi bluffing.
  > Kami mempersembahkan **Veilbound Arcana** — confidential Tarot TCG pertama di Sepolia yang ditenagai oleh FHEVM Protocol v0.13."

### Segment 2: Ritual Gacha & Unseal (0:30 – 1:15)
- **Visual:** Screen recording aplikasi Veilbound Arcana. Menghubungkan wallet, menandatangani sesi dekripsi 1 kali, menekan tombol *Draw Single Spread*. Kartu membalik dengan animasi 3D Framer Motion, status beralih dari *Sealed* ke *Unsealed*.
- **Presenter (Voiceover):**
  > "Mari kita mulai dari Ritual Tarot. Menggunakan token konfidensial FateToken standar ERC-7984, pemain menarik spread. Di balik layar, FHE on-chain random roll menentukan kelangkaan kartu secara terenkripsi.
  > Bot di explorer hanya melihat ciphertext — mereka tidak bisa tahu apakah kartu ini Common atau Legendary. Hanya pemilik yang bisa mendekripsinya di browser, lalu menekan tombol Unseal agar kartu aktif di koleksi."

### Segment 3: Duel Arena 3 Ronde & Bluff Taktis (1:15 – 2:15)
- **Visual:** Masuk ke Ruang Duel melawan Practice Bot (FR-20). Memperlihatkan tangan 3 kartu rahasia, memilih kartu slot 1, menggeser slider alokasi energi ke 2, menekan *Commit Round*. Tampilan FHE coprocessor menyelesaikan ronde, dan pengumuman pemenang ronde muncul.
- **Presenter (Voiceover):**
  > "Sekarang, inti permainan: Duel Bluff 3 Ronde. Kedua pemain memiliki 5 kartu deck terkunci, dengan tangan 3 kartu yang hanya bisa dilihat pemiliknya. Tiap ronde, kami mengalokasikan energi dari pool 6 energi dan memilih kartu secara rahasia.
  > FHE coprocessor menghitung power, bonus siklus elemen Wands-Swords-Pentacles-Cups, serta orientasi Upright atau Reversed secara homomorfik.
  > Yang terpenting: sistem kami menerapkan Zero-Revert Clamp Guard. Jika pemain mencoba menawar energi melebihi sisa, nilainya di-clamp secara senyap via \`FHE.select\` tanpa pernah me-revert transaksi!"

### Segment 4: Bukti Kriptografi & Mode Staking (2:15 – 2:45)
- **Visual:** Membuka Halaman Verify, menampilkan daftar transaksi Sepolia yang terverifikasi, odds kontrak publik, dan mode Ante Staking 1-NFT.
- **Presenter (Voiceover):**
  > "Bagi pemain kompetitif, ada Mode Ante: pertaruhkan 1 NFT kartu dengan tier matching yang adil. Semua hasil, bukti dekripsi, dan odds acak dapat diverifikasi di Halaman Verify tanpa mengorbankan privasi tangan pemain."

### Segment 5: Penutup & Roadmap (2:45 – 3:00)
- **Visual:** Kamera kembali ke wajah presenter. Menampilkan alamat demo web dan link GitHub organisasi \`Veilbound-Arcana\`.
- **Presenter (Bicara):**
  > "Veilbound Arcana membuktikan bahwa FHE bukan hanya fitur privasi, tapi fondasi gameplay TCG yang sesungguhnya. Coba demo langsung kami di Sepolia atau jalankan skrip replay offline kami. Terima kasih!"
`);

// -----------------------------------------------------------------------------
// 08 Dokumen Submission/Arcana - Thread X (Twitter) 6-Post Launch.md
// -----------------------------------------------------------------------------
writeNote("08 Dokumen Submission/Arcana - Thread X (Twitter) 6-Post Launch.md", `
# 🧵 Thread X (Twitter) 6-Post Launch — Veilbound Arcana

Draft postingan resmi untuk publikasi submission Developer Program Season 5:

---

### Tweet 1: Hook & Pengumuman Utama
🔮 What if Tarot TCG met Fully Homomorphic Encryption?

Introducing **Veilbound Arcana** — the first confidential Tarot card battler powered by @fhevm_protocol FHEVM on Sepolia!

🃏 On-chain encrypted gacha spreads
🤫 Hidden commit-reveal bluff duels
⚡ Zero-revert clamp mechanics

A thread 🧵👇

---

### Tweet 2: Masalah On-Chain TCG Transparan
1/ Why is Web3 TCG broken today?

On transparent chains:
• Bots inspect mempool & snipe rare gacha pulls
• Your hand is fully visible to opponents
• Second-mover advantage destroys simultaneous play

FHE solves this fundamentally: compute on encrypted state without revealing secrets.

---

### Tweet 3: Ritual Gacha yang Adil
2/ The Tarot Spread Ritual 🎴

Using our confidential $FATE token (ERC-7984), players pull sealed NFT cards.
On-chain FHE random numbers determine rarity under ciphertext.

No front-running. No cancellation exploits. Only you can unseal your destiny.

---

### Tweet 4: Duel Bluff 3 Ronde & Clamp Guard
3/ 3-Round Psychological Bluffing ⚔️

Each duel round, players secretly commit a card & allocate energy from a 6-point pool.
Our contracts evaluate elemental cycles (Wands > Swords > Pentacles > Cups) and Tarot flips homomorphically!

Guaranteed zero data leaks via \`FHE.select\` clamp guards.

---

### Tweet 5: Transparansi & Mode Latihan Mandiri
4/ Built for Judges & Reviewers 🔍

Reviewing solo? Our automated Practice Bot (FR-20) with its own funded Sepolia wallet jumps into matches instantly!
Every draw and duel resolution is auditable on our cryptographic Verify Page.

---

### Tweet 6: Tautan Demo & Repositori
5/ Explore Veilbound Arcana today:

🌐 Live Demo: https://veilbound-arcana.vercel.app
📂 Polyrepo Organization: https://github.com/Veilbound-Arcana
🎥 3-Min Demo Video: [LINK]

Built for fhevm Mainnet Season 5.
Disclaimer: Not audited, endorsed or operated by any third party. Use at your own risk.
`);

// -----------------------------------------------------------------------------
// 09 Backlog & Tim/Arcana - Pembagian Tim & Kompensasi (70 Arya, 15 Yavin, 15 Adrian).md
// -----------------------------------------------------------------------------
writeNote("09 Backlog & Tim/Arcana - Pembagian Tim & Kompensasi (70 Arya, 15 Yavin, 15 Adrian).md", `
# 👥 Pembagian Tim, RACI & Alokasi Kompensasi

Dokumen kesepakatan internal tim pengembang Veilbound Arcana untuk kompetisi Mainnet Season 5.

---

## 1. Alokasi Hadiah & Pembagian Hasil (70 : 15 : 15)

Total hadiah kompetisi: hingga **5.000 cUSDT**.

| Anggota Tim | Porsi (%) | Estimasi Hadiah (Juara 1 / 2.500) | Peran Kunci |
| :--- | :---: | :---: | :--- |
| **Arya (Chenn)** | **70%** | **1.750 cUSDT** | **Lead Architect, Fullstack (Backend & Frontend Lead), SDK** |
| **Yavin** | **15%** | **375 cUSDT** | **FHEVM Smart Contracts & Gas/HCU Profiling Engineer** |
| **Adrian** | **15%** | **375 cUSDT** | **Game Design, Visual Art & Metadata, QA & Video Production** |
| **Total** | **100%** | **2.500 cUSDT** | |

---

## 2. Matriks RACI Terperinci

| Modul & Aktivitas | Arya (@arya) | Yavin (@yavin) | Adrian (@adrian) |
| :--- | :---: | :---: | :---: |
| **Arsitektur Sistem & Review PR** | **A / R** | C | I |
| **FateToken ERC-7984 & Faucet** | A | **R** | I |
| **CardCatalog & ArcanaCards ERC-721** | A | **R** | C |
| **TarotGacha & Pity Counter FHE** | A | **R** | I |
| **DuelEngine & Zero-Revert Clamp Guard** | A | **R** | C |
| **StakeEscrow & Market Swap** | A | **R** | I |
| **Hardhat Unit Tests & HCU Benchmarking**| A | **R** | I |
| **Client SDK (@veilbound/sdk)** | **A / R** | C | I |
| **Backend WebSocket Lobby & Match Room** | **A / R** | I | C |
| **Automated Practice Bot AI (FR-20)** | **A / R** | I | C |
| **Frontend UI (Gacha 3D Flip, Duel Arena)**| **A / R** | C | C |
| **Frontend fhevm React SDK Integration** | **A / R** | C | I |
| **Kurasi 20 Aset Seni Tarot & IPFS** | A | I | **R** |
| **Metadata JSON Generator & Upload** | A | I | **R** |
| **Halaman Verify & Evidence Manifest** | A | C | **R** |
| **Perekaman Video Demo 3 Menit (Real)** | A | C | **R** |
| **Thread X (Twitter) & DevRel Outreach** | A | I | **R** |
| **QA Lintas Wallet & Pengujian Timeout** | A | R | **R** |
| **Final Submission Form & Dry Run** | **A / R** | I | I |

*Keterangan: R = Responsible, A = Accountable, C = Consulted, I = Informed.*
`);

// -----------------------------------------------------------------------------
// 09 Backlog & Tim/Arcana - Backlog Master.md (Massive, complex itemized tasks!)
// -----------------------------------------------------------------------------
writeNote("09 Backlog & Tim/Arcana - Backlog Master.md", `
# 📋 Backlog Master — Veilbound Arcana

Status: **Active Sprint** · Target Submission: **12 Desember 2026** (Deadline Resmi: 14 Desember 2026 23:59 AOE).  
Setiap baris mencantumkan kode ID, modul, deskripsi pekerjaan, pemilik (@arya, @yavin, @adrian), estimasi kompleksitas (L1..L5), prioritas MoSCoW, dan status penyelesaian.

---

## Ringkasan Eksekusi Milestone

| Milestone | Target Tanggal | Fokus Inti | Status |
| :---: | :---: | :--- | :---: |
| **M1** | 10–16 Nov 2026 | Vertical slice 1 ronde FHE, polyrepo setup, kamus angka, simulator taktis | **IN PROGRESS** |
| **M2** | 17–23 Nov 2026 | Tokenomics FateToken ERC-7984, ArcanaCards Sealed/Unseal, TarotGacha Single | PLANNED |
| **M3** | 24–30 Nov 2026 | Deck Builder, DuelEngine 3 ronde, Lobby WebSocket, Practice Bot FR-20 | PLANNED |
| **M4** | 1–7 Des 2026 | Ante Staking 1-NFT, Swap Escrow, Three-Card spread, Halaman Verify polish | PLANNED |
| **M5** | 8–12 Des 2026 | Feature Freeze (8 Des), Video Pitch 3 Menit, Thread X, Final Submit (12 Des) | PLANNED |

---

## 1. Milestone 1: Arsitektur, Polyrepo & Vertical Slice (10–16 Nov 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M1-01** | Infra | Setup Umbrella repo, workspace npm, linting, dan git config | \`@arya · L2\` | Must | **DONE** |
| **M1-02** | Docs | Penyusunan Kamus Angka Resmi, PRD, GDD, dan Peta Alokasi Tim | \`@arya · L2\` | Must | **DONE** |
| **M1-03** | Org | Setup 7 repositori GitHub di org \`Veilbound-Arcana\` via REST API | \`@arya · L2\` | Must | **DONE** |
| **M1-04** | Contract | Inisialisasi Hardhat environment + OpenZeppelin Confidential Contracts | \`@yavin · L3\` | Must | **DONE** |
| **M1-05** | Contract | Prototipe \`CardCatalog.sol\` 20 definisi kartu statis | \`@yavin · L2\` | Must | **DONE** |
| **M1-06** | Contract | Prototipe \`ArcanaCards.sol\` ERC-721 dengan status Sealed/Unsealed | \`@yavin · L3\` | Must | **DONE** |
| **M1-07** | Contract | Prototipe \`FateToken.sol\` ERC-7984 + Faucet harian 10 FATE | \`@yavin · L2\` | Must | **DONE** |
| **M1-08** | Contract | Prototipe \`DuelEngine.sol\` dengan FHE power calculate & clamp guard | \`@yavin · L4\` | Must | **DONE** |
| **M1-09** | Test | Unit test Hardhat untuk FateToken & DuelEngine lifecycle | \`@yavin · L3\` | Must | **DONE** |
| **M1-10** | Sim | Skrip simulator taktis CLI (\`simulate-match.mjs\`) verifikasi formula power | \`@arya · L2\` | Must | **DONE** |
| **M1-11** | Assets | Script generator 20 file JSON metadata kartu Tarot ERC-721 | \`@adrian · L1\` | Must | **DONE** |
| **M1-12** | Replay | Skrip offline match replay (\`demo-replay.mjs\`) untuk dewan juri | \`@adrian · L2\` | Must | **DONE** |
| **M1-13** | Verify | Skrip KPI claims verifier (\`verify-claims.mjs\`) | \`@adrian · L2\` | Must | **DONE** |
| **M1-14** | CI | Setup automated GitHub Actions CI pipeline (\`ci.yml\`) | \`@arya · L2\` | Must | **DONE** |
| **M1-15** | Vault | Penyusunan Obsidian Central Knowledge Base (\`veilbound-vault\`) lengkap | \`@arya · L3\` | Must | **DONE** |

---

## 2. Milestone 2: Ekonomi Token & Ritual Gacha (17–23 Nov 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M2-01** | Contract | Implementasi final \`FateToken.sol\` dengan cooldown 24 jam dan ACL FHEVM | \`@yavin · L3\` | Must | PLANNED |
| **M2-02** | Contract | Implementasi final \`TarotGacha.sol\` Single Spread dengan FHE random roll | \`@yavin · L4\` | Must | PLANNED |
| **M2-03** | Contract | Validasi unseal publik via verifikasi cryptographic proof di kontrak | \`@yavin · L4\` | Must | PLANNED |
| **M2-04** | Contract | Benchmarking konsumsi HCU untuk Single Spread draw (< 2.000.000 HCU) | \`@yavin · L2\` | Must | PLANNED |
| **M2-05** | SDK | Modul enkripsi input bukti fhevm (\`createEncryptedInput\`) di SDK | \`@arya · L3\` | Must | PLANNED |
| **M2-06** | SDK | Pembungkus panggilan kontrak \`drawSingle\` dan \`unseal\` di SDK | \`@arya · L2\` | Must | PLANNED |
| **M2-07** | Frontend | Integrasi wagmi / viem dan deteksi salah jaringan Sepolia (FR-01) | \`@arya · L2\` | Must | PLANNED |
| **M2-08** | Frontend | Implementasi 1-Signature EIP-712 Decryption Session (FR-02) | \`@arya · L3\` | Must | PLANNED |
| **M2-09** | Frontend | UI Halaman Faucet: tampilan saldo terenkripsi dan tombol klaim harian | \`@arya · L2\` | Must | PLANNED |
| **M2-10** | Frontend | UI Ritual Gacha: kartu face-down, 3D flip progresif Framer Motion | \`@arya · L4\` | Must | PLANNED |
| **M2-11** | Frontend | Tombol Unseal dengan visual indicator proses verifikasi dekripsi publik | \`@arya · L2\` | Must | PLANNED |
| **M2-12** | Art | Kurasi dan rendering 20 ilustrasi kartu Tarot gaya gotik mistik | \`@adrian · L3\` | Must | PLANNED |
| **M2-13** | Art | Upload 20 artwork ke IPFS gateway publik dan verifikasi CID | \`@adrian · L2\` | Must | PLANNED |
| **M2-14** | Test | E2E integration test: Klaim faucet -> Draw gacha -> Unseal di Sepolia | \`@yavin · L3\` | Must | PLANNED |

---

## 3. Milestone 3: Deck Builder & Duel Engine 3 Ronde (24–30 Nov 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M3-01** | Contract | Implementasi final \`DuelEngine.sol\` state machine 3 ronde lengkap | \`@yavin · L4\` | Must | PLANNED |
| **M3-02** | Contract | Enkripsi permutasi tangan 3 kartu dari 5 kartu deck terkunci | \`@yavin · L4\` | Must | PLANNED |
| **M3-03** | Contract | Resolusi homomorfik: Base + Energy + SuitCycle + Orientation Modifier | \`@yavin · L4\` | Must | PLANNED |
| **M3-04** | Contract | Pengujian mendalam Zero-Revert Clamp Guard untuk penawaran energi ilegal | \`@yavin · L3\` | Must | PLANNED |
| **M3-05** | Contract | Fungsi timeout ronde (120 detik) dan hak klaim kemenangan pemain aktif | \`@yavin · L3\` | Must | PLANNED |
| **M3-06** | Backend | Server WebSocket lobby (\`roomManager.ts\`) untuk invite code dan matching | \`@arya · L3\` | Must | PLANNED |
| **M3-07** | Backend | **Practice Bot AI Engine (FR-20):** Auto-join, deck lock, dan encrypted commits | \`@arya · L4\` | Must | PLANNED |
| **M3-08** | Backend | Event Indexer Sepolia: mendengarkan event on-chain secara real-time | \`@arya · L3\` | Must | PLANNED |
| **M3-09** | Frontend | UI Deck Builder: seleksi 5 kartu Unsealed, counter cost, max 2 duplicates | \`@arya · L3\` | Must | PLANNED |
| **M3-10** | Frontend | UI Arena Duel: Tangan rahasia (local decryption) dan slider alokasi energi | \`@arya · L4\` | Must | PLANNED |
| **M3-11** | Frontend | Animasi reveal pemenang ronde dan pembaruan papan skor (Best of 3) | \`@arya · L3\` | Must | PLANNED |
| **M3-12** | Frontend | Tombol Practice Mode: langsung memicu pertarungan melawan Practice Bot AI | \`@arya · L2\` | Must | PLANNED |
| **M3-13** | QA | Audit skenario timeout, disconnect, dan refresh halaman saat duel | \`@adrian · L2\` | Must | PLANNED |
| **M3-14** | Test | Hardhat test suite untuk match 3 ronde penuh melawan bot | \`@yavin · L3\` | Must | PLANNED |

---

## 4. Milestone 4: Stake Mode, Swap & Verifikasi Transparansi (1–7 Des 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M4-01** | Contract | Implementasi \`StakeEscrow.sol\` Ante mode (1 NFT wager) | \`@yavin · L3\` | Should | PLANNED |
| **M4-02** | Contract | Validasi tier matching rarity selisih maksimal 1 tier di Ante mode | \`@yavin · L3\` | Should | PLANNED |
| **M4-03** | Contract | Penyelesaian escrow taruhan: transfer kartu lawan ke pemenang / refund saat seri | \`@yavin · L3\` | Should | PLANNED |
| **M4-04** | Contract | Feature flag untuk mematikan mode Stake dengan 1 transaksi pemilik | \`@yavin · L1\` | Should | PLANNED |
| **M4-05** | Contract | Implementasi \`Market.sol\` untuk atomic 1-to-1 card swap escrow | \`@yavin · L3\` | Should | PLANNED |
| **M4-06** | Contract | Implementasi Three-Card Spread (Past, Present, Future) di \`TarotGacha\` | \`@yavin · L3\` | Should | PLANNED |
| **M4-07** | Contract | Encrypted Pity Meter counter per pemain di kontrak gacha | \`@yavin · L3\` | Should | PLANNED |
| **M4-08** | Frontend | UI Lobby Mode Stake dan konfirmasi penyetoran kartu taruhan | \`@arya · L3\` | Should | PLANNED |
| **M4-09** | Frontend | UI Pasar Swap 1-untuk-1: Buat tawaran, terima, batalkan | \`@arya · L3\` | Should | PLANNED |
| **M4-10** | Frontend | Halaman **Verify**: Transkrip match, bukti dekripsi, dan odds kontrak publik | \`@adrian · L3\` | Must | PLANNED |
| **M4-11** | Scripts | Skrip benchmark HCU komprehensif seluruh fungsi FHE di Sepolia | \`@yavin · L2\` | Must | PLANNED |
| **M4-12** | QA | Pengujian alur pengguna baru end-to-end (target $\\le$ 10 menit) | \`@adrian · L2\` | Must | PLANNED |

---

## 5. Milestone 5: Feature Freeze, Polish & Submission (8–12 Des 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M5-01** | Policy | **FEATURE FREEZE (8 Desember 2026)** — Larangan penambahan fitur baru | All | Must | PLANNED |
| **M5-02** | Deploy | Deployment final smart contract ke Sepolia & upload source code terverifikasi | \`@yavin · L3\` | Must | PLANNED |
| **M5-03** | Deploy | Hosting web application ke platform hosting statis publik (Vercel) | \`@arya · L2\` | Must | PLANNED |
| **M5-04** | Media | Perekaman video pitching 3 menit dengan suara & wajah asli (No AI) | \`@adrian · L4\` | Must | PLANNED |
| **M5-05** | Media | Editing video demo dengan layout kartu, audio jernih, dan subtitle | \`@adrian · L3\` | Must | PLANNED |
| **M5-06** | Media | Penulisan dan penjadwalan Thread X 6-post launch hackathon | \`@adrian · L2\` | Must | PLANNED |
| **M5-07** | Docs | Finalisasi README di semua repo: alamat kontrak, live demo, dan disclaimer | \`@arya · L2\` | Must | PLANNED |
| **M5-08** | QA | Dry-run pengisian formulir submission Mainnet Season 5 (verifikasi email API) | \`@arya · L2\` | Must | PLANNED |
| **M5-09** | Submit | **Eksekusi Submission Resmi (12 Desember 2026)** | \`@arya · L1\` | Must | PLANNED |
| **M5-10** | Standby | Masa darurat bug fixing pra-deadline resmi (13–14 Desember 2026) | All | Must | PLANNED |
`);

// -----------------------------------------------------------------------------
// 09 Backlog & Tim/Arcana - Rencana Sprint & Milestones (Sprint 1..5).md
// -----------------------------------------------------------------------------
writeNote("09 Backlog & Tim/Arcana - Rencana Sprint & Milestones (Sprint 1..5).md", `
# 🏃 Rencana Sprint & Milestones — Veilbound Arcana

Jadwal kerja tim mengikuti 5 sprint terstruktur menuju tenggat submission resmi **14 Desember 2026, 23.59 AOE** (Target internal submit: **12 Desember 2026**).

---

## Sprint 1: Setup & Vertical Slice (10–16 Nov 2026)
- **Fokus:** Setup infrastruktur polyrepo, kontrak dasar FHE, simulator taktis, kamus angka resmi.
- **DoD (Definition of Done):** 7 repo GitHub terhubung, 1 ronde FHE berjalan di tes Hardhat, 20 metadata JSON terbuat, skrip replay offline lulus.
- **Standup Status:** 100% On Track.

## Sprint 2: Ekonomi Token & Gacha (17–23 Nov 2026)
- **Fokus:** FateToken ERC-7984, NFT ArcanaCards Sealed/Unsealed, TarotGacha Single Spread on-chain, integrasi fhevm React SDK.
- **DoD:** Pengguna baru dapat mengklaim faucet, menarik kartu tersegel, dan melakukan Unseal di Sepolia testnet.

## Sprint 3: Duel Arena & Practice Bot AI (24–30 Nov 2026)
- **Fokus:** DuelEngine 3 ronde lengkap, deck builder 5 kartu, WebSocket lobby server, Practice Bot AI (FR-20).
- **DoD:** Juri atau reviewer dapat bermain 3 ronde penuh secara mandiri melawan bot AI di Sepolia.

## Sprint 4: Stake Mode, Swap & Verify Page (1–7 Des 2026)
- **Fokus:** Mode Ante staking 1-NFT dengan tier matching, pasar swap 1-untuk-1, Three-Card spread, dan pemolesan Halaman Verify.
- **DoD:** Halaman Verify menampilkan bukti transaksi dan transkrip match yang valid; alur E2E pengguna < 10 menit.

## Sprint 5: Freeze, Pitch Video & Final Submission (8–12 Des 2026)
- **Fokus:** Feature Freeze (8 Des), perekaman video demo 3 menit oleh orang sungguhan, thread X, final audit disclaimer, dan eksekusi submit (12 Des).
- **DoD:** Formulir submission Mainnet Season 5 terkirim dengan konfirmasi email yang valid.
`);

console.log("Vault files built successfully!");
