# 📐 Kamus Angka Resmi — Veilbound Arcana (Model Data)

Dokumen ini adalah **sumber kebenaran tunggal (single source of truth)** untuk seluruh konstanta angka, probabilitas, parameter duel, dan batas komputasi kriptografi FHEVM pada proyek Veilbound Arcana. Angka di dalam smart contract, backend, frontend, dan SDK **wajib mengikuti nilai di dokumen ini**.

---

## 1. Parameter Dasar Pertarungan (Duel Arena)

| Parameter | Nilai Resmi | Keterangan & Dasar Desain |
| :--- | :---: | :--- |
| **Ukuran Deck Resmi** | **5 Kartu** | Wajib Unsealed, terverifikasi on-chain saat match dimulai |
| **Batas Total Biaya (Cost) Deck** | **Maksimal 12** | Menghindari deck 'all-legendary' (4 Legendary = 16 cost > 12) |
| **Batas Duplikat Kartu** | **Maksimal 2 Salinan** | Maksimal 2 kartu dengan `cardDefId` yang sama per deck |
| **Ukuran Tangan (Hand)** | **3 Kartu** | Diambil dan diacak terenkripsi on-chain dari 5 kartu deck |
| **Jumlah Ronde per Match** | **3 Ronde** | Best of 3 format standar TCG cepat |
| **Ambang Kemenangan Match** | **2 Poin Ronde** | Pemain pertama yang memenangkan 2 ronde langsung menang match |
| **Pool Energi Match** | **6 Unit Energi** | Pool energi dibagi bebas oleh pemain lintas 3 ronde (cth: 2-2-2 atau 4-1-1) |
| **Timeout Commit Ronde** | **120 Detik (Demo) / 300 Detik (Std)** | Batas waktu tunggu commit sebelum lawan berhak klaim menang |

---

## 2. Rumus Power Ronde & Modifiers

$$\text{Power Akhir Ronde} = \text{Power Dasar Kartu} + \text{Alokasi Energi} + \text{Bonus Siklus Suit} + \text{Efek Orientasi}$$

### A. Siklus Keunggulan Suit (Suit Advantage Cycle)
Siklus batu-gunting-kertas 4 elemen Tarot klasik:
$$\text{Wands (Api)} > \text{Swords (Udara)} > \text{Pentacles (Tanah)} > \text{Cups (Air)} > \text{Wands (Api)}$$

- Jika Suit pemain menang terhadap Suit lawan: **+1 Power Bonus**
- Jika Suit sama atau kalah: **+0 Power Bonus**
- Kartu Major Arcana (Legendary) bertipe **Neutral / None**: Tidak memiliki keunggulan suit (+0) dan tidak bisa dikalahkan oleh bonus suit lawan (+0).

### B. Efek Orientasi Kartu (Tarot Flip)
Setiap kartu yang masuk ke tangan mendapatkan orientasi acak terenkripsi on-chain (`ebool`):
- **Upright (Tegak):** **+1 Power Modifier**
- **Reversed (Terbalik):** **-1 Power Modifier**

### C. Resolusi & Seri
- Pemain dengan Power Akhir lebih tinggi memenangkan ronde (+1 Poin).
- Jika Power Akhir sama: **Ronde Seri (0 Poin untuk kedua pemain)**.
- Jika setelah 3 ronde skor imbang: **Match Seri (Draw)**.

---

## 3. Peluang Gacha (Tarot Spread Drop Odds)

| Tier Rarity | Odds Gacha | Rentang Ambang Random 8-bit (`0–255`) | Jaminan Pity |
| :--- | :---: | :---: | :--- |
| **Common** | **60%** | `0` s/d `152` | Default tier drop |
| **Rare** | **25%** | `153` s/d `216` | Jaminan pada tarikan ke-5 tanpa Rare+ |
| **Epic** | **12%** | `217` s/d `247` | Jaminan pada tarikan ke-12 tanpa Epic+ |
| **Legendary** | **3%** | `248` s/d `255` | Hard pity pada tarikan ke-25 |

---

## 4. Batas Komputasi FHEVM (Sepolia Devnet)

| Kategori Batas | Batas Maksimum | Aturan Penanganan Veilbound Arcana |
| :--- | :---: | :--- |
| **Global HCU per Transaksi** | **20.000.000 HCU** | Pecah alur gacha (bayar $\rightarrow$ draw $\rightarrow$ unseal) |
| **Depth HCU per Transaksi** | **5.000.000 HCU** | Hindari operasi matematika terenkripsi bertingkat |
| **Aturan Zero-Revert (Clamp)** | **Wajib 100%** | Input energi $> \text{sisa energi}$ otomatis di-clamp ke sisa energi via `FHE.select` |
