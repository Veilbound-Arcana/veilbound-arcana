# 🧪 Rehearsal Run 1 — Sepolia Testnet End-to-End Rehearsal

- **Tanggal Eksekusi:** 10 November 2026
- **Lingkungan:** Sepolia Testnet (Zama FHEVM Coprocessor)
- **Tujuan:** Memvalidasi alur end-to-end lengkap dari faucet, gacha draw, unseal kartu, deck lock, hingga 1 match 3 ronde melawan bot.

## Ringkasan Eksekusi
1. **Faucet Claim:** Akun uji coba mengklaim 10 FATE dari `FateToken.sol`. Saldo terenkripsi bertambah valid.
2. **Gacha Single Spread:** Pemain memanggil `drawSingle()`, menerima Sealed NFT #1042.
3. **Unseal:** Bukti dekripsi publik diverifikasi on-chain. Kartu berubah status menjadi Queen of Wands (Rare).
4. **Deck Lock:** 5 kartu didaftarkan ke match, validasi total cost = 9 <= 12, max duplikat = 1.
5. **Duel 3 Ronde:**
   - Ronde 1: Player A (Power 6) vs Bot (Power 3) -> Player A menang.
   - Ronde 2: Player A (Power 4) vs Bot (Power 5) -> Bot menang.
   - Ronde 3: Player A (Power 7) vs Bot (Power 6) -> Player A menang.
6. **Hasil:** Player A menang 2 - 1. Pemenang match dipublikasikan on-chain.
