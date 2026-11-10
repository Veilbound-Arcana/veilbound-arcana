# Veilbound Arcana — Pembagian Kerja & Alokasi Hasil Proyek

Dokumen ini meresmikan kesepakatan tim untuk kompetisi **Zama Developer Program Mainnet Season 5 (Confidential Gaming)** pada jaringan Sepolia testnet.

---

## 1. Ringkasan Pembagian Hasil (Revenue / Prize Pool Split)

Total hadiah kompetisi adalah hingga **5.000 cUSDT** (Juara 1: 2.500 cUSDT, Juara 2: 1.500 cUSDT, Juara 3: 1.000 cUSDT). Pembagian hasil disepakati berdasarkan proporsi beban kerja teknis, kepemilikan arsitektur, dan eksekusi:

| Anggota Tim | Porsi (%) | Estimasi Hadiah (Juara 1 / 2.500) | Peran Utama |
| :--- | :---: | :---: | :--- |
| **Arya (Chenn)** | **70%** | **1.750 cUSDT** | **Project Lead, Fullstack (Backend & Frontend Lead), SDK & Arsitektur** |
| **Yavin** | **15%** | **375 cUSDT** | **Smart Contracts Specialist & FHEVM Testing Engineer** |
| **Adrian** | **15%** | **375 cUSDT** | **Game Design, Asset/Art & Metadata, QA & Video Production** |
| **Total** | **100%** | **2.500 cUSDT** | |

---

## 2. Rincian Pembagian Tugas (Job Distribution)

### A. Arya (`@arya`) — Beban Kerja 70%
Arya memegang kepemimpinan teknis secara menyeluruh, bertanggung jawab atas integrasi end-to-end, seluruh modul Frontend, dan seluruh modul Backend:

1. **Arsitektur & Integrasi Sistem:**
   - Desain arsitektur end-to-end antara Zama FHEVM coprocessor, smart contract, SDK, backend, dan frontend.
   - Setup umbrella repository, CI/CD GitHub Actions, dan workspace package management.
   - Code review wajib untuk seluruh PR sebelum di-merge ke branch `main`.

2. **Frontend Development (`apps/frontend`):**
   - Integrasi wallet (wagmi / viem) dan setup **1-signature decryption session** menggunakan `@zama-fhe/react-sdk`.
   - **Ritual Gacha UI:** Animasi kartu face-down, 3D tarot flip progresif menggunakan Framer Motion, tombol *Unseal* dengan status loading kriptografi.
   - **Ruang Duel Arena (Bluff UI):**
     - Tampilan kartu di tangan yang didekripsi secara lokal (hanya terlihat oleh pemilik).
     - Wheel / slider alokasi energi (pool 6 energi) dengan proteksi input.
     - Animasi ronde: commit rahasia, status menunggu lawan, reveal hasil ronde, score counter.
   - **Deck Builder & Koleksi:**
     - Filter kartu berdasarkan Suit (Wands, Cups, Swords, Pentacles), Arcana (Major, Minor), dan Rarity.
     - Validasi deck 5 kartu: batas total cost $\le$ 12, maksimal 2 duplikat.
   - **Halaman Faucet & Klaim Token:** Tampilan saldo terenkripsi `$FATE` dan tombol klaim harian.
   - **Lobby & Matchmaking UI:** Pembuatan room, invite code, dan integrasi mode Friendly / Stake / Latihan.

3. **Backend Development (`apps/backend`):**
   - **Lobby Service & Room Manager:** Koordinasi duel real-time dua pemain via WebSocket (Fastify / Express + ws).
   - **Mode Latihan / Practice Bot (FR-20):**
     - Bot AI otomatis dengan private key Sepolia khusus yang selalu standby.
     - Menerima tantangan reviewer juri, mengunci deck, dan melakukan commit terenkripsi tiap ronde.
     - Menjamin juri hackathon bisa mencoba gameplay penuh secara mandiri tanpa menunggu pemain lain.
   - **Sepolia Event Indexer:** Memantau event on-chain (`CardDrawn`, `RoundCommitted`, `RoundResolved`) dan menyiarkannya ke client secara real-time.

4. **Client SDK (`packages/sdk`):**
   - Library TypeScript `@veilbound/sdk` untuk membuat input bukti terenkripsi (`euint8`) untuk kartu dan alokasi energi.
   - Wrapper typed interface untuk interaksi kontrak Sepolia.

---

### B. Yavin (`@yavin`) — Beban Kerja 15%
Yavin fokus pada lapisan smart contract FHEVM di Ethereum Sepolia dan pengujian unit:

1. **Smart Contracts Solidity (`packages/contracts`):**
   - `FateToken.sol`: Implementasi token rahasia standar ERC-7984 dengan saldo terenkripsi dan faucet harian.
   - `CardCatalog.sol`: Registri publik 20 definisi kartu Tarot (stat, cost, power, suit, arcana).
   - `ArcanaCards.sol`: Kontrak NFT ERC-721 yang mendukung status *Sealed* (identitas `euint8` terenkripsi) dan *Unsealed* (identitas publik setelah dibuka).
   - `TarotGacha.sol`: Mesin gacha dengan FHE on-chain encrypted random, penentuan rarity, dan encrypted pity meter counter.
   - `DuelEngine.sol`: State machine duel 3 ronde, commit terenkripsi, resolusi power di FHE, siklus suit advantage, dan timeout forfeit.
   - **Implementasi Aturan Anti-Revert (Clamp Logic):** Memastikan semua input tak sah (misal energi berlebih) di-clamp via `FHE.select` tanpa pernah me-revert transaksi (mencegah kebocoran data).
   - `StakeEscrow.sol` & `Market.sol`: Escrow taruhan Ante 1 NFT dan swap 1-to-1 atomic NFT.

2. **Smart Contract Testing & HCU Benchmarking:**
   - Hardhat test suite komprehensif menggunakan Mock FHEVM Zama.
   - Profiling konsumsi Gas dan HCU (Homomorphic Computation Units) per fungsi transaksi untuk memastikan tidak melampaui batas devnet (20M global HCU / 5M depth HCU).
   - Script deployment Hardhat ke Sepolia testnet.

---

### C. Adrian (`@adrian`) — Beban Kerja 15%
Adrian bertanggung jawab atas aset game, kualitas verifikasi, pengujian pengguna, dan aset submission hackathon:

1. **Aset Tarot & Metadata Kartu:**
   - Pembuatan dan kurasi 20 artwork kartu Tarot (Major & Minor Arcana) dengan tema mistik gotik yang konsisten.
   - Penyusunan file metadata JSON standar ERC-721 dan upload ke hosting IPFS / Arweave / CDN statis.
   - Verifikasi lisensi hak cipta artwork (bebas sengketa IP).

2. **Halaman Verify & Evidence Pack:**
   - Desain dan data feed untuk halaman **Verify** (menampilkan proof transaksi gacha, odds kontrak publik, dan bukti dekripsi ronde).
   - Maintenance `docs/evidence-pack.md` dan skrip verifikasi otomatis hash transaksi Sepolia (`scripts/verify-claims.mjs`).

3. **Produksi Video Pitch (Wajib 3 Menit) & DevRel:**
   - Penulisan naskah (script) video pitch sesuai ketentuan Zama: fokus pada masalah kerahasiaan on-chain, ritual gacha, dan duel bluff.
   - Perekaman dan editing video demo dengan **wajah dan suara asli manusia (DILARANG video/suara AI sesuai aturan resmi Zama)**.
   - Penyusunan draft thread edukasi X (Twitter) sebanyak 6 postingan mengenai gameplay dan FHE privacy design.

4. **Quality Assurance (QA) & Dokumen Kepatuhan:**
   - Pengujian lintas wallet (MetaMask, Rabby, Coinbase Wallet) dan browser seluler.
   - Pengujian skenario edge-case: timeout pemain, draw 3 ronde beruntun, clamp energi berlebih, dan penanganan error Sepolia RPC.
   - Pengecekan akhir kepatuhan submission: tidak ada kata "Zama" pada judul, disclaimer wajib terpasang di semua tempat.

---

## 3. Matriks RACI (Responsible, Accountable, Consulted, Informed)

| Area Kerja / Modul | Arya (`@arya`) | Yavin (`@yavin`) | Adrian (`@adrian`) |
| :--- | :---: | :---: | :---: |
| Arsitektur Sistem & Review Kode | **A / R** | C | I |
| Smart Contracts FHEVM | A | **R** | C |
| HCU Profiling & Hardhat Tests | A | **R** | I |
| Frontend WebApp (Gacha, Arena, Deck) | **A / R** | C | C |
| Backend WS Lobby & Practice Bot (FR-20) | **A / R** | I | C |
| Client SDK (`@veilbound/sdk`) | **A / R** | C | I |
| Tarot Artwork & Metadata JSON | A | I | **R** |
| Halaman Verify & Evidence Hash | A | C | **R** |
| Video Pitch 3 Menit (Real Voice) | A | C | **R** |
| Thread X & Dokumentasi Publik | A | I | **R** |
| E2E Testing di Sepolia | **A** | **R** | **R** |
| Submission Form Zama Season 5 | **A / R** | I | I |

*Keterangan: R = Responsible (pelaksana), A = Accountable (penanggung jawab final), C = Consulted (dikonsultasikan), I = Informed (diinfokan).*
