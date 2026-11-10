# 🎬 Script Video Pitch 3 Menit — Veilbound Arcana

> **Peraturan Wajib Zama Season 5:** Video demo wajib berdurasi maksimal 3 menit dan dipresentasikan oleh **orang sungguhan (wajah & suara asli manusia)**. Penggunaan avatar AI atau suara sintetis AI akan langsung mendiskualifikasi submission.

---

### Segment 1: Hook Masalah On-Chain Gaming (0:00 – 0:30)
- **Visual:** Kamera menampilkan wajah presenter (Adrian / Arya), kemudian cut ke layar explorer Sepolia dengan transaksi kartu transparan.
- **Presenter (Bicara):**
  > "Halo juri Zama Season 5! Game kartu on-chain saat ini memiliki masalah fatal: transparansi mutlak. Saat Anda menarik gacha, bot bisa membatalkan transaksi bila hasilnya jelek atau men-snipe kartu langka. Dan saat bertarung, tangan dan langkah Anda terlihat di mempool, membunuh esensi bluffing.
  > Kami mempersembahkan **Veilbound Arcana** — confidential Tarot TCG pertama di Sepolia yang ditenagai oleh Zama FHEVM Protocol v0.13."

### Segment 2: Ritual Gacha & Unseal (0:30 – 1:15)
- **Visual:** Screen recording aplikasi Veilbound Arcana. Menghubungkan wallet, menandatangani sesi dekripsi 1 kali, menekan tombol *Draw Single Spread*. Kartu membalik dengan animasi 3D Framer Motion, status beralih dari *Sealed* ke *Unsealed*.
- **Presenter (Voiceover):**
  > "Mari kita mulai dari Ritual Tarot. Menggunakan token konfidensial FateToken standar ERC-7984, pemain menarik spread. Di balik layar, FHE on-chain random roll menentukan kelangkaan kartu secara terenkripsi.
  > Bot di explorer hanya melihat ciphertext — mereka tidak bisa tahu apakah kartu ini Common atau Legendary. Hanya pemilik yang bisa mendekripsinya di browser, lalu menekan tombol Unseal agar kartu aktif di koleksi."

### Segment 3: Duel Arena 3 Ronde & Bluff Taktis (1:15 – 2:15)
- **Visual:** Masuk ke Ruang Duel melawan Practice Bot (FR-20). Memperlihatkan tangan 3 kartu rahasia, memilih kartu slot 1, menggeser slider alokasi energi ke 2, menekan *Commit Round*. Tampilan FHE coprocessor menyelesaikan ronde, dan pengumuman pemenang ronde muncul.
- **Presenter (Voiceover):**
  > "Sekarang, inti permainan: Duel Bluff 3 Ronde. Kedua pemain memiliki 5 kartu deck terkunci, dengan tangan 3 kartu yang hanya bisa dilihat pemiliknya. Tiap ronde, kami mengalokasikan energi dari pool 6 energi dan memilih kartu secara rahasia.
  > FHE coprocessor menghitung power, bonus siklus elemen Wands-Swords-Pentacles-Cups, serta orientasi Upright atau Reversed secara homomorfik.
  > Yang terpenting: sistem kami menerapkan Zero-Revert Clamp Guard. Jika pemain mencoba menawar energi melebihi sisa, nilainya di-clamp secara senyap via `FHE.select` tanpa pernah me-revert transaksi!"

### Segment 4: Bukti Kriptografi & Mode Staking (2:15 – 2:45)
- **Visual:** Membuka Halaman Verify, menampilkan daftar transaksi Sepolia yang terverifikasi, odds kontrak publik, dan mode Ante Staking 1-NFT.
- **Presenter (Voiceover):**
  > "Bagi pemain kompetitif, ada Mode Ante: pertaruhkan 1 NFT kartu dengan tier matching yang adil. Semua hasil, bukti dekripsi, dan odds acak dapat diverifikasi di Halaman Verify tanpa mengorbankan privasi tangan pemain."

### Segment 5: Penutup & Roadmap (2:45 – 3:00)
- **Visual:** Kamera kembali ke wajah presenter. Menampilkan alamat demo web dan link GitHub organisasi `Veilbound-Arcana`.
- **Presenter (Bicara):**
  > "Veilbound Arcana membuktikan bahwa FHE bukan hanya fitur privasi, tapi fondasi gameplay TCG yang sesungguhnya. Coba demo langsung kami di Sepolia atau jalankan skrip replay offline kami. Terima kasih!"
