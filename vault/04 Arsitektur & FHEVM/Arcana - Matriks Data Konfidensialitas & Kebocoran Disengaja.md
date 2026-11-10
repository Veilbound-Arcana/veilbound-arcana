# 🛡️ Matriks Data Konfidensialitas & Kebocoran Disengaja

## 1. Matriks Aksesibilitas Data
| Data | Tipe FHEVM | Boleh Didekripsi | Publikasi | Alasan Desain |
| :--- | :---: | :---: | :---: | :--- |
| **Identitas Gacha (Pre-Unseal)** | `euint8` | Pemilik Kartu | Setelah Unseal | Menghindari bot front-running & sniffing |
| **Pity Counter** | `euint8` | Pemilik Kartu | Tidak Pernah | Mencegah eksploitasi ritme drop |
| **Saldo FateToken** | `euint64` | Pemilik Token | Tidak Pernah | Melindungi privasi kekayaan pemain |
| **Tangan 3 Kartu** | `euint8` | Pemain Terkait | Replay Opsional | Fondasi bluffing taktis |
| **Komitmen Slot Kartu** | `euint8` | Pemain Terkait | Replay Opsional | Menghilangkan second-mover advantage |
| **Alokasi Energi Ronde** | `euint8` | Pemain Terkait | Replay Opsional | Menghindari outbidding instan |
| **Pemenang Ronde** | Plaintext | Semua Orang | Setiap Akhir Ronde | Dasar konsensus pertandingan |
| **Pemenang Match** | Plaintext | Semua Orang | Akhir Match | Verifikasi hasil pertandingan |

## 2. Kebocoran yang Disengaja (Intentional Information Leakage)
Pengumuman pemenang ronde secara publik membocorkan selisih power parsial. Pemain dapat mendeduksi kartu lawan berdasarkan selisih power dan riwayat suit. Hal ini merupakan mekanik deduktif yang disengaja.
