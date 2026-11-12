# Veilbound Arcana — Development & Agent Guidelines

Veilbound Arcana ($FATE / NFT) — *Confidential Tarot TCG*. An on-chain confidential card battle game on Ethereum Sepolia: sealed NFT cards, hidden commit-reveal duels, on-chain encrypted random gacha, and bluff tactics powered by FHEVM v0.13.

Build Window: Nov 10 – Dec 12, 2026 (Official Deadline: Dec 14, 2026 23:59 AOE).  
Track: Developer Program Mainnet Season 5 (Confidential Gaming).  
Organization: [Veilbound-Arcana](https://github.com/Veilbound-Arcana).  

---

## 1. Team Allocation & Responsibilities (70 : 15 : 15)

Every task in the backlog is tagged with `@arya`, `@yavin`, or `@adrian`.

| Member | Allocation & Share | Primary Scope | Core Modules |
| :--- | :---: | :--- | :--- |
| **Arya** (`@arya`) | **70%** | **Lead Architect, Backend & Frontend** | Frontend (Gacha ritual, Duel Arena, Deck Builder, FHE React SDK), Backend (Lobby WebSocket, Match coordinator, Practice Bot AI), End-to-end integration |
| **Yavin** (`@yavin`) | **15%** | **Smart Contracts & FHEVM** | Solidity contracts (`FateToken`, `CardCatalog`, `ArcanaCards`, `TarotGacha`, `DuelEngine`, `StakeEscrow`), Hardhat mock tests, HCU budget profiling |
| **Adrian** (`@adrian`) | **15%** | **Game Design, Art/Metadata, QA & Video** | 20 Tarot card artworks & metadata, Verify Page proofs, Demo video production (3-min real voice/pitch), X thread draft, Multi-wallet QA |

> **Review Rule:** 100% of pull requests must be reviewed and approved by `@arya` before merging to `main`.

---

## 2. Mandatory Standing Rules

1. **Mandatory Disclaimer:**  
   Every user-facing document, app footer, and README must state:  
   `"This project is not audited, endorsed or operated by any third party. Use at your own risk."`
2. **Never Revert on Confidential Values (Clamp Rule):**  
   In FHEVM smart contracts, never `revert` based on an encrypted condition (e.g. invalid energy bid or non-owned card slot). A transaction revert leaks confidential information to the block explorer. Use `FHE.select` to silently clamp the value to the valid range.
3. **HCU Budget Management:**  
   Sepolia devnet limits are 20M global HCU and 5M depth HCU per transaction. Every contract function performing FHE operations (`DuelEngine.commitRound`, `TarotGacha.drawCard`) must be benchmarked using Hardhat gas/HCU reports.
4. **Honesty Rules:**  
   - No Sepolia transaction hash = no live claim in docs or README.
   - Testnet tokens (`$FATE`) have no monetary value. Volatility or wagering is purely a game mechanic.
   - Words like "guaranteed ROI", "yield", or "investment" are strictly prohibited.
5. **Commit & Branch Conventions:**  
   - Branches: `feature/<task-id>-<short-desc>` or `fix/<task-id>`.
   - Commit messages: `<ID>: <summary>` (e.g., `M1-02: implement clamp logic in DuelEngine`).
   - Push and PR to `Veilbound-Arcana/<repo>`; merge only when automated tests pass.
6. **Secrets & Environment:**  
   - Private keys and RPC endpoints reside strictly in `.env` (gitignored).
   - Never commit or expose private keys or seed phrases in logs, artifacts, or scripts.

---

## 3. Polyrepo Organization Layout

The GitHub Organization `https://github.com/Veilbound-Arcana` consists of:

1. `veilbound-arcana`: Umbrella meta-repo containing documentation, hackathon evidence, orchestration, and E2E demos.
2. `contracts`: FHEVM Solidity smart contracts & Hardhat testing suite.
3. `backend`: Express/Fastify + WebSocket lobby server and Automated Practice Bot.
4. `frontend`: Next.js / Vite React application with Confidential FHE client SDK.
5. `sdk`: `@veilbound/sdk` client SDK with typed bindings and encryption helpers.
6. `scripts`: Sepolia deployment, card catalog seeder, E2E match replay, and HCU benchmarking.

---

## 4. Progress Logging

Before completing any development session or sprint task:
- Record task completion in `docs/backlog-master.md`.
- Ensure corresponding tests pass locally with output logged in `docs/evidence-pack.md`.
