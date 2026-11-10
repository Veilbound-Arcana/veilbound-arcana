# ADR-003: Permutasi Tangan Terenkripsi vs Deck Publik

## Status: Accepted
## Konteks:
Memilih 3 kartu acak dari 5 kartu deck secara rahasia tanpa pengulangan kartu di FHEVM berpotensi memakan HCU besar jika menggunakan sorting network penuh.
## Keputusan:
Deck 5 kartu diverifikasi publik saat lock. Pemilihan tangan 3 kartu diacak menggunakan permutasi terenkripsi Fisher-Yates 3-step dengan conditional swap sederhana.
