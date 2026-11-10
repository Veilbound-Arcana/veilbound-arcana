# Veilbound Arcana — Game Design Document v1

Draf v1 · 10 November 2026 · Judul kerja (bisa diganti, tanpa kata “Zama”) · Tenggat submission: 14 Desember 2026, 23.59 AOE

## 1. Ringkasan

Veilbound Arcana adalah game kartu koleksi (TCG) bertema tarot di Sepolia. Pemain menarik kartu NFT lewat gacha “tarot spread” yang hasilnya tersegel (terenkripsi) sampai pemilik membukanya, menyusun deck dari koleksi, lalu bertarung dalam duel 3 ronde di mana tangan, kartu pilihan, dan alokasi energi tetap rahasia. Ada mode taruhan opsional: pemenang merebut 1 kartu lawan.

Pilar desain:

1. Koleksi nyata: setiap kartu adalah NFT yang bisa disimpan, ditukar, dan dipertaruhkan.
2. Ritual gacha yang adil: hasil terenkripsi dan acak onchain, sehingga tidak bisa di-snipe atau dibatalkan bot saat hasilnya jelek.
3. Duel bluff: yang diadu bukan hanya angka, tetapi tebakan atas pilihan lawan.
4. Taruhan yang aman dan opsional: satu kartu per pertarungan, dengan pengaman.
5. Modular: kategori, set, spread, dan mode bisa ditambah tanpa menulis ulang inti.

Disclaimer wajib (di aplikasi dan README): “This project is not audited, endorsed or operated by Zama. Use at your own risk.”

## 2. Apa yang terenkripsi dan mengapa penting

| Data | Status | Siapa yang bisa melihat | Jika publik, apa yang rusak |
| --- | --- | --- | --- |
| Hasil gacha sebelum Unseal | Terenkripsi | Pemilik | Bot bisa membatalkan transaksi bila hasil jelek atau menarget kartu langka |
| Pity counter | Terenkripsi | Pemilik | Pola penarikan pemain bisa dieksploitasi |
| Saldo dan pembayaran token (ERC-7984) | Terenkripsi | Pemilik | Pelacakan “whale” dan pola belanja |
| Tangan dan urutan tarik | Terenkripsi | Pemilik | Lawan tahu semua opsi Anda, tidak ada bluff |
| Kartu pilihan tiap ronde | Terenkripsi | Pemilik | Pemain yang bergerak belakangan selalu diuntungkan |
| Alokasi energi | Terenkripsi | Pemilik | Lawan tinggal menawar sedikit di atasnya |
| Orientasi kartu (upright/reversed) | Terenkripsi | Pemilik | Lawan tahu efek kartu sebelum dimainkan |
| Kepemilikan NFT | Publik | Semua | Perlu untuk trading dan escrow |
| Identitas kartu setelah Unseal | Publik | Semua | Perlu agar kartu bisa diperdagangkan |
| Decklist yang dikunci | Publik | Semua | Dipilih agar validasi murah |
| Hasil tiap ronde | Publik | Semua | Dasar kemenangan yang bisa diverifikasi |

Kebocoran yang disengaja: hasil ronde dan selisih power membocorkan sebagian informasi tentang kartu yang dimainkan. Ini dijadikan bagian permainan (deduksi), bukan klaim kerahasiaan mutlak. Dokumentasikan secara jujur di README.

## 3. Kartu dan kategori

Struktur kategori (semua bisa ditambah):

| Dimensi | Nilai awal | Cara memperluas |
| --- | --- | --- |
| Suit | Wands, Cups, Swords, Pentacles | Tambah suit baru beserta aturan keunggulan |
| Arcana | Major (langka), Minor | Tambah tipe Court atau Event |
| Rarity | Common, Rare, Epic, Legendary | Tambah tier atau variasi kosmetik |
| Set / Season | Season 1 | Set baru memakai katalog baru, kontrak sama |
| Edition | Standard | Foil, edisi acara |

Katalog MVP: sekitar 20 kartu (4 suit × 4 kartu Minor + 4 kartu Major). Tiap definisi kartu memuat id, nama, suit, arcana, rarity, cost, power, dan ability id. Stat dikodekan ringkas agar murah dihitung.

Model data:

- CardDefinition (publik, di katalog): data tetap sebuah kartu.
- CardInstance (NFT ERC-721): tokenId menunjuk ke definisi kartu. Status Sealed (identitas terenkripsi) atau Unsealed (identitas publik).

Siklus hidup kartu: Draw (tersegel) → Unseal (pemilik membuka, identitas jadi publik) → dipakai di deck, ditukar, atau dipertaruhkan.

## 4. Gacha “Tarot Spread”

- Spread: Single (1 kartu) dan Three-Card (3 kartu: Past, Present, Future). Fase 2: Celtic Cross dan booster pack 5 kartu.
- Pembayaran: token ERC-7984 bernama kerja “Fate Shard”, dengan faucet gratis (free daily reading) untuk onboarding. Opsi lain: cUSDT dari registry testnet.
- Acak: tiap kartu memakai random terenkripsi onchain; ambang rarity dan odds publik di kontrak.
- Pity meter: terenkripsi per pemain, memberi jaminan rarity setelah N tarikan tanpa kartu langka.
- Pengalaman: pemain memilih kartu face-down, menandatangani sesi dekripsi sekali, lalu kartu membalik satu per satu. Tombol Unseal membuat identitas kartu publik agar bisa dipakai.
- Verifikasi: halaman Verify menampilkan transaksi tarikan, odds kontrak, dan bukti hasil.

## 5. Duel (match)

Aturan inti MVP:

- Deck 5 kartu Unsealed dari koleksi; decklist dikunci saat match dimulai.
- Tangan 3 kartu diacak onchain dari deck.
- 3 ronde; menang 2 ronde berarti menang match.
- Tiap ronde, kedua pemain meng-commit terenkripsi: satu kartu dari tangan dan alokasi energi dari pool 6 energi yang dibagi lintas ronde.
- Resolusi: power = power dasar + energi yang dialokasikan + bonus suit ± efek orientasi. Power lebih tinggi menang ronde; seri berarti tidak ada poin.
- Tarot flip: tiap kartu yang masuk tangan mendapat orientasi acak terenkripsi (upright atau reversed). Angka efeknya masih draft dan perlu playtest.
- Keunggulan suit (draft): Wands > Swords > Pentacles > Cups > Wands.
- Prinsip enkripsi: input tak sah (misalnya energi melebihi sisa) tidak boleh revert karena revert membocorkan informasi; nilainya di-clamp ke nilai sah.
- Timeout: ada batas waktu commit per ronde; jika lawan tidak commit, pemain boleh klaim menang.
- Yang dibuka publik: pemenang tiap ronde dan pemenang match. Replay opsional: kedua pemain sepakat membuka isi ronde setelah match.

Mode:

- Friendly (default): tanpa taruhan kartu.
- Stake: lihat bagian 6.

## 6. Mode Taruhan (Stake Duel)

Aturan MVP (Varian A, “Ante”):

1. Kedua pemain setuju dan menyetor 1 NFT Unsealed ke escrow sebelum match.
2. Pemenang menerima kartu lawan; kartu pemenang dikembalikan.
3. Seri: kedua kartu dikembalikan.
4. Lawan tidak hadir (timeout): kartunya jatuh ke pemenang.
5. Batas: 1 NFT per pertarungan.

Alasan kartu taruhan dipilih sebelum match, bukan setelah kalah: jika dipilih setelah kalah, pemain akan menyerahkan kartu terburuknya; jika dipilih pemenang dari koleksi lawan, rawan griefing.

Pengaman:

| Risiko | Pengaman |
| --- | --- |
| Kartu murah melawan kartu langka | Tier matching: selisih rarity maksimal 1 tier |
| Pemain kuat memburu pemula (smurfing) | Matchmaking berdasarkan rating (fase 2); di MVP cukup tier matching |
| Kehilangan kartu favorit | Vault slot: kartu yang ditandai tidak bisa dijadikan taruhan (fase 2) |
| Kalah beruntun | Cooldown setelah kehilangan kartu (fase 2) |
| Lawan menghilang | Timeout berarti forfeit |
| Regulasi | Testnet, token tanpa nilai, disclaimer, dan Stake bisa dimatikan lewat satu flag |

Varian B (“High Stakes”, fase 2): pemenang memilih 1 kartu dari decklist lawan yang dikunci. Lebih dramatis tetapi lebih berisiko, jadi wajib disertai Vault slot dan opt-in terpisah.

Catatan regulasi: gacha berbayar bernilai nyata dan taruhan NFT bisa dianggap loot box atau judi di sejumlah yurisdiksi. Untuk submission, gunakan token tes dan perlakukan Stake sebagai mode opsional yang tidak menjadi inti penilaian.

## 7. Trading

- MVP: swap 1-untuk-1 lewat escrow kontrak (buat tawaran, terima, batal).
- Fase 2: pasar dengan harga dalam token terenkripsi, trading kartu tersegel (blind), dan izin intip: pemilik memberi hak dekripsi kepada satu alamat agar calon pembeli bisa melihat isi kartu tersegel sebelum membeli.

## 8. Arsitektur modular

Kontrak (tiap modul punya antarmuka sendiri):

| Modul | Tanggung jawab | Titik ekstensi |
| --- | --- | --- |
| FateToken (ERC-7984) | Mata uang gacha, saldo terenkripsi | Token lain, harga dinamis |
| CardCatalog | Registri definisi kartu | Set baru, suit baru |
| ArcanaCards (ERC-721) | NFT kartu, status Sealed/Unsealed | Edisi, metadata |
| TarotGacha | Spread, harga, pity, acak, mint tersegel | Spread baru, booster |
| Market | Swap dan escrow trading | Pasar dengan harga terenkripsi |
| DuelEngine | State machine match, commit dan resolve tersembunyi | Aturan baru lewat antarmuka rules |
| StakeEscrow | Setoran dan pembayaran taruhan | Varian B, vault, cooldown |

Frontend: Wallet dan sesi dekripsi · Ritual Gacha · Koleksi · Deck Builder · Pasar · Ruang Duel · Verify.

Alur ujung ke ujung: faucet token → gacha (tersegel) → Unseal → susun deck → duel (commit → resolve → dekripsi publik hasil) → opsi Stake → trading.

Catatan teknis:

- Batas komputasi FHE per transaksi (dokumentasi menyebut 20 juta HCU global dan 5 juta HCU depth, angka devnet) serta metering per blok: jaga tiap transaksi ringan dan ukur HCU lewat tes sebelum mengunci aturan duel.
- Gunakan Zama SDK (@zama-fhe/sdk atau react-sdk). Relayer SDK sudah tidak dipelihara sejak 6 November 2026.
- API acak, ACL, dan dekripsi publik: ikuti dokumentasi FHEVM v0.13.
- Tes Hardhat untuk tiap modul; target minimal: gacha, unseal, satu duel penuh, stake escrow.

## 9. Roadmap

MVP sampai 14 Desember:

| Periode | Target |
| --- | --- |
| 10–16 Nov | Vertical slice: 1 ronde commit → resolve → dekripsi di Sepolia, plus tesnya |
| 17–23 Nov | FateToken, ArcanaCards (Sealed/Unseal), TarotGacha single spread |
| 24–30 Nov | Deck builder, duel 3 ronde penuh, timeout, frontend duel |
| 1–7 Des | Mode Friendly dan Stake (Ante), swap trading, frontend gacha, koleksi, Verify |
| 8 Des | Freeze fitur |
| 8–14 Des | Tes, README dan disclaimer, deploy demo, video 3 menit, thread X, submit |

Jika waktu mepet, potong dengan urutan: Stake → trading → Three-Card spread → halaman Verify yang kaya. Jangan dipotong: gacha tersegel, duel tersembunyi, Verify minimal.

Fase 2 (setelah submission): booster pack, Celtic Cross, trading blind dan izin intip, pasar, Vault, High Stakes, cooldown, rating dan matchmaking, season baru.

Fase 3: set dan suit baru, event musiman, mode turnamen, kosmetik.

## 10. Kriteria juri dan bukti

| Kriteria | Bukti dalam proyek |
| --- | --- |
| Gameplay dan UX | Ritual gacha, kartu membalik, ruang duel dengan alur jelas |
| Confidentiality design | Tabel bagian 2, termasuk kebocoran yang diakui jujur |
| Fairness | Acak onchain, odds publik, halaman Verify |
| Functionality | Satu match penuh dari gacha sampai hasil di Sepolia |
| Demo quality | Video 3 menit, pitch langsung oleh orang sungguhan |
| Code quality | Modul terpisah, tes Hardhat, README rapi |

## 11. Checklist submission

- Repo kontrak dan frontend, demo di website.
- README: arsitektur, cara menjalankan, tabel enkripsi, disclaimer wajib.
- Video 3 menit, pitch real-person (tanpa video atau suara AI).
- Thread atau artikel di X.
- Nama proyek tanpa kata “Zama”.
- Email submit sama dengan email API key; submit hanya sekali dan tidak bisa diedit.

Alur video (usulan): 0:00 hook masalah gacha onchain yang bisa di-snipe · 0:30 ritual gacha dan Unseal · 1:15 duel dengan keputusan bluff · 2:15 tabel apa yang terenkripsi dan mengapa · 2:40 taruhan dan trading · 2:55 penutup dan roadmap.

## 12. Keputusan terbuka

1. Nama final.
2. Rumus power, nilai efek orientasi, dan siklus suit perlu playtest.
3. Katalog final dan sumber art (art boleh dibuat dengan AI; yang tidak boleh hanya video dan suara pitch).
4. Token gacha: token sendiri atau cUSDT.
5. Apakah Stake masuk submission atau disimpan sebagai fase 2.
6. Apakah booster pack masuk MVP atau fase 2.
