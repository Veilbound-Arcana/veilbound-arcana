# ADR-002: Alur 2-Langkah Gacha (Bayar, Encrypted Draw, Unseal)

## Status
**Accepted**

## Konteks
Tantangan teknis TD-1 pada PRD menyebutkan: Transfer token konfidensial (ERC-7984) tidak revert saat saldo kurang dalam komputasi terenkripsi, dan pencetakan NFT ERC-721 publik tidak dapat langsung bersyarat pada ciphertext boolean tanpa membuka hasil ke publik. Selain itu, menggabungkan pembayaran, undian acak FHE, dan mint NFT dalam satu transaksi dapat melampaui batas HCU atau gas blok.

## Keputusan
Kami memisahkan siklus hidup penarikan gacha menjadi 2 langkah terpisah:
1. **Langkah 1: Draw (Penarikan Tersegel):**
   - Pemain memanggil `TarotGacha.drawSingle()`.
   - Kontrak memotong biaya 1 $FATE.
   - Kontrak menghasilkan angka acak terenkripsi on-chain `FHE.randEuint8()` dan menentukan identitas kartu.
   - Kontrak mencetak NFT `ArcanaCards` dengan status `isSealed = true` dan ciphertext `sealedDefId`.
   - Izin dekripsi (`FHE.allow`) hanya diberikan kepada pemilik NFT.
2. **Langkah 2: Unseal (Pembukaan Kartu):**
   - Pemain menandatangani sesi dekripsi satu kali di frontend untuk melihat kartu membalik (3D tarot flip).
   - Pemain menekan tombol **Unseal** untuk mempublikasikan bukti dekripsi on-chain.
   - Kontrak mengubah `isSealed = false` dan menyimpan `defId` plaintext di katalog.
   - Kartu sekarang resmi aktif untuk masuk ke dalam deck 5 kartu atau ditransfer/dipertaruhkan.

## Konsekuensi
- Memastikan batas HCU per transaksi tetap rendah (< 2.000.000 HCU).
- Mencegah bot mengintip isi kartu sebelum memutuskan membatalkan transaksi.
- Memenuhi standar kepatuhan trading NFT ERC-721 konvensional.
