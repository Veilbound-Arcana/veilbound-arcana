# Veilbound Arcana — Original Mobile Collectible-Card Game

> **Attribution & Disclaimer:** *Veilbound Arcana is an original game and is not affiliated with any other trading-card game. This project is not audited, endorsed, or operated by any third party. Use at your own risk.*

**Veilbound Arcana** is an original mobile collectible-card game (CCG) front-end built with React 18, TypeScript, Tailwind CSS, Framer Motion, and WebAudio. Reality is a thin Veil: players are Wardens who bind astral spirits (Veilborn) into Arcana cards and duel in strategic, fast-paced duels.

---

## 1. Core Architecture & Design Pillars

- **Two Layers:**
  - **Structure Layer:** Replicates the interaction grammar, 390×844 mobile viewport ergonomics, card stack gestures, 3D coverflow carousel, and 3-column collection chronicle of top-tier mobile CCGs.
  - **Identity Layer:** 100% original lore, names, typography, procedural art, WebAudio synthesizer, and game rules.
- **Eight Original Aspects:**
  - Interlocking Ring 1: **Ember** (weak to Tide) → **Tide** (weak to Volt) → **Volt** (weak to Iron) → **Iron** (weak to Ember).
  - Interlocking Ring 2: **Verdant** (weak to Umbra) → **Umbra** (weak to Lumen) → **Lumen** (weak to Aether) → **Aether** (weak to Verdant).
  - Matches cross-ring are neutral; weakness confers `+20` damage.
- **Rarity Ladder:** Custom geometric glyphs:
  - **Rune I–IV** (Common to Uncommon) — Clean sacred geometry, rune marks, and calibrated basic abilities.
  - **Moon I–III** (Rare, Foil shader) — Radiant celestial stardust, reactive dynamic light sheen (`--mx`, `--my`), and stage evolution powers.
  - **Veil** (Crowned Full-Art Immersive) — Crowned full-art frames, animated rotating mandala halos, particle corona, dynamic rainbow foil reflection, and game-altering abilities.
- **100 NFT Card Archetypes & Cosmic Lore:**
  - **12 Canonical Showcase Cards** (`c-001`–`c-012`): Calibration anchors for battle engine tests and starter decks.
  - **22 Major Arcana Spirits** (`c-013`–`c-034`): Archetypes inspired by Tarot Major Arcana (The Magician, High Priestess, Wheel of Fortune, Chronos/Death, Astral Star, Judgement, The Universe).
  - **66 Minor Arcana & Astrological Spirits** (`c-035`–`c-100`): Astrological houses, constellations, and elemental arcana (Wands, Cups, Swords, Pentacles translated into Ember, Tide, Volt, and Iron).
  - Every card features calibrated **HP** (50–240), **Power** (20–180), **Aspect affinities**, **Unique Skill Trees**, and **Expanded Lore**.
- **Deterministic Math:** Every draw and combat event is driven by a seeded 32-bit PRNG (`mulberry32` in `src/game/rng.ts`).
- **Zero Third-Party Assets:**
  - 100% original procedural SVG character art via `src/art/character/characterEngine.ts` (10 classes x 5 poses, seeded by card id; static files in `frontend/public/cards/art/`).
  - 100% procedural sound effects via WebAudio API (`SoundEngine` in `src/fx/audio.ts`).

---

## 2. Complete Screen Index (S00 – S17)

| Route | ID | Screen Name | Key Features & Interaction |
| :--- | :---: | :--- | :--- |
| `#/` | **S02** | **Home Sanctuary** | 3D pack coverflow carousel with mirrored reflections, Vigil Candle timer, quick links to Vigils & Omen Draw. |
| `#/splash` | **S01** | **Splash Loading** | Radial pulsing rings with original wisp-moth mascot, Cinzel wordmark with vertical light slit, asset readiness bar. |
| `#/tutorial` | **S00** | **Rite of Initiation** | 7-step guided onboarding ritual: story intro, warden naming ceremony, first pack tear, archive tour, and battle trial. |
| `#/open` | **S03** | **Pack Ritual** | Sealed vellum envelope with wax seal and silk ribbon; horizontal swipe gesture with 70% detachment cut, noise sweep audio, particle burst. |
| `#/reveal` | **S04** | **Arcana Reveal** | 3D card stack; swipe or tap to flip; tiered sound/haptic feedback (Rune chime, Moon arpeggio, Veil choir swell); NEW tags; skip button. |
| `#/summary` | **S05** | **Pack Summary** | Staggered 90ms card entrance grid; tap to inspect card; "Open Another" candle check and "Done" navigation. |
| `#/archive` | **S06** | **Sacred Archive** | 3-column collection grid with Aspect filters, owned-only toggle, search by name, Folio & Shrine tool tiles, floating jump-to-top button. |
| `#/card/:id` | **S07** | **Card Detail** | 3D card tilt with holographic reflection (`--mx`, `--my`), swipe between cards, full abilities & retreat costs, full-screen Veil Immersive View. |
| `#/sets` | **S08** | **Set Folio** | Sets V1, V2, V3 switcher; completion ring; 1–40 numbered silhouette grid; milestone claim track at 10, 20, 30, and 40 cards. |
| `#/spreads` | **S09** | **Spreads Builder** | 20-card deck editor; duplicate cap of 2; minimum 1 Basic validator; aspect affinity breakdown bar; card picker drawer. |
| `#/folio` | **S10** | **Folio & Shrine** | Level 5 Folio 9-card binder album; Level 8 Shrine 3-pedestal display altar; slot assignment modals. |
| `#/friends` | **S11** | **Warden Social Hub** | Unique friend code copy button; fictional companion roster (Lyra, Cassian, Rowan, Maeve); tradable counts; trade access. |
| `#/trade` | **S12** | **Arcana Exchange** | Duplicate card offer selector; matching rarity tier enforcement; 100 Echoes ritual fee; 1.5s simulated partner agreement animation. |
| `#/battle` | **S13** | **Arena Lobby** | Mode selector (Solo Trial with Bot, Versus Duel, Ranked Rite); active Spread validation check; duel rules summary. |
| `#/matchmaking`| **S14** | **Matchmaking Radar**| Concentric pulsing circles with wisp-moth mascot; elapsed timer; opponent reveal fanfare transition. |
| `#/duel` | **S15** | **Battle Board** | Vertical mobile arena; Player Active & Bench (up to 3); Aether well channel button; hand fan; ability attack modal; floating damage pop; KO glass shatter; 3-point victory banner. |
| `#/settings` | **S16** | **Sanctuary Settings**| Music & SFX volume sliders; Mute toggle; Reduce Motion accessibility switch; EN/ID language switcher; legal disclaimer; profile reset. |
| `#/shop` | **S17** | **Sanctuary Shop** | Vigil Candle refresh for 50 Shards; 1/5/10 pack bundles; Echoes exchange; daily free shard tribute; Mulberry32 drop rate disclosure sheet. |

---

## 3. Technology Stack & Verification Gates

- **Framework:** React 18.3.1 (`react`, `react-dom`)
- **Bundler:** Vite 5.2.11
- **State Management:** Zustand 4.5.2 with localStorage persistence (`veilbound.save.v1`)
- **Router:** React Router DOM 6.23.1 (`HashRouter`)
- **Animations & Gestures:** Framer Motion 11.2.10
- **Icons:** Lucide React 0.383.0
- **Styling:** Tailwind CSS 3.4.3 + CSS Variables tokens (`tokens.css`)
- **Unit Testing:** Vitest 1.6.0 (8 tests covering rules, weakness, deck validation, and turns)
- **Total Runtime Dependencies:** 6 (well below the 12-dependency hard limit)

---

## 4. Quickstart Guide

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation & Execution
```bash
# Navigate to frontend workspace
cd frontend

# Install pinned dependencies
npm install --legacy-peer-deps

# 1. Run IP Guard Scanner (Verifies zero forbidden terms)
npm run guard

# 2. Run Pure TypeScript Rules Engine Tests
npm run test

# 3. Type-check Codebase
npm run lint

# 4. Build Optimized Production Bundle
npm run build

# 5. Launch Local Dev Server (Port 3000)
npm run dev
```

---

## 5. Owner Pre-Release Checklist

Before releasing to production or public distribution, complete the following steps:

- [ ] **Trademark Clearance:** Conduct trademark searches for the game name `Veilbound Arcana` across relevant jurisdictions (e.g. WIPO Global Brand Database and Indonesian DJKI).
- [ ] **IP-Guard Verification:** Ensure `npm run guard` passes cleanly with 0 violations in automated CI builds.
- [ ] **Visual Audit:** Conduct a Squint Test on all screens at 320px with blurred text as documented in `ORIGINALITY.md`.
- [ ] **Sound Asset Review:** Verify that all acoustic feedback originates strictly from `src/fx/audio.ts` with no external samples.
- [ ] **Dependency Audit:** Verify that total runtime dependencies remain pinned and strictly $\le 12$.
