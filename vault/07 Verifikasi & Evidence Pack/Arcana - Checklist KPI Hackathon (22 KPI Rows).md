# 📊 Checklist KPI Hackathon Veilbound Arcana (22 KPI Rows)

| No | Kategori | Parameter KPI | Target Spek | Metode Pengujian | Status |
| :-: | :--- | :--- | :---: | :--- | :---: |
| 1 | Kepatuhan | Nama proyek bebas kata "Zama" | Veilbound Arcana | Audit teks dokumen | ✅ PASS |
| 2 | Kepatuhan | Disclaimer wajib terpasang | Banner & Footer | Audit UI & README | ✅ PASS |
| 3 | Kepatuhan | Jaringan Sepolia FHEVM | Chain ID 11155111 | Hardhat Network | ✅ PASS |
| 4 | Token | FateToken confidential balance | ERC-7984 standard | FateToken.sol | ✅ PASS |
| 5 | Token | Daily faucet onboard testnet | 10 FATE per 24 jam | Faucet test | ✅ PASS |
| 6 | Gacha | Single Spread sealed NFT mint | 1 NFT Sealed | TarotGacha.sol | ✅ PASS |
| 7 | Gacha | Peluang drop rarity transparan | 60/25/12/3 % | CardCatalog.sol | ✅ PASS |
| 8 | Gacha | Pity counter terenkripsi | Guarantee drops | TarotGacha.sol | ✅ PASS |
| 9 | NFT | ERC-721 status Sealed/Unsealed | ArcanaCards | ArcanaCards.sol | ✅ PASS |
| 10 | NFT | Proteksi transfer kartu Sealed | Revert on sealed | ArcanaCards.sol | ✅ PASS |
| 11 | Deck | Maksimal cost deck $\le$ 12 | Enforced on-chain | DuelEngine.sol | ✅ PASS |
| 12 | Deck | Batas duplikat kartu $\le$ 2 | Enforced on-chain | DuelEngine.sol | ✅ PASS |
| 13 | Duel | Format pertandingan 3 ronde | Best of 3 | DuelEngine.sol | ✅ PASS |
| 14 | Duel | Pool energi per match | 6 Energi | DuelEngine.sol | ✅ PASS |
| 15 | Duel | Siklus keunggulan suit 4 elemen | W>S>P>C>W | BattleMath / FHE | ✅ PASS |
| 16 | Duel | Tarot flip orientasi | Upright/Reversed | DuelEngine.sol | ✅ PASS |
| 17 | Keamanan | Zero-revert clamp guard | FHE.select clamp | ADR-001 / Test | ✅ PASS |
| 18 | Keamanan | Timeout commit ronde | 120s Forfeit claim | DuelEngine.sol | ✅ PASS |
| 19 | Performa | Global HCU per ronde | < 20.000.000 HCU | HCU Profiler | ✅ PASS |
| 20 | Solo Review | Practice Bot AI (FR-20) | Instant AI match | PracticeBot.ts | ✅ PASS |
| 21 | Verifikasi | Replay offline tanpa RPC | demo-replay.mjs | Node script | ✅ PASS |
| 22 | Media | Pitch video wajah asli manusia | 3 Menit (No AI) | Storyboard Script | ✅ PASS |
