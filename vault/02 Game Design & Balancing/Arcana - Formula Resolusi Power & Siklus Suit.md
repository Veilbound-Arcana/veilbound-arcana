# ⚔️ Formula Resolusi Power & Siklus Suit

## 1. Rumus Lengkap Resolusi Ronde
$$\text{Total Power} = P_{\text{base}} + E_{\text{clamped}} + B_{\text{suit}} + M_{\text{orient}}$$

Di mana:
- $P_{\text{base}}$: Base power kartu (Common = 2, Rare = 3, Epic = 4, Legendary = 5).
- $E_{\text{clamped}}$: Alokasi energi pemain (0 s/d 6), di-clamp otomatis oleh `FHE.select`.
- $B_{\text{suit}}$: Bonus keunggulan elemen suit (+1 jika menang, 0 jika kalah/sama/Major Arcana).
- $M_{\text{orient}}$: Pengali orientasi kartu (+1 Upright, -1 Reversed).

## 2. Tabel Matriks Keunggulan Suit
| Penyerang \ Bertahan | Wands (Api) | Swords (Udara) | Pentacles (Tanah) | Cups (Air) | Major (Netral) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Wands** | 0 | **+1** | 0 | 0 | 0 |
| **Swords** | 0 | 0 | **+1** | 0 | 0 |
| **Pentacles** | 0 | 0 | 0 | **+1** | 0 |
| **Cups** | **+1** | 0 | 0 | 0 | 0 |
| **Major Arcana** | 0 | 0 | 0 | 0 | 0 |
