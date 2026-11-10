# 🤖 Automated Practice Bot Engine (FR-20)

## 1. Latar Belakang & Kebutuhan Hackathon
Salah satu alasan utama submission game Web3 sering gagal dinilai oleh juri hackathon adalah:
> *"Juri membuka demo web, tetapi tidak ada pemain lain yang online untuk diajak bertanding duel 2-player."*

Untuk mengatasi masalah ini secara mutlak, kami merancang **Practice Bot (FR-20)**.

---

## 2. Spesifikasi Teknis Bot
- **Lokasi Kode:** `backend/src/bot/practiceBot.ts`
- **Akun On-Chain:** Bot memiliki private key mandiri di jaringan Sepolia dan didanai token $FATE serta testnet ETH.
- **Logika Deck:** Bot secara otomatis mengunci starter deck seimbang (total cost 6 $\le$ 12):
  - Page of Wands (Cost 1, Power 2)
  - Page of Cups (Cost 1, Power 2)
  - Page of Swords (Cost 1, Power 2)
  - Page of Pentacles (Cost 1, Power 2)
  - Queen of Wands (Cost 2, Power 3)
- **Logika Penawaran Energi:**
  - Ronde 1: Memilih kartu acak di tangan, menawar 1-2 energi.
  - Ronde 2: Menawar 1-2 energi dari sisa pool.
  - Ronde 3: Menawar seluruh sisa energi yang tersisa.
- **Otomatisasi:** Ketika pemain memilih mode "Practice Mode" di frontend, backend menginstruksikan bot untuk menerima match, mengunci deck, dan mengirim commit ronde terenkripsi dalam hitungan detik.
