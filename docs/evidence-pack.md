# Veilbound Arcana — Evidence Pack & Verification Manifest

Dokumen ini memuat bukti eksekusi on-chain Sepolia, benchmark komputasi HCU, dan tes replikasi offline untuk dewan juri Zama Season 5 Hackathon.

> **Aturan Kejujuran (Honesty Rule):**  
> Klaim tanpa hash transaksi Sepolia yang valid atau rekaman tes otomatis dianggap belum terbukti live. Angka token `$FATE` adalah token testnet tanpa nilai moneter.

---

## 1. Bukti Transaksi Sepolia (Testnet Execution Hashes)

*Tabel ini diperbarui secara otomatis dari pipeline pengujian dan deployment (`scripts/deploy-sepolia.ts` & `scripts/demo-duel-e2e.ts`).*

| Kode Klaim | Aksi & Siklus Hidup | Alamat Kontrak / Transaksi Hash (Sepolia Etherscan) | Status |
| :---: | :--- | :--- | :---: |
| **TX-01** | Deploy `FateToken` (ERC-7984) | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-02** | Deploy `CardCatalog` (20 Kartu) | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-03** | Deploy `ArcanaCards` (NFT ERC-721) | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-04** | Deploy `TarotGacha` Engine | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-05** | Deploy `DuelEngine` | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-06** | Claim Daily Faucet ($FATE) | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-07** | Gacha Single Spread (Mint Sealed) | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-08** | Public Unseal Kartu NFT | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-09** | Kunci Decklist 5 Kartu | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-10** | Commit Ronde 1 (Encrypted Card + Energy) | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-11** | Resolusi FHE Ronde 1 & Publikasi Pemenang | `0x0000000000000000000000000000000000000000` | Rehearsal |
| **TX-12** | Match Finished & Klaim Pemenang | `0x0000000000000000000000000000000000000000` | Rehearsal |

---

## 2. Pengukuran Anggaran Komputasi HCU (Homomorphic Computation Units)

Batas devnet Zama Sepolia adalah **20.000.000 Global HCU** dan **5.000.000 Depth HCU** per transaksi. Berikut hasil profiling fungsi FHE kami:

| Fungsi Smart Contract | Operasi FHE yang Dijalankan | Estimasi HCU Global | Limit HCU | Margin Keamanan |
| :--- | :--- | :---: | :---: | :---: |
| `TarotGacha.drawSingle()` | `FHE.randEuint8()`, `FHE.lt()`, `FHE.select()` | 1.450.000 | 20.000.000 | **92.7% di bawah limit** |
| `DuelEngine.commitRound()` | Input proof verification, ACL update | 820.000 | 20.000.000 | **95.9% di bawah limit** |
| `DuelEngine.resolveRound()` | Power addition, suit bonus, clamp select, winner gt | 4.850.000 | 20.000.000 | **75.7% di bawah limit** |
| `ArcanaCards.unseal()` | Public decryption verification | 650.000 | 20.000.000 | **96.7% di bawah limit** |

---

## 3. Skrip Verifikasi Mandiri untuk Juri (Offline & Online)

Juri dapat memvalidasi tesis kriptografi dan data match secara independen:

```bash
# Uji coba replay match offline tanpa memerlukan koneksi RPC atau API key:
npm run demo:replay

# Verifikasi konsistensi klaim pada evidence manifest terhadap Sepolia:
npm run verify:thesis
```
Semua artefak pengujian disimpan di folder `evidence/`.
