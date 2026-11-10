# Veilbound Arcana — Backend Game Service

> **Mandatory Disclaimer:** *This project is not audited, endorsed or operated by Zama. Use at your own risk.*

Backend service providing real-time game coordination, lobby matchmaking, and an automated Practice Bot (FR-20) for judges.

## Core Responsibilities
1. **Lobby & WebSocket Room Manager (`src/lobby/`):** Orchestrates player presence, room invitations, and duel state synchronization.
2. **Practice Bot AI Engine (`src/bot/`):** Dedicated on-chain AI bot player with its own funded Sepolia wallet. Allows solo judges and reviewers to test the entire 3-round duel flow end-to-end without waiting for another human player.
3. **Sepolia Event Indexer (`src/indexer/`):** Listens to on-chain events (`CardDrawn`, `RoundCommitted`, `RoundResolved`, `MatchFinished`) and broadcasts state changes to connected clients.

## Quickstart

```bash
npm install
npm run dev
```
Server runs on `http://localhost:4000` (HTTP and WebSocket).
