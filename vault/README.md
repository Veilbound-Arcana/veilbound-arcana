# Veilbound Arcana — Engineering & Knowledge Vault

> **Mandatory Disclaimer:** *This project is not audited, endorsed or operated by Zama. Use at your own risk.*

Welcome to the internal engineering vault and single source of design truth for **Veilbound Arcana** (Zama Mainnet Season 5: Confidential Gaming).

This vault is fully formatted as an **Obsidian-compatible Knowledge Base**, using bi-directional wikilinks (`[[Note Name]]`), structured folder taxonomies, Architecture Decision Records (ADRs), complete Number Dictionaries, and an itemized Master Backlog with role assignments (`@arya`, `@yavin`, `@adrian`).

## 📁 Vault Taxonomy

```
vault/
├── Arcana Hub.md                                                 # Master Map of Content (MOC)
├── 00 Log/                                                       # Daily execution & rehearsal run logs
│   ├── Progress Arcana.md
│   └── Rehearsals/
│       └── Rehearsal Run 1 - Sepolia Testnet.md
├── 01 Konsep & Gameplay/                                         # Vision, user stories, game theory
│   ├── Arcana - Visi Masalah & Solusi.md
│   ├── Arcana - Game Loop & Siklus Hidup Kartu.md
│   └── Arcana - Bluffing Game Theory & Psikologi TCG.md
├── 02 Game Design & Balancing/                                   # Balancing, formulas, 20-card catalog
│   ├── Arcana - Model Data & Kamus Angka Resmi.md
│   ├── Arcana - Katalog Lengkap 20 Kartu MVP.md
│   └── Arcana - Formula Resolusi Power & Siklus Suit.md
├── 03 Ekonomi & Falsifiers/                                      # Tokenomics & anti-exploit hypotheses
│   ├── Arcana - Tokenomics ($FATE ERC-7984) & Faucet.md
│   └── Arcana - Economic Falsifiers (F-01..F-05).md
├── 04 Arsitektur & FHEVM/                                        # FHEVM specs, HCU budgets, and ADRs
│   ├── Arcana - Matriks Data Konfidensialitas & Kebocoran Disengaja.md
│   ├── Arcana - Analisis Anggaran HCU & Batas Devnet Sepolia.md
│   └── ADR/
│       ├── ADR-001 Desain Zero-Revert Clamp Guard (FHE.select).md
│       ├── ADR-002 Alur 2-Langkah Gacha (Bayar, Encrypted Draw, Unseal).md
│       ├── ADR-003 Permutasi Tangan Terenkripsi vs Deck Publik.md
│       ├── ADR-004 Standar Token ERC-7984 vs Native ETH.md
│       └── ADR-005 Migrasi dari Relayer SDK ke Zama React SDK.md
├── 05 Frontend & Ritual UI/                                      # UX guidelines, 3D flip card, themes
│   └── Arcana - Panduan UX & Visual Gotik Mistik.md
├── 06 Backend & Practice Bot/                                    # Practice Bot AI (FR-20) & WebSocket lobby
│   └── Arcana - Automated Practice Bot Engine (FR-20).md
├── 07 Verifikasi & Evidence Pack/                                # 22 KPI rows, cryptographic evidence
│   └── Arcana - Checklist KPI Hackathon (22 KPI Rows).md
├── 08 Dokumen Submission/                                        # 3-min pitch script, X thread, storyboard
│   ├── Arcana - Video Pitch Script 3 Menit (Real Human).md
│   ├── Arcana - Shotlist Video & Storyboard.md
│   ├── Arcana - Thread X (Twitter) 6-Post Launch.md
│   ├── Arcana - Checklist Final Kepatuhan Juri Zama Season 5.md
│   └── Arcana - Post-Mortem & Roadmap Pasca-Hackathon.md
└── 09 Backlog & Tim/                                             # Master backlog, RACI, sprint plans
    ├── Arcana - Backlog Master.md
    ├── Arcana - Pembagian Tim & Kompensasi (70 Arya, 15 Yavin, 15 Adrian).md
    └── Arcana - Rencana Sprint & Milestones (Sprint 1..5).md
```

## How to Open in Obsidian
1. Download & open [Obsidian](https://obsidian.md).
2. Choose **Open folder as vault**.
3. Select this `vault` directory.
4. Start navigation from `Arcana Hub.md`.
