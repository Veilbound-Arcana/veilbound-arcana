# 🔄 Game Loop & Siklus Hidup Kartu

## 1. Siklus Hidup Kartu (Card Lifecycle)
Kartu dalam Veilbound Arcana mengalami transformasi status:
1. **Tarot Spread Draw (Sealed):** Kartu di-mint sebagai NFT ERC-721 dengan status `isSealed = true` dan identitas kartu tersimpan dalam `sealedDefId` (`euint8`). Kartu tersegel tidak dapat diperjualbelikan atau dimasukkan ke dalam deck duel.
2. **The Unseal Ritual (Public Transition):** Pemilik menandatangani sesi dekripsi EIP-712 untuk melihat kartu membalik secara visual, lalu mengirimkan transaksi unseal on-chain. Status berubah menjadi `isSealed = false` dan `defId` terbaca secara publik.
3. **Deck Construction:** Kartu unsealed dimasukkan ke dalam deck 5 kartu sesuai aturan batas biaya ($le 12$) dan batas duplikat ($le 2$).
4. **Duel Battlefield:** Kartu dipilih dalam ronde rahasia untuk memperebutkan poin kemenangan.
5. **Trading / Ante Staking (Opsional):** Kartu unsealed dapat ditukar lewat swap escrow atau dipertaruhkan dalam mode Ante 1-NFT.
