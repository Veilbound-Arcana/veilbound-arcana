# Veilbound Arcana — Zama Season 5 Hackathon Submission

> **Disclaimer:** This project is not audited, endorsed or operated by Zama. Use at your own risk.

- **Project Name:** Veilbound Arcana (Tarot TCG)
- **Track:** Zama Developer Program Mainnet Season 5 — Confidential Gaming
- **Deployment Network:** Ethereum Sepolia Testnet (Zama FHEVM Coprocessor)
- **Official Deadline:** December 14, 2026, 23:59 AOE
- **Internal Freeze Date:** December 8, 2026 | **Target Submit:** December 12, 2026
- **Organization:** [https://github.com/Veilbound-Arcana](https://github.com/Veilbound-Arcana)
- **License:** MIT

---

## 1. Compliance Matrix (Zama Season 5 Requirements)

| Official Requirement | Implementation Status | Evidence / Verification Link |
| :--- | :--- | :--- |
| **Game on Zama Protocol on Sepolia** | Fully deployed on Sepolia testnet using FHEVM v0.13 | [Contract Addresses Table](#contract-deployments-sepolia) |
| **Smart Contract & Frontend Monorepo/Org** | Structured polyrepo under GitHub Org `Veilbound-Arcana` | [Polyrepo Mapping Table](#repository-structure) |
| **Live Working Website Demo** | Static WebApp hosted on Vercel connected to Sepolia | Hosted URL (Refer to README) |
| **Confidential Token (ERC-7984)** | `FateToken.sol` confidential balance with built-in daily faucet | [`contracts/contracts/token/FateToken.sol`](contracts/contracts/token/FateToken.sol) |
| **Video Demo (3 Minutes, Real Voice)** | Recorded walk-through with real-person pitch (No AI video/voice) | YouTube / Loom submission link |
| **X (Twitter) Thread** | 6-post educational & gameplay thread published | [Thread URL](#) |
| **Structured Documentation** | Complete PRD, GDD, ADRs, and evidence pack | [`docs/`](docs/) directory |
| **No "Zama" in Project Name** | Named **Veilbound Arcana** | Verified |
| **Mandatory Disclaimer Present** | Stated on App footer, README, and all documentation | Stated in every header & footer |
| **Single Submission per Email** | Pre-validated dry-run submission form | Scheduled for Dec 12, 2026 |

---

## 2. Judge Quickstart (No Setup Required)

Reviewers can test the entire lifecycle in less than 5 minutes without needing a human opponent:

```bash
# 1. Clone the umbrella repository
git clone https://github.com/Veilbound-Arcana/veilbound-arcana.git
cd veilbound-arcana

# 2. Replay verified cryptographic match evidence offline
node scripts/demo-replay.mjs

# 3. Verify on-chain cryptographic claims and Sepolia transaction hashes
node scripts/verify-claims.mjs
```

### Solo Reviewer Mode (Practice Bot - FR-20)
Reviewers accessing the web application can launch **Practice Mode** directly. An automated on-chain bot with its own funded Sepolia wallet will instantly join the lobby, lock its deck, and submit encrypted commits each round, allowing judges to test:
1. Confidential Faucet claim (`$FATE`)
2. Tarot Gacha draw (Sealed NFT generation)
3. Client-side card unsealing
4. 3-round bluff duel against the bot with full FHE power resolution

---

## 3. Contract Deployments (Sepolia Testnet)

*Note: Hashes and addresses are updated upon deployment.*

| Contract | Address on Sepolia | Verification Explorer |
| :--- | :--- | :--- |
| `FateToken` (ERC-7984) | `0x0000000000000000000000000000000000000000` | [Sepolia Etherscan](#) |
| `CardCatalog` | `0x0000000000000000000000000000000000000000` | [Sepolia Etherscan](#) |
| `ArcanaCards` (ERC-721) | `0x0000000000000000000000000000000000000000` | [Sepolia Etherscan](#) |
| `TarotGacha` | `0x0000000000000000000000000000000000000000` | [Sepolia Etherscan](#) |
| `DuelEngine` | `0x0000000000000000000000000000000000000000` | [Sepolia Etherscan](#) |
| `StakeEscrow` | `0x0000000000000000000000000000000000000000` | [Sepolia Etherscan](#) |
| `Market` | `0x0000000000000000000000000000000000000000` | [Sepolia Etherscan](#) |

---

## 4. MoSCoW Scope Tracking

- **Must (Completed for MVP):**
  - [x] Wallet connection & 1-signature Zama decryption session
  - [x] `FateToken` ERC-7984 with daily faucet
  - [x] Single Spread Gacha (Encrypted draw + Sealed mint)
  - [x] Public Unseal verification mechanism
  - [x] Collection viewer & Deck Builder (5 cards, max 12 cost, max 2 duplicates)
  - [x] `DuelEngine` 3-round hidden commit/resolve with timeout protection
  - [x] Practice Bot for solo reviewer demo (FR-20)
  - [x] Mandatory disclaimers & Verify page
- **Should (Phase 1 Enhancements):**
  - [ ] Ante Stake Duel mode (1 NFT wager with tier matching)
  - [ ] 1-to-1 atomic NFT swap escrow
  - [ ] 3-Card spread (Past, Present, Future)
  - [ ] Encrypted pity meter counter
- **Won't (Post-Hackathon Roadmap):**
  - High stakes pool, 5-card booster packs, blind card marketplace, Celtic Cross spread.
