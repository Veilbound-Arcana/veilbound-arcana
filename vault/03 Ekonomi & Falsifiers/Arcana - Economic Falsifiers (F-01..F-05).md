# 📉 Economic Falsifiers — Pengujian & Hipotesis Kegagalan Ekonomi

Dokumen ini mendefinisikan skenario kegagalan (*falsifiers*) dan batasan sistem ekonomi Veilbound Arcana untuk memastikan proyek bebas dari risiko eksploitasi atau insentif spekulasi beracun.

---

### F-01: Exploit Revert-to-Snipe Gacha
- **Hipotesis Kegagalan:** Pemain dapat menggunakan smart contract proxy untuk memanggil `drawSingle()`, memeriksa hasil kartu, dan jika hasilnya Common, me-revert transaksi agar token $FATE tidak berkurang.
- **Hasil Uji & Falsifikasi:** **GAGAL / AMAN.** Hasil undian `FHE.randEuint8()` disimpan dalam bentuk ciphertext terenkripsi ke alamat pemilik. Proxy kontrak pemanggil tidak dapat mendekripsi hasil secara synchronously saat minting, sehingga proxy tidak memiliki kondisi boolean untuk memicu revert.

### F-02: Front-Running Penawaran Energi di Duel
- **Hipotesis Kegagalan:** Lawan memantau mempool Sepolia untuk melihat jumlah energi yang di-bid pemain pertama, lalu mengirim transaksi dengan energi $+1$.
- **Hasil Uji & Falsifikasi:** **GAGAL / AMAN.** Nilai alokasi energi dikirim sebagai ciphertext `euint8` dengan zero-knowledge proof ke smart contract `DuelEngine.sol`. Validator dan lawan tidak dapat membaca angka riil di balik ciphertext.

### F-03: Griefing Timeout Forfeit
- **Hipotesis Kegagalan:** Pemain yang posisinya kalah sengaja menutup browser dan menolak mengirim komitmen ronde agar match menggantung selamanya.
- **Hasil Uji & Falsifikasi:** **GAGAL / AMAN.** Kontrak menerapkan `commitTimeout = 120 seconds`. Jika batas waktu terlampaui dan satu pemain telah commit sementara pemain lain tidak, pemain aktif dapat memanggil `claimTimeoutWin()` untuk otomatis menang.

### F-04: Ketidakseimbangan Deck Legendary Spam
- **Hipotesis Kegagalan:** Kolektor kaya menumpuk 5 kartu Legendary (Power 5) untuk mendominasi duel tanpa strategi.
- **Hasil Uji & Falsifikasi:** **GAGAL / AMAN.** Smart contract mengunci aturan decklist: total cost $\le 12$. Kartu Legendary memiliki cost 4. Maka sebuah deck maksimal hanya dapat memuat 2 kartu Legendary (cost $4 + 4 = 8$), dan sisa 3 slot harus diisi kartu berbiaya murah (cost 1 atau 2).

### F-05: Sybil Attack Klaim Faucet
- **Hipotesis Kegagalan:** Pengguna membuat ribuan wallet otomatis untuk menguras token $FATE dari faucet.
- **Hasil Uji & Falsifikasi:** **AMBANG BATAS.** Token $FATE pada Sepolia testnet adalah token tes tanpa nilai moneter dan tidak dapat diperdagangkan ke fiat/stablecoin. Batas faucet 24 jam per alamat membatasi laju penarikan per sesi.
