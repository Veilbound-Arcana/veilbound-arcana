# Veilbound Arcana — Smart Contracts

> **Mandatory Disclaimer:** *This project is not audited, endorsed or operated by any third party. Use at your own risk.*

Smart contract suite for Veilbound Arcana, designed for FHEVM v0.13 on Ethereum Sepolia testnet.

## Contract Architecture

- **`token/FateToken.sol`**: Confidential balance token (ERC-7984 compatible) used for gacha fees. Contains a built-in faucet for testnet onboarding.
- **`cards/CardCatalog.sol`**: Immutable public registry storing the base parameters of all 20 Tarot cards (Minor & Major Arcana).
- **`cards/ArcanaCards.sol`**: ERC-721 NFT implementation supporting both *Sealed* (encrypted `euint8` card identity) and *Unsealed* (public plaintext identity) states.
- **`gacha/TarotGacha.sol`**: Encrypted Tarot spread gacha engine using on-chain FHE random generation, odds thresholding, and an encrypted pity counter.
- **`duel/DuelEngine.sol`**: 3-round hidden commit-reveal card battle state machine with FHE power resolution and non-reverting clamp protection.
- **`stake/StakeEscrow.sol`**: Optional Ante-mode staking escrow requiring 1 Unsealed NFT deposit per player with tier matching.
- **`market/Market.sol`**: Atomic 1-to-1 card swap escrow.

## Quickstart

```bash
npm install
npm run compile
npm test
```
