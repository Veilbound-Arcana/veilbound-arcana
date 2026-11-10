# 🔮 Veilbound Arcana — Central Knowledge Vault (Hub)

> **Mandatory Disclaimer:** *This project is not audited, endorsed or operated by Zama. Use at your own risk.*

Selamat datang di repositori kebenaran desain, arsitektur, dan eksekusi teknik **Veilbound Arcana** untuk kompetisi **Zama Developer Program Mainnet Season 5 (Confidential Gaming)** di Ethereum Sepolia.

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
  - [[04 Arsitektur & FHEVM/ADR/ADR-005 Migrasi dari Relayer SDK ke Zama React SDK|ADR-005: Migrasi ke Zama React SDK]]

### [[05 Frontend & Ritual UI]]
- [[05 Frontend & Ritual UI/Arcana - Panduan UX & Visual Gotik Mistik|Panduan UX & Tema Visual Gotik Mistik]]
- [[05 Frontend & Ritual UI/Arcana - Desain Ritual Gacha & 3D Flip Framer Motion|Desain Ritual Gacha & 3D Flip Card]]
- [[05 Frontend & Ritual UI/Arcana - Desain Arena Duel & Confidential Hand View|Desain Arena Duel & Tangan Rahasia]]
- [[05 Frontend & Ritual UI/Arcana - Desain Deck Builder & Rule Validations|Desain Deck Builder & Validasi Aturan]]
- [[05 Frontend & Ritual UI/Arcana - Integrasi Zama React SDK & 1-Signature Session|Integrasi Zama React SDK & 1-Signature Session]]

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
- [[08 Dokumen Submission/Arcana - Checklist Final Kepatuhan Juri Zama Season 5|Checklist Final Kepatuhan Juri Zama Season 5]]
- [[08 Dokumen Submission/Arcana - Post-Mortem & Roadmap Pasca-Hackathon|Post-Mortem & Roadmap Pasca-Hackathon]]

### [[09 Backlog & Tim]]
- [[09 Backlog & Tim/Arcana - Backlog Master|Backlog Master (Itemized @arya, @yavin, @adrian)]]
- [[09 Backlog & Tim/Arcana - Pembagian Tim & Kompensasi (70 Arya, 15 Yavin, 15 Adrian)|Pembagian Tim, RACI, & Pembagian Hasil (70:15:15)]]
- [[09 Backlog & Tim/Arcana - Rencana Sprint & Milestones (Sprint 1..5)|Rencana Sprint & Milestones (Sprint 1..5)]]

---

## 📌 Aturan Kerja Wajib Tim (Standing Rules)
1. **Kamus Angka Resmi adalah Kebenaran Tunggal:** Seluruh nilai stat kartu, probabilitas gacha, rumus power, batas HCU harus merujuk ke [[02 Game Design & Balancing/Arcana - Model Data & Kamus Angka Resmi]].
2. **Zero-Revert Guard:** Tidak ada percabangan FHE yang me-revert transaksi saat input rahasia tidak sah. Gunakan `FHE.select` untuk clamp senyap demi mencegah kebocoran informasi.
3. **Aturan Kejujuran (Honesty Rule):** Tidak ada transaksi hash Sepolia = tidak ada klaim live.
4. **Alokasi Eksekusi:** Setiap pekerjaan merujuk pada label pemilik di [[09 Backlog & Tim/Arcana - Backlog Master]].
