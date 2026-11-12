# Changelog (CHANGELOG.md)

All notable changes to **Veilbound Arcana** are documented here in conventional commit format across implementation phases P0–P7.

---

### [1.0.0] - 2026-11-12

#### Phase P0: Core Scaffold & Architecture
- `feat(p0)`: Initialize pinned Vite React 18 frontend with TypeScript and Tailwind CSS.
- `feat(p0)`: Implement `scripts/ip-guard.mjs` IP scanner for automated CI verification.
- `feat(p0)`: Configure Section 5 CSS design tokens, Aspect palette, and Cinzel/Nunito typography.
- `feat(p0)`: Configure bilingual i18n hook (`en.json`, `id.json`) and mulberry32 seeded PRNG.

#### Phase P1: Data Models & Deterministic Rules Engine
- `feat(p1)`: Author 12 showcase cards and 108 procedurally generated cards across sets V1, V2, and V3 (120 total).
- `feat(p1)`: Implement pure TypeScript rules engine (`engine.ts`) with 20-card deck validator, dual interlocking Aspect rings, and +20 weakness calculations.
- `feat(p1)`: Author 8 comprehensive Vitest engine unit tests; verified 100% passing.
- `feat(p1)`: Implement WebAudio `SoundEngine` synthesizing seal tears, flips, chimes, arpeggios, and swells.

#### Phase P2: Onboarding, Home, and Unsealing Flow
- `feat(p2)`: Implement `S01Splash` with animated wisp-moth mascot and vertical light slit.
- `feat(p2)`: Implement `S02Home` with 3D coverflow carousel, candle countdown, and Vigils.
- `feat(p2)`: Implement `S03PackOpen` with vellum envelope tear physics and 70% detachment trigger.
- `feat(p2)`: Implement `S04Reveal` with 3D card flips, rarity audio/haptics, and NEW tag badges.
- `feat(p2)`: Implement `S05Summary` with 90ms staggered card reveal and inspection modals.

#### Phase P3: Archive, Card Inspection, and Set Folio
- `feat(p3)`: Implement `S06Archive` 3-column responsive card grid with Aspect filters and jump-to-top.
- `feat(p3)`: Implement `S07CardDetail` with 3D tilt shader, rules text, and Veil Immersive View.
- `feat(p3)`: Implement `S08SetProgress` with 1–40 matrix and milestone reward claim tracks.

#### Phase P4: Spreads Builder & Folio / Shrine Showcase
- `feat(p4)`: Implement `S09Spreads` 20-card builder with duplicate caps, aspect affinity, and deck rename.
- `feat(p4)`: Implement `S10FolioShrine` with Level 5 9-card binder and Level 8 3D pedestal altar.

#### Phase P5: Social Hub & Arcana Exchange
- `feat(p5)`: Implement `S11Friends` with warden code sharing and fictional companion roster.
- `feat(p5)`: Implement `S12Trade` with duplicate card selection, parity tier checking, and 100 Echoes fee.

#### Phase P6: Battle Arena & Duel Flow
- `feat(p6)`: Implement `S13BattleLobby` with Solo, Versus, and Ranked modes.
- `feat(p6)`: Implement `S14Matchmaking` with wisp-moth radar pulse animation and rival encounter.
- `feat(p6)`: Implement `S15BattleBoard` vertical mobile arena with Active/Bench, Aether well, and bot AI.

#### Phase P7: Settings, Sanctuary Shop, and Documentation
- `feat(p7)`: Implement `S16MenuSettings` with audio sliders, motion toggle, and legal disclaimer.
- `feat(p7)`: Implement `S17Shop` with candle kindles, pack bundles, and Mulberry32 drop disclosures.
- `feat(p7)`: Implement `S00Tutorial` 7-step guided onboarding ritual.
- `docs(p7)`: Complete `PARITY.md`, `ORIGINALITY.md`, `DECISIONS.md`, `ASSETS.md`, `KNOWN_GAPS.md`, `CHANGELOG.md`, and `README.md`.

#### NFT Expansion: 100 Tarot & Cosmic Arcana Cards
- `feat(cards)`: Generate 100 unique NFT cards featuring Tarot Major Arcana (`c-013`–`c-034`) and Minor Arcana / Astrological Spirits (`c-035`–`c-100`) alongside 12 canonical showcase cards (`c-001`–`c-012`).
- `feat(game)`: Extend card model with `power` rating (20–180), `vitality` HP (50–240), `tarotArchetype`, and narrative `description`.
- `feat(art)`: Implement tiered procedural SVG art styles with animated rotating sacred geometry halos, stardust particles, and aspect coloring.
- `feat(ui)`: Implement dynamic pointer-tracked radial holographic sheen for Moon cards and animated rainbow foil reflection for Veil crowned cards in `CardView.tsx`.
- `feat(detail)`: Display tarot archetypes, power indicators, and expanded lore narrative in `S07CardDetail.tsx` and full-art Immersive mode.
