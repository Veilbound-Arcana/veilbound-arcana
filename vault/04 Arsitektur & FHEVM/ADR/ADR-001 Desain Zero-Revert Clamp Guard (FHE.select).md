# ADR-001: Desain Zero-Revert Clamp Guard via FHE.select

## Status
**Accepted & Enforced**

## Konteks
Pada smart contract EVM konvensional, transaksi yang menerima parameter tidak sah (seperti pemain menawar energi melebihi sisa energi yang dimiliki, atau memilih slot kartu yang tidak ada di tangan) biasanya akan memicu `revert("Invalid energy bid")`.

Namun, pada Zama FHEVM, nilai energi dan slot kartu berada dalam bentuk ciphertext (`euint8`). Jika smart contract melakukan `require()` atau percabangan `revert` berdasarkan nilai terenkripsi:
1. **Revert membocorkan informasi rahasia:** Pengamat blok explorer dapat melakukan binary search untuk menebak nilai rahasia berdasarkan transaksi mana yang sukses dan mana yang gagal.
2. **HCU & Execution Hazard:** FHEVM tidak mengizinkan percabangan kondisional publik berdasarkan ciphertext tanpa dekripsi terlebih dahulu.

## Keputusan
Kami mengimplementasikan **Zero-Revert Clamp Guard**:
- Smart contract tidak pernah me-revert transaksi ronde karena nilai tawaran energi yang tidak valid.
- Jika pemain mengirimkan tawaran energi terenkripsi $E_{\text{bid}}$ yang lebih besar daripada sisa energi pemain $E_{\text{rem}}$, kontrak secara homomorfik menggunakan `FHE.select`:
  ```solidity
  ebool isExceeded = FHE.gt(encryptedBid, encryptedRemaining);
  euint8 effectiveEnergy = FHE.select(isExceeded, encryptedRemaining, encryptedBid);
  ```
- Nilai efektif yang digunakan dalam pertarungan di-clamp secara otomatis dan senyap ke nilai sah tertinggi.

## Konsekuensi
- **Positif:** 100% aman dari eksploitasi kebocoran informasi melalui revert transaksi di block explorer.
- **Positif:** Pengalaman pengguna tidak terganggu oleh kegagalan transaksi yang membuang gas.
- **Negatif:** Menambah sedikit konsumsi HCU per ronde (sekitar 320.000 HCU untuk komparasi `FHE.gt` dan operasi `FHE.select`), namun tetap sangat jauh di bawah batas 20M HCU Sepolia.
