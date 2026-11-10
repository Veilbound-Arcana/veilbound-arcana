# Veilbound Arcana — Confidential Tarot TCG on Zama Protocol

> **Mandatory Disclaimer:** *This project is not audited, endorsed or operated by Zama. Use at your own risk.*

**Veilbound Arcana** is a confidential Tarot Trading Card Game (TCG) built on Ethereum Sepolia leveraging the **Zama FHEVM Protocol v0.13**. Players draw sealed NFT cards via on-chain encrypted gacha spreads that cannot be front-run or sniped by bots, build tactical 5-card decks, and engage in 3-round psychological bluff duels where player hands, chosen cards, and energy bids remain strictly confidential until round resolution.

---

## 1. Repository Layout (`Veilbound-Arcana` Polyrepo)

Following the production polyrepo architecture inspired by [`Snacc-near`](https://github.com/Snacc-near), our GitHub Organization **[Veilbound-Arcana](https://github.com/Veilbound-Arcana)** is structured into dedicated modular repositories:

| Repository | Scope | Tech Stack | Primary Owner |
| :--- | :--- | :--- | :---: |
| **[`veilbound-arcana`](https://github.com/Veilbound-Arcana/veilbound-arcana)** | **Umbrella / Meta-Repo:** Documentation, evidence pack, orchestration, backlog master, submission assets | Markdown, Node.js scripts | `@arya` (Lead) |
| **[`contracts`](https://github.com/Veilbound-Arcana/contracts)** | **Smart Contracts:** FHEVM Solidity contracts (`FateToken`, `CardCatalog`, `ArcanaCards`, `TarotGacha`, `DuelEngine`, `StakeEscrow`) | Solidity 0.8.24, Hardhat, FHEVM v0.13 | `@yavin` |
| **[`backend`](https://github.com/Veilbound-Arcana/backend)** | **Game Service & Bot:** WebSocket lobby, Sepolia event indexer, Practice Bot AI (FR-20) | Node.js, TypeScript, WebSocket | `@arya` |
| **[`frontend`](https://github.com/Veilbound-Arcana/frontend)** | **Web Application:** Ritual Gacha 3D flip, Duel Arena bluff UI, Deck Builder, Verify Page | Next.js / React, Tailwind CSS, `@zama-fhe/react-sdk`, wagmi | `@arya` |
| **[`sdk`](https://github.com/Veilbound-Arcana/sdk)** | **Client Library (`@veilbound/sdk`):** Encrypted input generators, typed contract bindings, battle math | TypeScript, ethers.js / viem | `@arya` |
| **[`scripts`](https://github.com/Veilbound-Arcana/scripts)** | **Tooling & Verifiers:** E2E simulation, Sepolia deployers, HCU profiler, testnet proof check | TypeScript, Node.js | `@adrian` |

---

## 2. Confidentiality Design & Data Disclosure

| Game Data | Privacy State | Who Can View | Consequence If Public (Why FHE is Mandatory) |
| :--- | :---: | :---: | :--- |
| **Gacha Draw (Pre-Unseal)** | **Encrypted (`euint8`)** | Card Owner Only | Bots snipe rare cards or cancel transactions on low-tier draws |
| **Pity Counter** | **Encrypted (`euint8`)** | Card Owner Only | Exploitative tracking of draw rhythms and drop timing |
| **$FATE Token Balance** | **Encrypted (`euint64`)** | Token Owner Only | Whale tracking, wealth profiling, targeted wallet drain |
| **Hand & Draw Sequence** | **Encrypted (`euint8`)** | Player Only | Opponent sees all available options; eliminates bluffing |
| **Round Card Choice** | **Encrypted (`euint8`)** | Player Only | Second-mover advantage completely breaks simultaneous play |
| **Energy Allocation** | **Encrypted (`euint8`)** | Player Only | Opponent can always outbid by exactly 1 energy unit |
| **Card Orientation (Upright/Reversed)**| **Encrypted (`ebool`)**| Player Only | Opponent knows power modifier (+1 / -1) before turn resolves |
| **NFT Ownership** | **Public** | Everyone | Required for trading, transfers, and escrow contracts |
| **Card Identity (Post-Unseal)** | **Public** | Everyone | Required for verifiable deck construction & secondary trading |
| **Locked Decklist** | **Public** | Everyone | Ensures cheap on-chain validation of max cost & card copies |
| **Round Winner & Score** | **Public** | Everyone | Serves as verifiable consensus for match victory |

> **Intentional Leakage Notice:** Public round outcomes and power differences reveal partial information regarding the card played in that round. This deduction mechanic is an intentional core feature of psychological gameplay, not an encryption flaw.

---

## 3. Core Gameplay Loop

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Daily Faucet │ ──> │ Tarot Gacha  │ ──> │    Unseal    │
│  ($FATE ERC) │     │ (Encrypted)  │     │ (Public NFT) │
└────────────── environmental ─────────┘     └──────┬───────┘
                                                   │
                                                   ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Verify Proof │ <── │  Duel Arena  │ <── │ Deck Builder │
│  & Tx Hashes │     │ (3-Rnd Bluff)│     │ (5-Card Deck)│
└──────────────┘     └──────────────┘     └──────────────┘
```

1. **Daily Reading (Faucet):** Claim encrypted testnet `$FATE` tokens (ERC-7984).
2. **Tarot Spread (Gacha):** Spend `$FATE` to draw cards. Rarity and Card IDs are computed on-chain with FHE random numbers and minted directly as Sealed NFTs.
3. **The Unseal Ritual:** The owner signs a single-session decryption to view the face-down card flip, then submits a public unseal proof to activate the card for dueling and trading.
4. **Deck Construction:** Build a 5-card deck obeying balance constraints (max cost $\le$ 12, max 2 duplicates).
5. **Confidential Duel:** Enter the Duel Arena (Friendly, Practice vs AI Bot, or Stake Mode). Both players allocate energy from a 6-point pool and commit card choices secretly. The FHE coprocessor computes power, suit advantage (`Wands > Swords > Pentacles > Cups > Wands`), and orientation modifiers, decrypting only the round winner.
6. **Verify:** Check on-chain cryptographic proofs, contract odds, and transaction execution on the Verify page.

---

## 4. Quickstart Guide (Local Development)

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation
```bash
# Clone the umbrella repository with all workspaces
git clone https://github.com/Veilbound-Arcana/veilbound-arcana.git
cd veilbound-arcana

# Install all workspace dependencies
npm install

# Run offline cryptographic replay test
npm run demo:replay

# Run full contracts test suite (Hardhat + FHEVM Mock)
npm run contracts:test
```

### Running the Services Locally
```bash
# Start backend lobby & practice bot
npm run backend:dev

# Start frontend application
npm run frontend:dev
```
Open `http://localhost:3000` to interact with the local development application.

---

## 5. Team & Revenue Distribution

As agreed upon by the Veilbound Arcana core development team:

| Team Member | Allocation & Share | Role & Key Responsibilities |
| :--- | :---: | :--- |
| **Arya (Chenn)** (`@arya`) | **70%** | **Lead Architect, Backend & Frontend Lead**<br>• Overall architecture & Zama FHEVM integration<br>• Full Frontend: Gacha ritual, 3D card flips, secret hand rendering, Duel Arena, Deck Builder<br>• Full Backend: WebSocket lobby, matchmaking, Sepolia indexer, Practice Bot AI service<br>• Client SDK (`@veilbound/sdk`) & End-to-end integration |
| **Yavin** (`@yavin`) | **15%** | **Smart Contracts & FHEVM Specialist**<br>• Solidity contracts: `FateToken`, `CardCatalog`, `ArcanaCards`, `TarotGacha`, `DuelEngine`, `StakeEscrow`<br>• FHE clamp logic implementation (zero-revert guarantee)<br>• Hardhat unit & integration tests with FHEVM mock<br>• HCU profiling & optimization against Sepolia coprocessor limits |
| **Adrian** (`@adrian`) | **15%** | **Game Design, Art/Metadata, QA & Video Production**<br>• 20 Tarot card aesthetic generation & metadata IPFS curation<br>• Verify Page proof verification scripts & `evidence-pack.md`<br>• Official 3-minute hackathon pitch video (recorded with real voice/face)<br>• X (Twitter) 6-post thread draft and documentation<br>• Cross-wallet, timeout, and mobile QA testing |

---

## 6. Honesty Rules & Disclaimers

- `$FATE` token on Ethereum Sepolia is a testnet token with **zero monetary value**.
- Staking and wagering modes are optional gameplay mechanics designed to demonstrate FHE escrow capabilities.
- Claims made in documentation are accompanied by verifiable testnet transaction hashes in `docs/evidence-pack.md`. No transaction hash = no live claim.
- Submission deadline: December 14, 2026 (23:59 AOE). Internal submission target: December 12, 2026.
