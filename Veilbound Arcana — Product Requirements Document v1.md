# Veilbound Arcana — Product Requirements Document v1

Status: Draft v1 · 10 November 2026 · Target: Zama Developer Program Mainnet Season 5 (Confidential Gaming), Sepolia testnet · Tenggat resmi: 14 Desember 2026, 23.59 AOE (sekitar 15 Desember, 18.59 WIB atau 20.59 WIT; hitung ulang sebelum mengandalkannya) · Target internal submit: 12 Desember · Judul kerja tanpa kata “Zama” · Dokumen pendamping: Game Design Document v1

## 1. Ringkasan eksekutif

Veilbound Arcana adalah game kartu koleksi (TCG) bertema tarot di Sepolia. Pemain menarik kartu NFT lewat gacha “tarot spread” yang hasilnya terenkripsi sampai dibuka pemiliknya, menyusun deck dari koleksi, lalu bertarung dalam duel 3 ronde. Tangan, kartu pilihan, dan alokasi energi tetap rahasia sampai hasil ronde dibuka. Mode taruhan opsional memungkinkan pemenang merebut 1 NFT lawan, dan pemain dapat saling menukar kartu.

Proposisi nilai:

1. Gacha dengan odds yang bisa diverifikasi tetapi hasil yang tidak bisa diintip, di-snipe, atau dibatalkan bot saat hasilnya jelek.
2. Duel bluff yang tidak mungkin di chain transparan, karena tangan dan langkah akan terlihat lawan.
3. Koleksi NFT nyata yang bisa ditukar dan dipertaruhkan.

Sasaran proyek: memenuhi seluruh syarat submission dan unggul pada kriteria gameplay, desain konfidensialitas, dan fairness. Halaman resmi menegaskan bahwa FHE yang berfungsi hanyalah tiket masuk; yang dicari adalah game yang benar-benar seru dimainkan.

## 2. Konteks hackathon dan kepatuhan

Sumber: halaman resmi program (dibaca 10 November 2026) dan dokumen program yang diberikan. Hadiah total 5.000 cUSDT untuk maksimal 3 pemenang (2.500, 1.500, 1.000), dapat disesuaikan dengan kualitas submission.

| Syarat resmi | Cara memenuhi |
| --- | --- |
| Game di Zama Protocol, deploy di Sepolia | Seluruh kontrak FHEVM dideploy di Sepolia |
| Smart contract dan frontend | Satu monorepo: contracts dan app |
| Demo berjalan di website | Hosting statis dengan alamat kontrak Sepolia |
| Token ERC-7984 (jika relevan) | FateToken sebagai mata uang gacha |
| Video demo 3 menit, pitch oleh orang sungguhan | Rekaman langsung; tanpa video atau suara AI |
| Thread atau artikel di X | Thread 6 posting (lihat bagian 17) |
| Dokumentasi jelas | README terstruktur dan ADR singkat |
| Nama proyek tanpa kata “Zama” | Judul kerja Veilbound Arcana |
| Disclaimer di aplikasi dan README | Teks wajib di footer app dan README |
| Satu submit per email, tidak bisa diedit; email sama dengan email API key | Dry run formulir, submit paling lambat 12 Desember |

Peta kriteria juri:

| Kriteria | Bukti dalam proyek | Prioritas |
| --- | --- | --- |
| Gameplay dan UX | Ritual gacha, duel bluff, status jelas saat dekripsi | Tinggi |
| Confidentiality design | Tabel data terenkripsi (bagian 11) termasuk kebocoran yang diakui | Tinggi |
| Fairness | Acak onchain, odds publik, halaman Verify | Tinggi |
| Functionality | Satu alur penuh dari gacha sampai hasil match di Sepolia | Kritis |
| Demo quality | Video 3 menit yang berpusat pada satu match | Tinggi |
| Code quality | Modul terpisah, tes Hardhat, dokumentasi | Sedang |

Tema contoh di halaman resmi (tangan yang tersembunyi sampai dimainkan, odds yang terbukti tetapi hasil yang privat, undian yang bisa diverifikasi tanpa bisa diintip) sangat dekat dengan gacha dan duel proyek ini.

## 3. Masalah dan peluang

Game onchain biasanya bermasalah karena semuanya publik. Di game kartu, itu berarti:

- Hasil gacha bisa diintip, diprediksi, atau dibatalkan oleh bot jika hasilnya jelek.
- Tangan dan deck terlihat, sehingga tidak ada bluff.
- Langkah yang dikirim berurutan memberi keuntungan pada pemain yang bergerak belakangan.
- Saldo dan pola belanja pemain terpapar.

FHE memungkinkan state tetap terenkripsi sambil tetap dihitung onchain, sehingga game-game ini menjadi mungkin.

## 4. Target pengguna

| Persona | Tujuan | Masalah di chain transparan | Fitur kunci |
| --- | --- | --- | --- |
| Kolektor kasual | Mengumpulkan kartu, menikmati ritual gacha | Hasil bisa diintip, saldo terlihat | Gacha tersegel, koleksi, trading |
| Duelist | Menang lewat strategi dan bluff | Tangan dan langkah terlihat | Duel tersembunyi, deck builder, Stake |
| Reviewer hackathon | Menilai cepat dan memainkan satu ronde penuh | Demo rumit dan butuh dua pemain | Mode Latihan, halaman Verify, README |

## 5. Tujuan, non-tujuan, dan metrik

Tujuan:

- Alur penuh bisa dimainkan end-to-end di Sepolia.
- Kerahasiaan terasa mudah: pemain cukup menandatangani sesi dekripsi sekali.
- Setiap klaim kerahasiaan dan fairness punya bukti yang bisa diperiksa.
- Arsitektur modular agar kategori, set, dan mode bisa ditambah setelah hackathon.

Non-tujuan (untuk submission ini):

- Deploy mainnet, token bernilai nyata, atau audit keamanan.
- Aplikasi native mobile.
- Matchmaking berbasis rating, marketplace berharga, booster pack, dan trading kartu tersegel.

Metrik keberhasilan (sasaran awal, dikalibrasi ulang setelah vertical slice):

| Metrik | Target | Cara ukur |
| --- | --- | --- |
| Alur penuh oleh pengguna baru (faucet, gacha, Unseal, deck, duel, hasil) | 10 menit atau kurang | Uji coba dengan 3 orang |
| Gacha Single: klik sampai kartu terbuka | 60 detik atau kurang | Stopwatch di Sepolia |
| Satu ronde duel: commit kedua pihak sampai hasil publik | 90 detik atau kurang | Stopwatch di Sepolia |
| Match selesai tanpa error | 10 dari 10 percobaan berturut-turut | Skrip E2E |
| Cakupan tes modul inti | 85% baris atau lebih | Laporan coverage |
| Kriteria juri dengan bukti di README | 6 dari 6 | Checklist |

## 6. Lingkup dan prioritas (MoSCoW)

| Prioritas | Fitur |
| --- | --- |
| Must | Wallet dan sesi dekripsi; FateToken dengan faucet; gacha Single; Sealed dan Unseal; koleksi; deck builder; DuelEngine 3 ronde dengan timeout; lobby match Friendly; halaman Verify minimal; disclaimer; README; deploy demo; video; thread X |
| Should | Mode Stake (Ante); swap trading 1-untuk-1; gacha Three-Card; pity meter; Mode Latihan melawan bot |
| Could | Replay terbuka setelah match; daily reading gratis; UI dua bahasa; animasi dan suara tambahan; beberapa slot deck |
| Won’t (MVP) | Booster pack, trading kartu tersegel, marketplace berharga, Vault, High Stakes, rating dan matchmaking, season baru |

## 7. Alur pengguna utama

1. Pemain membuka app, menghubungkan wallet, dan berpindah ke Sepolia.
2. Pemain menandatangani sesi dekripsi satu kali.
3. Pemain mengambil token dari faucet (saldo terenkripsi).
4. Pemain memilih spread, membayar, lalu menerima kartu tersegel.
5. Kartu dibuka (didekripsi) lewat animasi flip, lalu pemain menekan Unseal agar identitas kartu menjadi publik dan bisa dipakai.
6. Pemain menyusun deck 5 kartu dan mengunci pilihannya.
7. Pemain membuat atau menggabung match (Friendly, Stake, atau Latihan).
8. Tangan 3 kartu dibagikan terenkripsi. Tiap ronde, pemain memilih kartu dan alokasi energi, lalu mengirimnya terenkripsi.
9. Hasil ronde dibuka publik; match berakhir pada 2 poin.
10. Pemain membuka halaman Verify untuk memeriksa transaksi dan bukti hasil.

Alur alternatif: lawan tidak commit (timeout, klaim menang); Stake seri (kartu dikembalikan); pemain keluar lalu kembali (state match tetap bisa dilanjutkan).

## 8. Persyaratan fungsional

| ID | Modul | Kebutuhan | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- | --- |
| FR-01 | Onboarding | Hubungkan wallet dan deteksi jaringan salah | Must | Pesan jelas dan tombol ganti jaringan |
| FR-02 | Onboarding | Satu tanda tangan membuka sesi dekripsi | Must | Tidak ada permintaan tanda tangan berulang dalam satu sesi |
| FR-03 | Token | Faucet FateToken (ERC-7984) dengan batas per alamat per hari | Must | Saldo terenkripsi bertambah dan hanya pemilik yang bisa melihat |
| FR-04 | Token | Tampilkan saldo terdekripsi milik pemain | Must | Pemain lain tidak bisa mendekripsi |
| FR-05 | Gacha | Spread Single: bayar harga tetap, terima 1 kartu tersegel | Must | Kartu tersegel ter-mint ke pembeli; hasil tidak terlihat di explorer |
| FR-06 | Gacha | Odds rarity publik di kontrak dan di UI | Must | Nilai di UI sama dengan kontrak |
| FR-07 | Gacha | Pity meter terenkripsi per pemain | Should | Kartu langka dijamin setelah N tarikan; counter tidak terbaca pihak lain |
| FR-08 | Gacha | Spread Three-Card | Should | 3 kartu tersegel dengan acak independen |
| FR-09 | Gacha | Ritual UI: kartu face-down dan flip bertahap | Must | Ada status memuat selama dekripsi |
| FR-10 | Koleksi | Daftar kartu dengan filter suit, rarity, dan status | Must | Filter berfungsi |
| FR-11 | Koleksi | Unseal lewat dekripsi publik yang terverifikasi | Must | Kontrak menyimpan identitas hanya jika bukti valid; kartu tersegel tidak bisa ditransfer atau dipakai |
| FR-12 | Deck | Deck 5 kartu Unsealed; maks 2 salinan per definisi; total cost 12 atau kurang | Must | Pelanggaran ditolak kontrak dan UI |
| FR-13 | Deck | Beberapa slot deck | Could | Pemain bisa memilih deck saat match |
| FR-14 | Match | Buat dan gabung match lewat lobby atau tautan undangan | Must | Dua pemain bisa memulai match |
| FR-15 | Match | Kunci decklist; acak tangan 3 kartu terenkripsi | Must | Tangan hanya bisa didekripsi pemiliknya |
| FR-16 | Match | Commit terenkripsi per ronde (slot kartu dan energi) | Must | Input tidak sah di-clamp, tidak revert |
| FR-17 | Match | Resolusi ronde onchain; hanya pemenang ronde dibuka publik | Must | Event memuat pemenang; kartu dan energi tidak terbuka |
| FR-18 | Match | Timeout commit dan klaim menang | Must | Setelah batas waktu, pemain yang sudah commit bisa klaim |
| FR-19 | Match | Selesai di 2 poin; seri bila imbang setelah 3 ronde | Must | Status akhir benar |
| FR-20 | Match | Mode Latihan melawan bot (skrip dengan wallet khusus, dinyatakan terbuka) | Should | Reviewer bisa menyelesaikan satu match sendirian |
| FR-21 | Match | Replay opsional: kedua pemain setuju membuka isi ronde | Could | Isi ronde tampil setelah dua persetujuan |
| FR-22 | Stake | Mode Ante: kedua pemain menyetor 1 NFT Unsealed ke escrow | Should | Match tidak mulai tanpa dua setoran; tier matching selisih maksimal 1 |
| FR-23 | Stake | Penyelesaian: pemenang menerima kartu lawan; seri dan timeout sesuai aturan | Should | NFT tidak pernah terkunci permanen |
| FR-24 | Stake | Feature flag untuk mematikan Stake | Should | Flag mati menyembunyikan mode di UI dan menolak di kontrak |
| FR-25 | Trading | Swap 1-untuk-1 lewat escrow (buat, terima, batal) | Should | Dua NFT berpindah atomik |
| FR-26 | Verify | Halaman Verify: tarikan gacha dan transkrip match | Must | Tiap ronde menampilkan transaksi dan bukti dekripsi |
| FR-27 | Umum | Disclaimer wajib di app dan README | Must | Teks persis seperti ketentuan program |
| FR-28 | Umum | UI dua bahasa (Indonesia dan Inggris) | Could | Toggle bahasa |

## 9. Persyaratan non-fungsional

| Kategori | Persyaratan |
| --- | --- |
| UX | Setiap aksi terenkripsi punya status (menunggu, memproses, siap); tidak ada layar kosong; pesan error manusiawi; tooltip singkat “mengapa ini rahasia” |
| Performa | Memenuhi metrik bagian 5; tiap fungsi FHE punya anggaran HCU yang dicatat. Dokumentasi menyebut batas 20 juta HCU global dan 5 juta HCU depth per transaksi (angka devnet), plus metering per blok; cek nilai di Sepolia |
| Keamanan | Kontrol akses ketat; reentrancy guard di escrow; tidak ada mint admin selain faucet dan gacha; izin dekripsi (ACL) seminimal mungkin; tidak ada percabangan atau revert yang bergantung pada nilai terenkripsi; bukti dekripsi diverifikasi onchain dan tidak bisa diputar ulang; proyek belum diaudit |
| Keandalan | State match bisa dilanjutkan setelah refresh atau disconnect; timeout mencegah match macet |
| Aksesibilitas | Kontras cukup; navigasi keyboard; teks alternatif kartu; suit dibedakan dengan ikon dan nama (bukan warna saja); opsi kurangi animasi |
| Kompatibilitas | Browser desktop dan mobile modern; wallet populer |
| Kualitas kode | Modul terpisah, NatSpec, linter, CI menjalankan tes |
| Dokumentasi | README lengkap dan ADR singkat untuk keputusan teknis |
| Legal dan privasi | Token tanpa nilai; tidak ada klaim hadiah uang; tidak mengumpulkan data pribadi; catatan risiko loot box di dokumentasi |

## 10. Spesifikasi aturan game (draft, perlu playtest)

Katalog MVP: 20 kartu.

| Rarity | Jumlah | Power dasar | Cost | Odds gacha |
| --- | --- | --- | --- | --- |
| Common | 8 (2 per suit) | 2 | 1 | 60% |
| Rare | 4 (1 per suit) | 3 | 2 | 25% |
| Epic | 4 (1 per suit) | 4 | 3 | 12% |
| Legendary (Major Arcana) | 4 | 5 | 4 | 3% |

Aturan duel:

- Deck 5 kartu Unsealed; total cost 12 atau kurang; maksimal 2 salinan per definisi.
- Tangan 3 kartu diacak onchain dari deck.
- 3 ronde; menang 2 ronde berarti menang match. Pool energi 6, dibagi bebas lintas ronde.
- Power ronde = power dasar + energi yang dialokasikan + bonus suit (+1 jika suit menang) + orientasi (+1 upright, −1 reversed).
- Siklus suit: Wands > Swords > Pentacles > Cups > Wands.
- Orientasi diacak terenkripsi saat kartu masuk tangan (tarot flip) dan tetap rahasia sampai ronde berakhir.
- Seri ronde berarti tidak ada poin. Imbang setelah 3 ronde berarti match seri.
- Timeout commit: 5 menit (konfigurasi); 2 menit untuk demo.
- Kebocoran yang diakui: hasil ronde mengungkap sebagian informasi tentang kartu yang dimainkan. Ini menjadi bagian permainan (deduksi).

## 11. Desain konfidensialitas dan ACL

| Data | Tipe | Boleh didekripsi | Kapan publik |
| --- | --- | --- | --- |
| Identitas kartu hasil gacha | euint8 | Pemilik | Setelah Unseal |
| Pity counter | euint8 | Pemilik | Tidak pernah |
| Saldo FateToken (ERC-7984) | euint64 | Pemilik | Tidak pernah |
| Urutan dan isi tangan | euint8 per slot | Pemilik | Tidak pernah (opsional saat replay) |
| Slot kartu dan energi yang dikirim | euint8 | Pemilik | Tidak pernah (opsional saat replay) |
| Orientasi kartu | ebool | Pemilik | Tidak pernah (opsional saat replay) |
| Sisa energi | euint8 | Pemilik | Tidak pernah |
| Pemenang ronde dan match | Plaintext lewat dekripsi publik | Semua | Setelah ronde |

Aturan ACL:

- Beri izin dekripsi hanya kepada pemilik data dan kontrak yang membutuhkan.
- Kartu tersegel tidak bisa ditransfer, karena izin pemilik lama tidak bisa dicabut. Kartu harus di-Unseal dulu.
- Input tak sah di-clamp dengan select, tidak pernah revert, agar kegagalan tidak membocorkan nilai.

## 12. Arsitektur teknis

Stack: Solidity dan Hardhat (template FHEVM resmi); OpenZeppelin Confidential Contracts untuk ERC-7984; ERC-721 standar untuk kartu; frontend React atau Next.js dengan Zama SDK (@zama-fhe/sdk dan @zama-fhe/react-sdk, bukan Relayer SDK yang sudah tidak dipelihara sejak 6 November 2026) serta wagmi atau viem; hosting statis; CI dengan GitHub Actions. Nama API final mengikuti dokumentasi FHEVM v0.13.

Modul kontrak: FateToken (ERC-7984), CardCatalog, ArcanaCards (ERC-721 dengan status Sealed dan Unsealed), TarotGacha, DuelEngine, StakeEscrow, Market (swap). Tiap modul punya antarmuka sendiri.

Modul frontend: Wallet dan sesi dekripsi, Ritual Gacha, Koleksi, Deck Builder, Lobby dan Ruang Duel, Pasar, Verify.

Alur gacha: bayar dengan FateToken, kontrak membuat acak terenkripsi (rarity dari ambang pada random 8-bit, lalu kartu dalam tier), kartu tersegel di-mint, pemilik mendekripsi untuk melihat, lalu Unseal lewat dekripsi publik.

Alur ronde duel: kedua pemain mengirim input terenkripsi dengan bukti, kontrak memilih stat kartu dan menghitung hasil, hasil dibuat dapat didekripsi publik, lalu siapa pun memfinalisasi dengan bukti dekripsi.

Keputusan teknis yang harus dibuktikan lewat prototipe:

| ID | Isu | Rekomendasi | Cadangan |
| --- | --- | --- | --- |
| TD-1 | Transfer konfidensial umumnya tidak revert saat saldo kurang, dan mint NFT tidak bisa bersyarat pada nilai terenkripsi | Alur 2 langkah: bayar, flag “pembayaran cukup” dibuat dapat didekripsi publik, lalu klaim mint dengan bukti | Mint kartu Blank non-transferable bila gagal (risiko spam) |
| TD-2 | Tangan 3 dari 5 tanpa pengulangan | Permutasi terenkripsi dengan beberapa swap bersyarat; ukur HCU | Tangan berisi seluruh 5 kartu, acak hanya pada orientasi |
| TD-3 | Stat dengan indeks terenkripsi | Decklist publik sehingga stat 5 slot publik; pilih lewat select berantai | Tidak ada |
| TD-4 | Hasil ronde publik | Dekripsi publik dengan finalisasi oleh siapa pun | Tombol finalisasi manual di UI |
| TD-5 | Latensi dekripsi | Status progres dan animasi ritual menutupi waktu tunggu | Prefetch dan polling |

## 13. Model data dan event

- CardDef: id, suit, arcana, rarity, cost, power, abilityId (publik, di katalog).
- CardInstance: tokenId, sealed (bool), defId plaintext (kosong sebelum Unseal), sealedDefId terenkripsi.
- Match: playerA, playerB, mode, state, deck A dan B (5 tokenId publik), ronde aktif, skor, tenggat, sisa energi terenkripsi, tangan terenkripsi.
- RoundCommit: slot terenkripsi, energi terenkripsi, committed (bool).
- Event: CardDrawn, CardUnsealed, MatchCreated, MatchJoined, RoundCommitted, RoundResolved, MatchFinished, StakeLocked, StakeSettled, SwapCreated, SwapAccepted.

## 14. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| HCU melebihi batas | Transaksi gagal | Ukur sejak M1; pecah transaksi; siapkan aturan cadangan (TD-2) |
| Latensi dekripsi | UX terasa lambat | Status progres, ritual animasi, polling |
| Scope creep | Proyek tidak selesai | MoSCoW, freeze 8 Desember, urutan pemotongan |
| Testnet atau relayer bermasalah saat demo | Demo gagal | Video cadangan, skrip E2E, cek status sebelum demo |
| Tidak ada lawan saat penilaian | Fungsionalitas tak terbukti | Mode Latihan, panduan dua wallet, video |
| Griefing dan pemain menghilang | Match macet | Timeout dan forfeit |
| Kebocoran informasi tak sengaja | Klaim konfidensialitas lemah | Review ACL, tabel kebocoran jujur, tes |
| Regulasi loot box dan judi | Risiko reputasi | Token tanpa nilai, flag Stake, disclaimer |
| Lisensi art dan IP | Masalah legal | Art orisinal atau berlisensi jelas; tidak meniru IP lain |
| Perubahan API FHEVM atau SDK | Build rusak | Pin versi, tes ulang setelah update |
| Aturan nama atau disclaimer terlewat | Tidak layak hadiah | Checklist final |
| Submit hanya sekali | Kesalahan fatal | Dry run dan submit lebih awal |

## 15. Rencana pengujian dan definition of done

| Level | Cakupan |
| --- | --- |
| Unit (Hardhat dengan mock FHEVM) | Gacha, Unseal, deck rules, resolusi ronde, clamp energi, escrow, swap |
| Integrasi | Satu match penuh dengan dua pemain, timeout, seri, Stake |
| E2E di Sepolia | Skrip alur penuh yang dijalankan berulang (target 10 dari 10) |
| Keamanan | Reentrancy, kontrol akses, replay bukti dekripsi, ACL tidak terlalu longgar |
| Manual | Uji coba 3 orang baru, perangkat mobile, wallet berbeda |

Definition of done MVP:

- Semua fitur Must selesai dan lulus tes.
- Alur penuh berjalan di Sepolia pada demo yang dihosting.
- README, disclaimer, dan tabel enkripsi lengkap.
- Video, thread X, dan formulir siap.

## 16. Roadmap dan milestone

| Milestone | Tanggal | Target | Kriteria keluar |
| --- | --- | --- | --- |
| M1 | 10–16 Nov | Setup repo dari template, deploy awal, vertical slice 1 ronde (commit, resolve, dekripsi) | Tes lulus, 1 ronde di Sepolia, anggaran HCU tercatat |
| M2 | 17–23 Nov | FateToken, ArcanaCards, TarotGacha Single, Unseal | TD-1 terselesaikan, gacha berjalan di Sepolia |
| M3 | 24–30 Nov | Deck builder, duel 3 ronde, timeout, lobby, frontend duel, Mode Latihan | Match penuh dimainkan di Sepolia |
| M4 | 1–7 Des | Stake Ante, swap, Three-Card, pity, Verify, polish ritual | Semua fitur Should yang dipilih selesai |
| M5 | 8–12 Des | Freeze fitur 8 Des; tes penuh, README, video, thread, dry run, submit 12 Des | Paket submission lengkap |

Cadangan: 13–14 Desember hanya untuk perbaikan darurat, bukan fitur baru. Urutan pemotongan jika waktu mepet: Stake, swap, Three-Card, pity, lalu kekayaan halaman Verify. Jangan dipotong: gacha tersegel, duel tersembunyi, Verify minimal, README, dan video.

Setelah submission: booster pack, Celtic Cross, trading kartu tersegel dan izin intip, marketplace, Vault, High Stakes, cooldown, rating dan matchmaking, season dan set baru.

## 17. Paket submission

Outline README:

1. Ringkasan dan disclaimer wajib.
2. Mengapa harus terenkripsi (tabel bagian 11, termasuk kebocoran yang diakui).
3. Arsitektur dan alamat kontrak Sepolia.
4. Cara bermain dan cara menjalankan lokal.
5. Anggaran HCU, batasan, dan keputusan teknis.
6. Pengujian dan cara memverifikasi gacha serta match.
7. Roadmap.

Alur video 3 menit (pitch langsung oleh orang sungguhan): 0:00 masalah gacha dan kartu onchain yang bisa diintip; 0:30 ritual gacha dan Unseal; 1:15 satu match dengan keputusan bluff; 2:15 apa yang terenkripsi dan mengapa; 2:40 taruhan dan trading; 2:55 penutup.

Thread X (6 posting): hook masalah; solusi; gacha tersegel; duel bluff; bagaimana kerahasiaan dan fairness diverifikasi; tautan demo, repo, dan video.

Checklist akhir:

- Repo kontrak dan frontend, demo di website.
- README dan disclaimer di app dan README.
- Video 3 menit tanpa video atau suara AI.
- Thread atau artikel di X.
- Nama proyek tanpa kata “Zama”.
- Email formulir sama dengan email API key; submit hanya sekali.

## 18. Asumsi dan keputusan terbuka

Asumsi: tim kecil (1–2 orang); jika bekerja sendiri, ikuti urutan pemotongan di bagian 16. Angka balance di bagian 10 adalah draft awal.

Keputusan terbuka:

1. Nama final proyek.
2. Token gacha: FateToken sendiri atau cUSDT dari registry testnet.
3. Apakah Stake masuk submission atau menjadi fase 2.
4. Apakah booster pack masuk MVP.
5. Sumber art dan lisensinya.
6. Rumus power, efek orientasi, dan siklus suit setelah playtest.
7. Mekanisme tangan (TD-2) setelah pengukuran HCU.

## 19. Referensi

- Halaman program: https://www.zama.org/post/zama-developer-program-mainnet-season-5-confidential-gaming
- Formulir submission: https://forms.zama.org/zama-developer-program-mainnet-season-5-confidential-gaming
- Dokumentasi protokol: https://docs.zama.org/protocol
- Quick Start Tutorial: https://docs.zama.org/protocol/solidity-guides/getting-started/quick-start-tutorial
- Angka acak terenkripsi: https://docs.zama.org/protocol/solidity-guides/smart-contract/operations/random
- Template Hardhat FHEVM: https://github.com/zama-ai/fhevm-hardhat-template
- OpenZeppelin Confidential Contracts: https://github.com/OpenZeppelin/openzeppelin-confidential-contracts
- Contoh FHEVM: https://docs.zama.org/protocol/examples/
- Registry token konfidensial testnet: https://docs.zama.org/protocol/protocol-apps/addresses/testnet/sepolia
- Panduan HCU: https://docs.zama.org/protocol/solidity-guides/development-guide/hcu
