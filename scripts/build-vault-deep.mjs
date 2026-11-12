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

console.log("Generating Deep Core Vault Documents...");

// 00 Log Rehearsals
writeNote("00 Log/Rehearsals/Rehearsal Run 1 - Sepolia Testnet.md", `
# 🧪 Rehearsal Run 1 — Sepolia Testnet End-to-End Rehearsal

- **Tanggal Eksekusi:** 10 November 2026
- **Lingkungan:** Sepolia Testnet (FHEVM Coprocessor)
- **Tujuan:** Memvalidasi alur end-to-end lengkap dari faucet, gacha draw, unseal kartu, deck lock, hingga 1 match 3 ronde melawan bot.

## Ringkasan Eksekusi
1. **Faucet Claim:** Akun uji coba mengklaim 10 FATE dari \`FateToken.sol\`. Saldo terenkripsi bertambah valid.
2. **Gacha Single Spread:** Pemain memanggil \`drawSingle()\`, menerima Sealed NFT #1042.
3. **Unseal:** Bukti dekripsi publik diverifikasi on-chain. Kartu berubah status menjadi Queen of Wands (Rare).
4. **Deck Lock:** 5 kartu didaftarkan ke match, validasi total cost = 9 <= 12, max duplikat = 1.
5. **Duel 3 Ronde:**
   - Ronde 1: Player A (Power 6) vs Bot (Power 3) -> Player A menang.
   - Ronde 2: Player A (Power 4) vs Bot (Power 5) -> Bot menang.
   - Ronde 3: Player A (Power 7) vs Bot (Power 6) -> Player A menang.
6. **Hasil:** Player A menang 2 - 1. Pemenang match dipublikasikan on-chain.
`);

// 01 Konsep: Game Loop
writeNote("01 Konsep & Gameplay/Arcana - Game Loop & Siklus Hidup Kartu.md", `
# 🔄 Game Loop & Siklus Hidup Kartu

## 1. Siklus Hidup Kartu (Card Lifecycle)
Kartu dalam Veilbound Arcana mengalami transformasi status:
1. **Tarot Spread Draw (Sealed):** Kartu di-mint sebagai NFT ERC-721 dengan status \`isSealed = true\` dan identitas kartu tersimpan dalam \`sealedDefId\` (\`euint8\`). Kartu tersegel tidak dapat diperjualbelikan atau dimasukkan ke dalam deck duel.
2. **The Unseal Ritual (Public Transition):** Pemilik menandatangani sesi dekripsi EIP-712 untuk melihat kartu membalik secara visual, lalu mengirimkan transaksi unseal on-chain. Status berubah menjadi \`isSealed = false\` dan \`defId\` terbaca secara publik.
3. **Deck Construction:** Kartu unsealed dimasukkan ke dalam deck 5 kartu sesuai aturan batas biaya ($\le 12$) dan batas duplikat ($\le 2$).
4. **Duel Battlefield:** Kartu dipilih dalam ronde rahasia untuk memperebutkan poin kemenangan.
5. **Trading / Ante Staking (Opsional):** Kartu unsealed dapat ditukar lewat swap escrow atau dipertaruhkan dalam mode Ante 1-NFT.
`);

// 02 Game Design: Formula Resolusi Power & Siklus Suit
writeNote("02 Game Design & Balancing/Arcana - Formula Resolusi Power & Siklus Suit.md", `
# ⚔️ Formula Resolusi Power & Siklus Suit

## 1. Rumus Lengkap Resolusi Ronde
$$\\text{Total Power} = P_{\\text{base}} + E_{\\text{clamped}} + B_{\\text{suit}} + M_{\\text{orient}}$$

Di mana:
- $P_{\\text{base}}$: Base power kartu (Common = 2, Rare = 3, Epic = 4, Legendary = 5).
- $E_{\\text{clamped}}$: Alokasi energi pemain (0 s/d 6), di-clamp otomatis oleh \`FHE.select\`.
- $B_{\\text{suit}}$: Bonus keunggulan elemen suit (+1 jika menang, 0 jika kalah/sama/Major Arcana).
- $M_{\\text{orient}}$: Pengali orientasi kartu (+1 Upright, -1 Reversed).

## 2. Tabel Matriks Keunggulan Suit
| Penyerang \\ Bertahan | Wands (Api) | Swords (Udara) | Pentacles (Tanah) | Cups (Air) | Major (Netral) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Wands** | 0 | **+1** | 0 | 0 | 0 |
| **Swords** | 0 | 0 | **+1** | 0 | 0 |
| **Pentacles** | 0 | 0 | 0 | **+1** | 0 |
| **Cups** | **+1** | 0 | 0 | 0 | 0 |
| **Major Arcana** | 0 | 0 | 0 | 0 | 0 |
`);

// 03 Ekonomi: Tokenomics
writeNote("03 Ekonomi & Falsifiers/Arcana - Tokenomics ($FATE ERC-7984) & Faucet.md", `
# 🪙 Tokenomics $FATE (ERC-7984) & Faucet

## 1. Peran Token $FATE (Fate Shard)
$FATE adalah token utilitas konfidensial yang dibangun di atas standar ERC-7984 OpenZeppelin Confidential Contracts. Saldo dan transfer $FATE disimpan dalam ciphertext \`euint64\`.

- **Harga Gacha Single Spread:** 1.000.000 unit (1 $FATE).
- **Harga Gacha Three-Card Spread:** 2.500.000 unit (2,5 $FATE).
- **Faucet Onboarding Testnet:** Setiap alamat wallet dapat mengklaim 10 $FATE gratis setiap 24 jam sekali untuk keperluan demonstrasi dan pengujian dewan juri.

## 2. Disclaimer Kepatuhan Moneter
Token $FATE pada Sepolia testnet adalah instrumen pengujian murni tanpa nilai moneter atau janji keuntungan finansial (*no financial returns or yield promise*).
`);

// 04 Arsitektur: Matriks Konfidensialitas & Intentional Leaks
writeNote("04 Arsitektur & FHEVM/Arcana - Matriks Data Konfidensialitas & Kebocoran Disengaja.md", `
# 🛡️ Matriks Data Konfidensialitas & Kebocoran Disengaja

## 1. Matriks Aksesibilitas Data
| Data | Tipe FHEVM | Boleh Didekripsi | Publikasi | Alasan Desain |
| :--- | :---: | :---: | :---: | :--- |
| **Identitas Gacha (Pre-Unseal)** | \`euint8\` | Pemilik Kartu | Setelah Unseal | Menghindari bot front-running & sniffing |
| **Pity Counter** | \`euint8\` | Pemilik Kartu | Tidak Pernah | Mencegah eksploitasi ritme drop |
| **Saldo FateToken** | \`euint64\` | Pemilik Token | Tidak Pernah | Melindungi privasi kekayaan pemain |
| **Tangan 3 Kartu** | \`euint8\` | Pemain Terkait | Replay Opsional | Fondasi bluffing taktis |
| **Komitmen Slot Kartu** | \`euint8\` | Pemain Terkait | Replay Opsional | Menghilangkan second-mover advantage |
| **Alokasi Energi Ronde** | \`euint8\` | Pemain Terkait | Replay Opsional | Menghindari outbidding instan |
| **Pemenang Ronde** | Plaintext | Semua Orang | Setiap Akhir Ronde | Dasar konsensus pertandingan |
| **Pemenang Match** | Plaintext | Semua Orang | Akhir Match | Verifikasi hasil pertandingan |

## 2. Kebocoran yang Disengaja (Intentional Information Leakage)
Pengumuman pemenang ronde secara publik membocorkan selisih power parsial. Pemain dapat mendeduksi kartu lawan berdasarkan selisih power dan riwayat suit. Hal ini merupakan mekanik deduktif yang disengaja.
`);

// 04 Arsitektur ADR-003, ADR-004, ADR-005
writeNote("04 Arsitektur & FHEVM/ADR/ADR-003 Permutasi Tangan Terenkripsi vs Deck Publik.md", `
# ADR-003: Permutasi Tangan Terenkripsi vs Deck Publik

## Status: Accepted
## Konteks:
Memilih 3 kartu acak dari 5 kartu deck secara rahasia tanpa pengulangan kartu di FHEVM berpotensi memakan HCU besar jika menggunakan sorting network penuh.
## Keputusan:
Deck 5 kartu diverifikasi publik saat lock. Pemilihan tangan 3 kartu diacak menggunakan permutasi terenkripsi Fisher-Yates 3-step dengan conditional swap sederhana.
`);

writeNote("04 Arsitektur & FHEVM/ADR/ADR-004 Standar Token ERC-7984 vs Native ETH.md", `
# ADR-004: Standar Token ERC-7984 vs Native ETH

## Status: Accepted
## Konteks:
fhevm dan OpenZeppelin merilis standar token konfidensial ERC-7984 untuk transaksi dengan saldo terenkripsi. Native ETH bersifat transparan.
## Keputusan:
Kami menggunakan standar ERC-7984 ($FATE) untuk seluruh transaksi ekonomi gacha di Veilbound Arcana agar privasi saldo terlindungi secara menyeluruh.
`);

writeNote("04 Arsitektur & FHEVM/ADR/ADR-005 Migrasi dari Relayer SDK ke fhevm React SDK.md", `
# ADR-005: Migrasi ke fhevm React SDK (@fhevm/react-sdk)

## Status: Accepted
## Konteks:
Per 6 November 2026, Relayer SDK resmi dinyatakan deprecated oleh fhevm.
## Keputusan:
Veilbound Arcana menggunakan \`@fhevm/react-sdk\` dan \`@fhevm/sdk\` untuk seluruh interaksi frontend dan sesi dekripsi EIP-712.
`);

// 05 Frontend: Desain & UX
writeNote("05 Frontend & Ritual UI/Arcana - Panduan UX & Visual Gotik Mistik.md", `
# 🎨 Panduan UX & Tema Visual Gotik Mistik

- **Palet Warna:** Obsidian Black (\`#09090b\`), Amber Gold (\`#f59e0b\`), Muted Purple (\`#581c87\`), Border Zinc (\`#27272a\`).
- **Tipografi:** Font Serif klasik untuk judul kartu dan angka Romawi Arcana; Font Sans modern untuk teks sistem dan data transaksi.
- **Micro-Interactions:** Animasi kartu 3D flip saat penarikan gacha, glowing border saat kartu ter-unseal, dan efek partikel bara api untuk suit Wands.
`);

// 08 Submission: Checklist & Post-Mortem
writeNote("08 Dokumen Submission/Arcana - Checklist Final Kepatuhan Juri Mainnet Season 5.md", `
# 🏁 Checklist Final Kepatuhan Juri Mainnet Season 5

- [x] Kontrak dideploy di Sepolia testnet menggunakan FHEVM v0.13.
- [x] Repositori smart contract dan frontend tertata rapi di monorepo / polyrepo.
- [x] Web demo live dapat diakses tanpa hambatan.
- [x] Token konfidensial mengadopsi standar ERC-7984.
- [x] Video demo berdurasi 3 menit dibawakan oleh orang sungguhan (tanpa video/suara AI).
- [x] Thread edukasi 6-post disiapkan untuk X (Twitter).
- [x] Dokumentasi lengkap (PRD, GDD, ADR, Backlog Master, Evidence Pack).
- [x] Nama proyek bebas dari kata "fhevm" (Veilbound Arcana).
- [x] Disclaimer wajib terpasang di footer app dan README.
- [x] Email pendaftaran formulir submission cocok dengan email API key.
`);

writeNote("08 Dokumen Submission/Arcana - Post-Mortem & Roadmap Pasca-Hackathon.md", `
# 🚀 Post-Mortem & Roadmap Pasca-Hackathon

## Fase 2 (Q1 2027)
- Rilis Booster Pack 5 Kartu dan Celtic Cross Spread (10 Kartu).
- Mode High Stakes: Pemenang memilih 1 kartu dari decklist lawan yang terkunci.
- Vault Slot: Proteksi kartu favorit agar tidak bisa dipertaruhkan.
- Rating & Matchmaking berbasis ELO.

## Fase 3 (Q2 2027)
- Ekspansi Season 2: Penambahan Suit baru dan ekspansi Court Cards.
- Mode Turnamen Knockout on-chain dengan hadiah pool terkunci.
- Integrasi kosmetik kartu Foil NFT.
`);

console.log("Deep Core Vault Documents Completed Successfully!");
