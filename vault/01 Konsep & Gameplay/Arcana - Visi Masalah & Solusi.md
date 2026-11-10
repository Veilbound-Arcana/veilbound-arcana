# 🌌 Visi, Masalah Chain Transparan & Solusi FHE

## 1. Visi Proyek
Veilbound Arcana lahir untuk menjawab satu paradoks besar dalam Web3 Gaming: **Bagaimana menciptakan game strategi kartu yang adil dan memiliki kepemilikan nyata (NFT) tanpa menghancurkan mekanik bluffing akibat sifat blockchain yang transparan?**

Kami menggabungkan estetika mistisisme Tarot tradisional dengan teknologi komputasi kriptografi mutakhir: **Fully Homomorphic Encryption (FHE)** melalui protokol **Zama FHEVM** di jaringan Ethereum Sepolia.

---

## 2. Masalah Fundamental Blockchain Transparan pada Game Kartu

| Aspek Game | Masalah di Chain Publik Transparan | Dampak Eksploitasi |
| :--- | :--- | :--- |
| **Gacha Spread** | Transaksi di mempool dapat diinspeksi sebelum blok difinalisasi | Bot dapat me-revert transaksi bila hasil undian jelek (*front-running / snipe*) |
| **Tangan Pemain** | State kartu di tangan tersimpan dalam storage publik | Lawan membaca mempool/storage; bluffing menjadi mustahil |
| **Alokasi Energi** | Nilai bid energi terlihat saat transaksi commit dikirim | Pemain kedua (*second-mover*) selalu bisa menawar $+1$ di atas lawan |
| **Orientasi Kartu** | Posisi upright/reversed terlihat sebelum ronde dimulai | Lawan sudah mengetahui kartu modifier (+1 / -1) sebelum kartu dimainkan |
| **Profil Saldo** | Saldo pemain terpapar secara publik di explorer | *Whale tracking*, intimidasi ekonomi, dan eksploitasi pola belanja pemain |

---

## 3. Solusi Terobosan FHE (Fully Homomorphic Encryption)

FHE memungkinkan smart contract mengeksekusi operasi matematika langsung di atas data terenkripsi (`ciphertext`) tanpa pernah membuka kuncinya ke publik:

1. **Undian Acak Terenkripsi On-Chain:** Angka acak dihasilkan di coprocessor (`FHE.randEuint8`) dan langsung dipetakan ke kartu NFT berstatus *Sealed*. Tidak ada pihak yang dapat mengintip isi kartu sebelum pemilik membuka dekripsinya.
2. **Hidden Commit-Reveal Simultan:** Kedua pemain meng-commit pilihan kartu dan alokasi energi dalam bentuk ciphertext. Resolusi ronde dihitung homomorfik di Sepolia coprocessor.
3. **Penyelesaian Publik yang Verifiable:** Hanya pemenang ronde ($0 = \text{seri}, 1 = A, 2 = B$) yang didekripsi secara publik ke blockchain. Identitas kartu di tangan tetap rahasia.
