# 📝 Progress Log — Veilbound Arcana

Dokumen log ini bersifat **append-only**. Setiap sesi kerja wajib mencatat pencapaian, kendala, dan bukti transaksi/tes.

---

## 2026-11-10 07:15 UTC (Setup Polyrepo & Vault)
- **Done:**
  - Inisialisasi GitHub Organization `https://github.com/Veilbound-Arcana` dengan 7 repositori:
    - `veilbound-arcana` (Umbrella meta-repo)
    - `contracts` (Solidity FHEVM v0.13)
    - `backend` (WebSocket lobby & Practice Bot FR-20)
    - `frontend` (Next.js & Zama React SDK)
    - `sdk` (@veilbound/sdk)
    - `scripts` (deployer, HCU profiler, demo replay)
    - `veilbound-vault` (Obsidian Central Knowledge Base)
  - Pembagian job dan kompensasi resmi (Arya 70%, Yavin 15%, Adrian 15%) terdokumentasi di [[09 Backlog & Tim/Arcana - Pembagian Tim & Kompensasi (70 Arya, 15 Yavin, 15 Adrian)]].
  - 20 file metadata JSON kartu Tarot ERC-721 dibuat dan diunggah ke `assets/metadata/` dan `frontend/public/cards/metadata/`.
  - Simulasi taktis duel CLI (`scripts/simulate-match.mjs`) memvalidasi siklus elemental Wands > Swords > Pentacles > Cups > Wands dan aturan zero-revert clamp.
  - Setup CI workflow `.github/workflows/ci.yml` untuk automated test and replay check.
- **Evidence:**
  - Replay test lulus: `npm run demo:replay` (Output 5/5 valid).
  - Claims check lulus: `npm run verify:thesis` (Output 4/4 claims verified).
  - Git commit hash lokal: `04c5f8e` (polyrepo initial) & `b95c125` (assets & CI).
- **Decisions:**
  - Seluruh smart contract FHEVM menggunakan Zama FHEVM v0.13 dan OpenZeppelin Confidential Contracts.
  - Alur gacha menggunakan pola 2-langkah (bayar & roll tersegel, unseal melalui publikasi dekripsi terverifikasi).
- **Next Steps:**
  - Selesaikan kompilasi Hardhat dan unit test FHE mock untuk M1-04 dan M1-05.
