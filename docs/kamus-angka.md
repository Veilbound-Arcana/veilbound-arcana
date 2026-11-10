# Veilbound Arcana — Kamus Angka Resmi (Game Balance & Parameters)

Dokumen ini adalah **sumber kebenaran tunggal (single source of truth)** untuk seluruh konstanta angka, probabilitas, parameter duel, dan batas komputasi kriptografi FHEVM pada proyek Veilbound Arcana. Angka di dalam smart contract, backend, frontend, dan SDK **wajib mengikuti nilai di dokumen ini**.

---

## 1. Parameter Dasar Pertarungan (Duel Arena)

| Parameter | Nilai Resmi | Keterangan |
| :--- | :---: | :--- |
| **Ukuran Deck Resmi** | **5 Kartu** | Wajib Unsealed, terverifikasi on-chain saat match dimulai |
| **Batas Total Biaya (Cost) Deck** | **Maksimal 12** | Total penjumlahan cost dari 5 kartu dalam deck |
| **Batas Duplikat Kartu** | **Maksimal 2 Salinan** | Maksimal 2 kartu dengan `cardDefId` yang sama per deck |
| **Ukuran Tangan (Hand)** | **3 Kartu** | Diambil dan diacak terenkripsi on-chain dari 5 kartu deck |
| **Jumlah Ronde per Match** | **3 Ronde** | Maksimal 3 ronde |
| **Ambang Kemenangan Match** | **2 Poin Ronde** | Pemain pertama yang memenangkan 2 ronde menang match |
| **Pool Energi Match** | **6 Unit Energi** | Pool energi dibagi bebas oleh pemain lintas 3 ronde |
| **Timeout Commit Ronde** | **120 Detik (Demo) / 300 Detik (Std)** | Batas waktu tunggu commit sebelum lawan berhak klaim menang |

---

## 2. Rumus Power Ronde & Modifiers

$$\text{Power Akhir Ronde} = \text{Power Dasar Kartu} + \text{Alokasi Energi} + \text{Bonus Siklus Suit} + \text{Efek Orientasi}$$

### A. Siklus Keunggulan Suit (Suit Cycle)
Siklus batu-gunting-kertas 4 elemen Tarot:
$$\text{Wands} > \text{Swords} > \text{Pentacles} > \text{Cups} > \text{Wands}$$

- Jika Suit pemain menang terhadap Suit lawan: **+1 Power Bonus**
- Jika Suit sama atau kalah: **+0 Power Bonus**

### B. Efek Orientasi Kartu (Tarot Flip)
Setiap kartu yang ditarik ke tangan mendapatkan orientasi acak terenkripsi on-chain:
- **Upright (Tegak):** **+1 Power Modifier**
- **Reversed (Terbalik):** **-1 Power Modifier**

### C. Resolusi & Seri
- Pemain dengan Power Akhir lebih tinggi memenangkan ronde (+1 Poin).
- Jika Power Akhir sama: **Ronde Seri (0 Poin)**.
- Jika setelah 3 ronde skor imbang: **Match Seri (Draw)**.

---

## 3. Katalog Resmi 20 Kartu MVP

| ID | Nama Kartu | Arcana | Suit | Rarity | Cost | Base Power | Kemampuan / Catatan |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | Page of Wands | Minor | Wands | Common | 1 | 2 | Pengintai api muda |
| **2** | Knight of Wands | Minor | Wands | Common | 1 | 2 | Penyerang api cepat |
| **3** | Queen of Wands | Minor | Wands | Rare | 2 | 3 | Penguasa bara |
| **4** | King of Wands | Minor | Wands | Epic | 3 | 4 | Titik puncak kekuatan api |
| **5** | Page of Cups | Minor | Cups | Common | 1 | 2 | Pembawa kabar emosi |
| **6** | Knight of Cups | Minor | Cups | Common | 1 | 2 | Pelindung cawan suci |
| **7** | Queen of Cups | Minor | Cups | Rare | 2 | 3 | Intuisi kedalaman air |
| **8** | King of Cups | Minor | Cups | Epic | 3 | 4 | Penguasa ombak samudra |
| **9** | Page of Swords | Minor | Swords | Common | 1 | 2 | Pemikir tajam pemula |
| **10** | Knight of Swords | Minor | Swords | Common | 1 | 2 | Terjangan angin puyuh |
| **11** | Queen of Swords | Minor | Swords | Rare | 2 | 3 | Kebijaksanaan dingin |
| **12** | King of Swords | Minor | Swords | Epic | 3 | 4 | Penghakiman udara mutlak |
| **13** | Page of Pentacles | Minor | Pentacles | Common | 1 | 2 | Pelindung koin tanah |
| **14** | Knight of Pentacles | Minor | Pentacles | Common | 1 | 2 | Ketahanan benteng |
| **15** | Queen of Pentacles | Minor | Pentacles | Rare | 2 | 3 | Kemakmuran bumi |
| **16** | King of Pentacles | Minor | Pentacles | Epic | 3 | 4 | Fondasi kekayaan tanah |
| **17** | 0 — The Fool | Major | Neutral | Legendary | 4 | 5 | Permulaan mistis tanpa batas |
| **18** | I — The Magician | Major | Neutral | Legendary | 4 | 5 | Pengendali 4 elemen |
| **19** | II — High Priestess | Major | Neutral | Legendary | 4 | 5 | Penjaga gerbang tabir rahasia |
| **20** | XXI — The World | Major | Neutral | Legendary | 4 | 5 | Siklus penyelesaian sempurna |

### Distribusi Rarity
- **Common:** 8 Kartu (40%) · Base Power = 2 · Cost = 1
- **Rare:** 4 Kartu (20%) · Base Power = 3 · Cost = 2
- **Epic:** 4 Kartu (20%) · Base Power = 4 · Cost = 3
- **Legendary (Major Arcana):** 4 Kartu (20%) · Base Power = 5 · Cost = 4

---

## 4. Peluang Gacha (Tarot Spread Drop Odds)

| Tier Rarity | Odds Gacha | Rentang Ambang Random 8-bit (`0–255`) | Jaminan Pity |
| :--- | :---: | :---: | :--- |
| **Common** | **60%** | `0` s/d `152` | Default tier |
| **Rare** | **25%** | `153` s/d `216` | Diberikan jika $\ge 5$ tarikan tanpa Rare+ |
| **Epic** | **12%** | `217` s/d `247` | Diberikan jika $\ge 12$ tarikan tanpa Epic+ |
| **Legendary** | **3%** | `248` s/d `255` | Hard pity pada tarikan ke-25 |

---

## 5. Batas FHEVM Coprocessor (Sepolia Devnet)

| Kategori Batas | Batas Maksimum | Aturan Penanganan Veilbound Arcana |
| :--- | :---: | :--- |
| **Global HCU per Transaksi** | **20.000.000 HCU** | Pecah alur gacha (bayar $\rightarrow$ draw $\rightarrow$ unseal) |
| **Depth HCU per Transaksi** | **5.000.000 HCU** | Hindari operasi matematika terenkripsi bertingkat |
| **Aturan Zero-Revert (Clamp)** | **Wajib 100%** | Input energi $> \text{sisa energi}$ otomatis di-clamp ke sisa energi via `FHE.select` |
