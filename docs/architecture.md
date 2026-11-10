# Veilbound Arcana — Arsitektur Sistem & FHEVM

Dokumen ini mendokumentasikan arsitektur modular Veilbound Arcana, interaksi smart contract pada Zama FHEVM Sepolia, kontrol akses (ACL), dan integrasi WebApp serta backend.

---

## 1. Arsitektur Diagram Modular

```
┌────────────────────────────────────────────────────────────────────────┐
│                          APLIKASI FRONTEND                             │
│       React / Next.js + Tailwind CSS + Framer Motion (3D Tarot)        │
│          Zama React SDK (@zama-fhe/react-sdk) + wagmi / viem           │
└───────────────────┬─────────────────────────────────┬──────────────────┘
                    │                                 │
     (WebSocket Room Events)           (FHE Encrypted Inputs / Calls)
                    │                                 │
                    ▼                                 ▼
┌────────────────────────────────────┐  ┌────────────────────────────────┐
│          BACKEND SERVICE           │  │   CLIENT SDK (@veilbound/sdk)  │
│  Lobby WS Server & Match Room      │  │  Proof Generation & Typed ABIs │
│  Sepolia Event Indexer             │  └────────────────┬───────────────┘
│  Automated Practice Bot (FR-20)    │                   │
└────────────────────────────────────┘                   │
                                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ETHEREUM SEPOLIA (FHEVM COPUS)                       │
│                                                                        │
│  ┌─────────────────────────┐             ┌──────────────────────────┐  │
│  │   FateToken (ERC-7984)  │             │   ArcanaCards (ERC-721)  │  │
│  │ Encrypted Balances & Faucet           │ Sealed (euint8) & Unseal │  │
│  └───────────┬─────────────┘             └─────────────▲────────────┘  │
│              │                                         │               │
│              ▼ (Payment)                               │ (Mint NFT)    │
│  ┌─────────────────────────────────────────────────────┴────────────┐  │
│  │                       TarotGacha Contract                        │  │
│  │   FHE On-Chain VRF (Rarity + Card ID) + Encrypted Pity Counter   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌─────────────────────────┐             ┌──────────────────────────┐  │
│  │       CardCatalog       │             │       StakeEscrow        │  │
│  │ 20 Immutable Card Defs  │             │ 1 NFT Ante Mode Wager    │  │
│  └───────────▲─────────────┘             └─────────────▲────────────┘  │
│              │ (Read Stats)                            │ (Escrow)      │
│  ┌───────────┴─────────────────────────────────────────┴────────────┐  │
│  │                       DuelEngine Contract                        │  │
│  │ 3-Round Hidden Commit-Reveal Machine · FHE Round Resolution      │  │
│  │ Power = Base + Energy + Suit Cycle + Orientation · Zero-Revert   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Modul Smart Contract

1. **`FateToken.sol` (ERC-7984):**
   - Standar token konfidensial OpenZeppelin untuk FHEVM.
   - Saldo pemain disimpan dalam ciphertext `euint64`.
   - Faucet harian memberi 10 `$FATE` per alamat per 24 jam untuk pengujian.

2. **`CardCatalog.sol`:**
   - Registri publik definisi 20 kartu Tarot.
   - Menyimpan `name`, `suit`, `arcana`, `rarity`, `cost`, `basePower`.

3. **`ArcanaCards.sol` (ERC-721):**
   - Tiap NFT mewakili kartu instance di tangan pemain.
   - State `Sealed`: Memiliki `sealedDefId` berupa `euint8` yang hanya bisa didekripsi pemilik. Kartu tersegel tidak bisa ditransfer atau dipakai duel.
   - State `Unsealed`: Identitas kartu menjadi publik melalui dekripsi publik terverifikasi, memungkinkan penggunaan di deck dan trading.

4. **`TarotGacha.sol`:**
   - Menghasilkan kartu tersegel menggunakan random FHE on-chain (`FHE.randEuint8`).
   - Ambang rarity ditentukan dari angka 8-bit terenkripsi (Common 60%, Rare 25%, Epic 12%, Legendary 3%).
   - Pity counter terenkripsi per user untuk menjamin kartu langka.

5. **`DuelEngine.sol`:**
   - Mengatur match 3 ronde: Friendly, Latihan (Bot), atau Stake.
   - Mengunci deck 5 kartu publik.
   - Menghasilkan 3 kartu tangan secara acak terenkripsi dengan orientasi acak (`ebool`).
   - Menyimpan commit terenkripsi dari kedua pemain tiap ronde (slot kartu dan alokasi energi).
   - Menghitung resolusi power secara homomorfik:
     $$\text{Power} = \text{Base} + \text{Energy} + \text{SuitBonus} + \text{Orientation}$$
   - **Zero-Revert Clamp Guard:** Nilai energi yang melebihi sisa energi pemain otomatis di-clamp menggunakan `FHE.select`.
   - Melakukan dekripsi publik hanya untuk pemenang ronde dan pemenang match.

6. **`StakeEscrow.sol`:**
   - Mengelola taruhan NFT 1-untuk-1 mode Ante.
   - Melakukan tier-matching: perbedaan rarity kartu yang dipertaruhkan maksimal 1 tier.
   - Mengunci kartu di escrow; mentransfer kartu lawan ke pemenang saat duel usai, atau mengembalikan kartu saat seri/draw.

---

## 3. Kebijakan Access Control List (ACL) & Privasi

1. Izin dekripsi (`FHE.allow`) hanya diberikan kepada pemilik token / pemain yang bersangkutan.
2. Kartu tersegel tidak dapat ditransfer antar alamat karena ACL dekripsi FHEVM terikat pada alamat minting asli.
3. Seluruh hasil ronde didekripsi publik (`FHE.makePublicallyDecryptable`) agar dapat diverifikasi oleh node mana pun dan explorer.
