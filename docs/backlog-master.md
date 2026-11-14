# Veilbound Arcana — Backlog Master

Status: Active Sprint · Target Submission: 12 Desember 2026 (Deadline Resmi: 14 Desember 2026 23:59 AOE).  
Setiap baris mencantumkan pemilik tugas (`@arya`, `@yavin`, `@adrian`), prioritas MoSCoW, dan status penyelesaian.

---

## Ringkasan Progres Milestone

| Milestone | Rentang Waktu | Fokus Utama | Target Status |
| :---: | :---: | :--- | :---: |
| **M1** | 10–16 Nov 2026 | Vertical slice 1 ronde (commit, resolve, decrypt) + template setup | In Progress |
| **M2** | 17–23 Nov 2026 | FateToken ERC-7984, ArcanaCards, TarotGacha Single, Unseal | Planned |
| **M3** | 24–30 Nov 2026 | Deck builder, DuelEngine 3 ronde penuh, Lobby, Practice Bot (FR-20) | Planned |
| **M4** | 1–7 Des 2026 | Stake Ante, 1-to-1 swap, Three-Card spread, Pity meter, Halaman Verify | Planned |
| **M5** | 8–12 Des 2026 | Feature Freeze (8 Des), Audit HCU, Video 3 Menit, Thread X, Final Submit | Planned |

---

## 1. Milestone 1 (M1): Setup & Vertical Slice (10–16 Nov 2026)

| ID | Modul | Deskripsi Tugas | Pemilik | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M1-01** | Infra | Setup Umbrella repo, Git, lint, workspaces (`contracts`, `backend`, `frontend`, `sdk`, `scripts`) | `@arya` | Must | **DONE** |
| **M1-02** | Docs | Penyusunan Backlog Master, Alokasi Tim, Kamus Angka, dan Panduan Hackathon | `@arya` | Must | **DONE** |
| **M1-03** | Contract | Inisialisasi Hardhat FHEVM v0.13 template + OpenZeppelin Confidential Contracts | `@yavin` | Must | In Progress |
| **M1-04** | Contract | Prototipe `DuelEngineSlice.sol`: 1 ronde commit terenkripsi, resolusi power, dan dekripsi publik | `@yavin` | Must | In Progress |
| **M1-05** | Contract | Implementasi fungsi clamp (`FHE.select`) untuk energi dan slot kartu (zero-revert rule) | `@yavin` | Must | In Progress |
| **M1-06** | Test | Unit test Hardhat untuk 1 ronde duel dengan mock FHEVM + pencatatan benchmark HCU awal | `@yavin` | Must | Planned |
| **M1-07** | Art | Konsep visual tema mistik gotik Tarot dan template kartu (Common, Rare, Epic, Legendary) | `@adrian` | Must | In Progress |
| **M1-08** | Verify | Template `evidence-pack.md` dan skrip replikasi offline `demo-replay.mjs` | `@adrian` | Must | **DONE** |

---

## 2. Milestone 2 (M2): Ekonomi Token & Ritual Gacha (17–23 Nov 2026)

| ID | Modul | Deskripsi Tugas | Pemilik | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M2-01** | Contract | `FateToken.sol` (ERC-7984 confidential balance) + fungsi faucet klaim harian | `@yavin` | Must | Planned |
| **M2-02** | Contract | `CardCatalog.sol` berisi 20 definisi kartu statis (power, cost, suit, arcana) | `@yavin` | Must | Planned |
| **M2-03** | Contract | `ArcanaCards.sol` (ERC-721 NFT) dengan status Sealed (ciphertext `euint8`) dan Unsealed | `@yavin` | Must | Planned |
| **M2-04** | Contract | `TarotGacha.sol` Single Spread: FHE random rarity roll dan mint kartu tersegel | `@yavin` | Must | Planned |
| **M2-05** | Contract | Mekanisme Unseal publik terverifikasi on-chain | `@yavin` | Must | Planned |
| **M2-06** | SDK | `@veilbound/sdk`: module enkripsi input, wrapper panggilan kontrak gacha & unseal | `@arya` | Must | Planned |
| **M2-07** | Frontend | Integrasi wagmi / viem + sesi dekripsi satu tanda tangan Zama React SDK | `@arya` | Must | Planned |
| **M2-08** | Frontend | Halaman Faucet `$FATE` dan tampilan saldo rahasia yang terdekripsi | `@arya` | Must | Planned |
| **M2-09** | Frontend | UI Ritual Gacha: kartu face-down, 3D flip progresif, dan animasi unseal | `@arya` | Must | Planned |
| **M2-10** | Art | Produksi 20 artwork Tarot final dan upload metadata JSON ke IPFS/CDN | `@adrian` | Must | Planned |

---

## 3. Milestone 3 (M3): Deck Builder & Duel 3 Ronde (24–30 Nov 2026)

| ID | Modul | Deskripsi Tugas | Pemilik | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M3-01** | Contract | `DuelEngine.sol` lengkap: state machine 3 ronde, kunci decklist 5 kartu, acak tangan 3 kartu | `@yavin` | Must | Planned |
| **M3-02** | Contract | Perhitungan power ronde: base power + alokasi energi (pool 6) + siklus suit + orientasi kartu | `@yavin` | Must | Planned |
| **M3-03** | Contract | Mekanisme batas waktu commit (timeout) dan fungsi klaim menang bagi pemain aktif | `@yavin` | Must | Planned |
| **M3-04** | Frontend | UI Deck Builder: pemilihan 5 kartu Unsealed, validasi max cost $\le$ 12, max 2 copy | `@arya` | Must | Planned |
| **M3-05** | Frontend | UI Duel Arena: tampilan tangan terdekripsi lokal, dial slider energi, status commit | `@arya` | Must | Planned |
| **M3-06** | Frontend | Animasi reveal ronde dan papan skor (first to 2 round wins) | `@arya` | Must | Planned |
| **M3-07** | Backend | WebSocket server untuk lobby ruangan duel dan sinkronisasi state match | `@arya` | Must | Planned |
| **M3-08** | Backend | Practice Bot Engine (FR-20): AI otomatis untuk reviewer juri hackathon | `@arya` | Must | Planned |
| **M3-09** | QA | Test simulasi timeout dan refresh halaman saat match berlangsung | `@adrian` | Must | Planned |

---

## 4. Milestone 4 (M4): Stake Mode, Swap & Verifikasi (1–7 Des 2026)

| ID | Modul | Deskripsi Tugas | Pemilik | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M4-01** | Contract | `StakeEscrow.sol`: Ante mode (setor 1 NFT unsealed, verifikasi selisih rarity $\le$ 1 tier) | `@yavin` | Should | Planned |
| **M4-02** | Contract | Resolusi Stake: transfer NFT lawan ke pemenang, pengembalian saat seri/draw | `@yavin` | Should | Planned |
| **M4-03** | Contract | `Market.sol`: Escrow swap kartu 1-untuk-1 atomik | `@yavin` | Should | Planned |
| **M4-04** | Contract | `TarotGacha.sol` Three-Card spread (Past, Present, Future) + encrypted pity counter | `@yavin` | Should | Planned |
| **M4-05** | Frontend | UI Stake Duel lobby & konfirmasi penyetoran kartu taruhan | `@arya` | Should | Planned |
| **M4-06** | Frontend | UI Pasar Swap 1-untuk-1 (buat tawaran, terima tawaran, batalkan) | `@arya` | Should | Planned |
| **M4-07** | Frontend | Halaman **Verify**: transkrip match, bukti dekripsi ronde, dan odds kontrak gacha | `@adrian` | Must | Planned |
| **M4-08** | Scripts | Skrip benchmark HCU komprehensif seluruh fungsi FHE di Sepolia | `@yavin` | Must | Planned |
| **M4-09** | QA | Uji coba alur pengguna baru end-to-end (target $\le$ 10 menit) | `@adrian` | Must | Planned |

---

## 5. Milestone 5 (M5): Freeze, Polish, Submission (8–12 Des 2026)

| ID | Modul | Deskripsi Tugas | Pemilik | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M5-01** | Policy | **FEATURE FREEZE (8 Desember 2026)** — Tidak ada penambahan fitur baru | All | Must | Planned |
| **M5-02** | Deploy | Deployment final seluruh smart contract ke Sepolia & upload source code terverifikasi | `@yavin` | Must | Planned |
| **M5-03** | Deploy | Deployment web aplikasi frontend ke production hosting statis (Vercel) | `@arya` | Must | Planned |
| **M5-04** | Media | Perekaman & editing Video Demo Pitch 3 Menit (Wajib wajah & suara asli manusia) | `@adrian` | Must | Planned |
| **M5-05** | Media | Penulisan & publikasi Thread X (6 postingan edukasi dan demo gameplay) | `@adrian` | Must | Planned |
| **M5-06** | Docs | Finalisasi README.md: alamat kontrak Sepolia, link demo, dan disclaimer wajib | `@arya` | Must | Planned |
| **M5-07** | QA | Dry-run formulir submission Zama Season 5 (cek kecocokan email API key) | `@arya` | Must | Planned |
| **M5-08** | Submit | **Eksekusi Submission Resmi (Target: 12 Desember 2026)** | `@arya` | Must | Planned |

---

## 6. Session Log — 14 November 2026

| ID | Modul | Pekerjaan | Pemilik | Status |
| :--- | :--- | :--- | :---: | :---: |
| **LOG-01** | Frontend/Art | Mesin ilustrasi karakter orisinal (`characterEngine.ts`) + 100 SVG unik per kartu | `@arya` | **Done** |
| **LOG-02** | Frontend/Art | Komponen `CharacterArt` + `CharacterFigure` dengan animasi idle/serang/sakit/KO | `@arya` | **Done** |
| **LOG-03** | Frontend | Integrasi karakter ke `CardView`, `S02Home`, `S07CardDetail`, `S15BattleBoard` | `@arya` | **Done** |
| **LOG-04** | Frontend | Migrasi penuh Vite + react-router → **Next.js 15.5.29 + TypeScript** (App Router, 19 route) | `@arya` | **Done** |
| **LOG-05** | Scripts | Generator `scripts/generate-character-art.mjs` + enrich metadata 20 kartu | `@arya` | **Done** |
| **LOG-06** | Docs | `ASSETS.md`, `docs/evidence-pack.md` diperbarui; dependensi runtime 6 | `@arya` | **Done** |

Verifikasi: `npx tsc --noEmit` 0 error · `npx next build` sukses · 100/100 SVG valid ·
render `/`, `/archive`, `/card/c-008`, `/duel` diverifikasi di browser.
