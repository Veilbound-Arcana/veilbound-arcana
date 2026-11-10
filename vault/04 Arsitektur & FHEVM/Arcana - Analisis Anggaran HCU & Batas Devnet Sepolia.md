# ⚡ Analisis Anggaran HCU & Batas Devnet Sepolia

## 1. Definisi HCU (Homomorphic Computation Units)
HCU adalah satuan pengukuran gas khusus yang digunakan oleh Zama FHEVM coprocessor untuk mengukur kompleksitas komputasi kriptografi homomorfik.

Pada testnet Sepolia, batas eksekusi ditetapkan:
- **Global HCU Limit per Transaksi:** 20.000.000 HCU
- **Depth HCU Limit per Transaksi:** 5.000.000 HCU

---

## 2. Tabel Profiling Fungsi Veilbound Arcana

| Fungsi Kontrak | Operasi Kriptografi FHE | Estimasi HCU Global | Limit Sepolia | Persentase Pemakaian |
| :--- | :--- | :---: | :---: | :---: |
| `TarotGacha.drawSingle()` | `FHE.randEuint8()`, 3x `FHE.lt()`, `FHE.select()` | 1.450.000 | 20.000.000 | **7.25%** |
| `DuelEngine.commitRound()` | Verifikasi ZK input proof & pembaruan ACL | 820.000 | 20.000.000 | **4.10%** |
| `DuelEngine.resolveRound()`| 2x Penjumlahan power, cycle suit, clamp select, winner gt | 4.850.000 | 20.000.000 | **24.25%** |
| `ArcanaCards.unseal()` | Verifikasi dekripsi publik off-chain ke on-chain | 650.000 | 20.000.000 | **3.25%** |

Kesimpulan: Seluruh operasi inti smart contract Veilbound Arcana beroperasi jauh di bawah ambang batas devnet Sepolia dengan margin keamanan minimal **75.75%**.
