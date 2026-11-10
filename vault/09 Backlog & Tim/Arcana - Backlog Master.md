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
| **M1-01** | Infra | Setup Umbrella repo, workspace npm, linting, dan git config | `@arya · L2` | Must | **DONE** |
| **M1-02** | Docs | Penyusunan Kamus Angka Resmi, PRD, GDD, dan Peta Alokasi Tim | `@arya · L2` | Must | **DONE** |
| **M1-03** | Org | Setup 7 repositori GitHub di org `Veilbound-Arcana` via REST API | `@arya · L2` | Must | **DONE** |
| **M1-04** | Contract | Inisialisasi Hardhat environment + OpenZeppelin Confidential Contracts | `@yavin · L3` | Must | **DONE** |
| **M1-05** | Contract | Prototipe `CardCatalog.sol` 20 definisi kartu statis | `@yavin · L2` | Must | **DONE** |
| **M1-06** | Contract | Prototipe `ArcanaCards.sol` ERC-721 dengan status Sealed/Unsealed | `@yavin · L3` | Must | **DONE** |
| **M1-07** | Contract | Prototipe `FateToken.sol` ERC-7984 + Faucet harian 10 FATE | `@yavin · L2` | Must | **DONE** |
| **M1-08** | Contract | Prototipe `DuelEngine.sol` dengan FHE power calculate & clamp guard | `@yavin · L4` | Must | **DONE** |
| **M1-09** | Test | Unit test Hardhat untuk FateToken & DuelEngine lifecycle | `@yavin · L3` | Must | **DONE** |
| **M1-10** | Sim | Skrip simulator taktis CLI (`simulate-match.mjs`) verifikasi formula power | `@arya · L2` | Must | **DONE** |
| **M1-11** | Assets | Script generator 20 file JSON metadata kartu Tarot ERC-721 | `@adrian · L1` | Must | **DONE** |
| **M1-12** | Replay | Skrip offline match replay (`demo-replay.mjs`) untuk dewan juri | `@adrian · L2` | Must | **DONE** |
| **M1-13** | Verify | Skrip KPI claims verifier (`verify-claims.mjs`) | `@adrian · L2` | Must | **DONE** |
| **M1-14** | CI | Setup automated GitHub Actions CI pipeline (`ci.yml`) | `@arya · L2` | Must | **DONE** |
| **M1-15** | Vault | Penyusunan Obsidian Central Knowledge Base (`veilbound-vault`) lengkap | `@arya · L3` | Must | **DONE** |

---

## 2. Milestone 2: Ekonomi Token & Ritual Gacha (17–23 Nov 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M2-01** | Contract | Implementasi final `FateToken.sol` dengan cooldown 24 jam dan ACL FHEVM | `@yavin · L3` | Must | PLANNED |
| **M2-02** | Contract | Implementasi final `TarotGacha.sol` Single Spread dengan FHE random roll | `@yavin · L4` | Must | PLANNED |
| **M2-03** | Contract | Validasi unseal publik via verifikasi cryptographic proof di kontrak | `@yavin · L4` | Must | PLANNED |
| **M2-04** | Contract | Benchmarking konsumsi HCU untuk Single Spread draw (< 2.000.000 HCU) | `@yavin · L2` | Must | PLANNED |
| **M2-05** | SDK | Modul enkripsi input bukti Zama (`createEncryptedInput`) di SDK | `@arya · L3` | Must | PLANNED |
| **M2-06** | SDK | Pembungkus panggilan kontrak `drawSingle` dan `unseal` di SDK | `@arya · L2` | Must | PLANNED |
| **M2-07** | Frontend | Integrasi wagmi / viem dan deteksi salah jaringan Sepolia (FR-01) | `@arya · L2` | Must | PLANNED |
| **M2-08** | Frontend | Implementasi 1-Signature EIP-712 Decryption Session (FR-02) | `@arya · L3` | Must | PLANNED |
| **M2-09** | Frontend | UI Halaman Faucet: tampilan saldo terenkripsi dan tombol klaim harian | `@arya · L2` | Must | PLANNED |
| **M2-10** | Frontend | UI Ritual Gacha: kartu face-down, 3D flip progresif Framer Motion | `@arya · L4` | Must | PLANNED |
| **M2-11** | Frontend | Tombol Unseal dengan visual indicator proses verifikasi dekripsi publik | `@arya · L2` | Must | PLANNED |
| **M2-12** | Art | Kurasi dan rendering 20 ilustrasi kartu Tarot gaya gotik mistik | `@adrian · L3` | Must | PLANNED |
| **M2-13** | Art | Upload 20 artwork ke IPFS gateway publik dan verifikasi CID | `@adrian · L2` | Must | PLANNED |
| **M2-14** | Test | E2E integration test: Klaim faucet -> Draw gacha -> Unseal di Sepolia | `@yavin · L3` | Must | PLANNED |

---

## 3. Milestone 3: Deck Builder & Duel Engine 3 Ronde (24–30 Nov 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M3-01** | Contract | Implementasi final `DuelEngine.sol` state machine 3 ronde lengkap | `@yavin · L4` | Must | PLANNED |
| **M3-02** | Contract | Enkripsi permutasi tangan 3 kartu dari 5 kartu deck terkunci | `@yavin · L4` | Must | PLANNED |
| **M3-03** | Contract | Resolusi homomorfik: Base + Energy + SuitCycle + Orientation Modifier | `@yavin · L4` | Must | PLANNED |
| **M3-04** | Contract | Pengujian mendalam Zero-Revert Clamp Guard untuk penawaran energi ilegal | `@yavin · L3` | Must | PLANNED |
| **M3-05** | Contract | Fungsi timeout ronde (120 detik) dan hak klaim kemenangan pemain aktif | `@yavin · L3` | Must | PLANNED |
| **M3-06** | Backend | Server WebSocket lobby (`roomManager.ts`) untuk invite code dan matching | `@arya · L3` | Must | PLANNED |
| **M3-07** | Backend | **Practice Bot AI Engine (FR-20):** Auto-join, deck lock, dan encrypted commits | `@arya · L4` | Must | PLANNED |
| **M3-08** | Backend | Event Indexer Sepolia: mendengarkan event on-chain secara real-time | `@arya · L3` | Must | PLANNED |
| **M3-09** | Frontend | UI Deck Builder: seleksi 5 kartu Unsealed, counter cost, max 2 duplicates | `@arya · L3` | Must | PLANNED |
| **M3-10** | Frontend | UI Arena Duel: Tangan rahasia (local decryption) dan slider alokasi energi | `@arya · L4` | Must | PLANNED |
| **M3-11** | Frontend | Animasi reveal pemenang ronde dan pembaruan papan skor (Best of 3) | `@arya · L3` | Must | PLANNED |
| **M3-12** | Frontend | Tombol Practice Mode: langsung memicu pertarungan melawan Practice Bot AI | `@arya · L2` | Must | PLANNED |
| **M3-13** | QA | Audit skenario timeout, disconnect, dan refresh halaman saat duel | `@adrian · L2` | Must | PLANNED |
| **M3-14** | Test | Hardhat test suite untuk match 3 ronde penuh melawan bot | `@yavin · L3` | Must | PLANNED |

---

## 4. Milestone 4: Stake Mode, Swap & Verifikasi Transparansi (1–7 Des 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M4-01** | Contract | Implementasi `StakeEscrow.sol` Ante mode (1 NFT wager) | `@yavin · L3` | Should | PLANNED |
| **M4-02** | Contract | Validasi tier matching rarity selisih maksimal 1 tier di Ante mode | `@yavin · L3` | Should | PLANNED |
| **M4-03** | Contract | Penyelesaian escrow taruhan: transfer kartu lawan ke pemenang / refund saat seri | `@yavin · L3` | Should | PLANNED |
| **M4-04** | Contract | Feature flag untuk mematikan mode Stake dengan 1 transaksi pemilik | `@yavin · L1` | Should | PLANNED |
| **M4-05** | Contract | Implementasi `Market.sol` untuk atomic 1-to-1 card swap escrow | `@yavin · L3` | Should | PLANNED |
| **M4-06** | Contract | Implementasi Three-Card Spread (Past, Present, Future) di `TarotGacha` | `@yavin · L3` | Should | PLANNED |
| **M4-07** | Contract | Encrypted Pity Meter counter per pemain di kontrak gacha | `@yavin · L3` | Should | PLANNED |
| **M4-08** | Frontend | UI Lobby Mode Stake dan konfirmasi penyetoran kartu taruhan | `@arya · L3` | Should | PLANNED |
| **M4-09** | Frontend | UI Pasar Swap 1-untuk-1: Buat tawaran, terima, batalkan | `@arya · L3` | Should | PLANNED |
| **M4-10** | Frontend | Halaman **Verify**: Transkrip match, bukti dekripsi, dan odds kontrak publik | `@adrian · L3` | Must | PLANNED |
| **M4-11** | Scripts | Skrip benchmark HCU komprehensif seluruh fungsi FHE di Sepolia | `@yavin · L2` | Must | PLANNED |
| **M4-12** | QA | Pengujian alur pengguna baru end-to-end (target $\le$ 10 menit) | `@adrian · L2` | Must | PLANNED |

---

## 5. Milestone 5: Feature Freeze, Polish & Submission (8–12 Des 2026)

| ID | Modul | Deskripsi Pekerjaan | Pemilik · Kompleksitas | MoSCoW | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **M5-01** | Policy | **FEATURE FREEZE (8 Desember 2026)** — Larangan penambahan fitur baru | All | Must | PLANNED |
| **M5-02** | Deploy | Deployment final smart contract ke Sepolia & upload source code terverifikasi | `@yavin · L3` | Must | PLANNED |
| **M5-03** | Deploy | Hosting web application ke platform hosting statis publik (Vercel) | `@arya · L2` | Must | PLANNED |
| **M5-04** | Media | Perekaman video pitching 3 menit dengan suara & wajah asli (No AI) | `@adrian · L4` | Must | PLANNED |
| **M5-05** | Media | Editing video demo dengan layout kartu, audio jernih, dan subtitle | `@adrian · L3` | Must | PLANNED |
| **M5-06** | Media | Penulisan dan penjadwalan Thread X 6-post launch hackathon | `@adrian · L2` | Must | PLANNED |
| **M5-07** | Docs | Finalisasi README di semua repo: alamat kontrak, live demo, dan disclaimer | `@arya · L2` | Must | PLANNED |
| **M5-08** | QA | Dry-run pengisian formulir submission Zama Season 5 (verifikasi email API) | `@arya · L2` | Must | PLANNED |
| **M5-09** | Submit | **Eksekusi Submission Resmi (12 Desember 2026)** | `@arya · L1` | Must | PLANNED |
| **M5-10** | Standby | Masa darurat bug fixing pra-deadline resmi (13–14 Desember 2026) | All | Must | PLANNED |
