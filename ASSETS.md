# Asset Provenance & License Ledger (ASSETS.md)

All assets utilized in **Veilbound Arcana** are 100% original, procedurally synthesized, or derived from verified open-source libraries.

---

### 1. Typography

| Font Family | Usage | License | Source |
| :--- | :--- | :--- | :--- |
| **Cinzel** | Display titles, card headers, set titles | Open Font License (OFL) | Google Fonts (`family=Cinzel:wght@600;700;800`) |
| **Nunito** | UI body, numbers, rules text, microcopy | Open Font License (OFL) | Google Fonts (`family=Nunito:wght@400;600;700;800;900`) |

---

### 2. Iconography & Visual Assets

| Asset Group | Description | License | Implementation |
| :--- | :--- | :--- | :--- |
| **Aspect Glyphs (8)** | Original geometric symbols (Ember, Tide, Verdant, Volt, Umbra, Lumen, Iron, Aether) | MIT (Original Author) | `src/components/AspectGlyph.tsx` |
| **Rarity Marks** | Original Rune I–IV chevrons, Moon I–III radiant moons, and Veil moths | MIT (Original Author) | `src/components/RarityGlyph.tsx` |
| **Wisp-Moth Mascot** | Sacred moth emblem on concentric arena rings | MIT (Original Author) | Hand-crafted SVG in `S01Splash`, `S04Reveal`, `S14Matchmaking` |
| **Card Artwork (100 Cards)** | Original character illustrations: 10 silhouette classes, 5 combat poses, per-card proportions, accessory variants, aspect palettes, and scene backdrops | MIT (Original Author) | `src/art/character/characterEngine.ts` (FNV-1a + Mulberry32 seeded) |
| **Battle Character Sprites** | The same illustrations driven into animated battle states (idle breathe, weapon swing, hurt flash, knockout) | MIT (Original Author) | `src/art/character/CharacterFigure.tsx`, `CharacterArt.tsx` |
| **UI Icons** | General navigation and action icons | MIT | `lucide-react` v0.383.0 |

---

### 3. Sound & Audio Synthesis

| Sound Event | Synthesis Technique | License | File |
| :--- | :--- | :--- | :--- |
| **Seal Tear** | Bandpass filtered noise sweep (800Hz to 3200Hz, 200ms) | Procedural WebAudio | `src/fx/audio.ts` |
| **Card Flip** | Sine click & upward shimmer (440Hz to 880Hz, 80ms) | Procedural WebAudio | `src/fx/audio.ts` |
| **Rune Reveal** | Single celesta sine chime (1046.5Hz C6, 600ms) | Procedural WebAudio | `src/fx/audio.ts` |
| **Moon Reveal** | 3-note triangle arpeggio (C5, E5, G5, 800ms) | Procedural WebAudio | `src/fx/audio.ts` |
| **Veil Reveal** | Dual oscillator choir swell with detune (1.6s) | Procedural WebAudio | `src/fx/audio.ts` |
| **Knockout (KO)** | Filtered square wave glass shatter burst | Procedural WebAudio | `src/fx/audio.ts` |
| **Win Motif** | 4-note rising harmonic progression | Procedural WebAudio | `src/fx/audio.ts` |
| **Loss Motif** | 4-note falling contemplative progression | Procedural WebAudio | `src/fx/audio.ts` |

*No external audio files or recorded samples are packaged or requested over the network.*

---

### 4. Runtime Software Dependencies

Total runtime dependencies: **6** (strict compliance with the maximum limit of 12).

| Package | Pinned Version | License | Scope |
| :--- | :--- | :--- | :--- |
| `react` | `18.3.1` | MIT | Core React component runtime |
| `react-dom` | `18.3.1` | MIT | DOM mounting |
| `next` | `15.5.29` | MIT | App Router, routing, production build & server |
| `framer-motion` | `11.2.10` | MIT | Touch gestures, spring physics & layout transitions |
| `zustand` | `4.5.2` | MIT | Reactive game state & local storage persistence |
| `lucide-react` | `0.383.0` | MIT | Clean vector icon components |

---

### 5. Legal & Attribution Disclaimer

> *"Veilbound Arcana is an original game and is not affiliated with any other trading-card game."*

All 100 character illustrations are generated procedurally from the project's own deterministic engine and are original works. They are genre archetypes (vanguard, arcanist, wildkin, ranger, guardian, assassin, mystic, colossus, wyrm, blade dancer); no third-party character, artwork, trademark, or other intellectual property is copied, traced, or referenced.

> **This project is not audited, endorsed or operated by any third party. Use at your own risk.**

### 6. Character Art Pipeline

| Stage | Command / File | Output |
| :--- | :--- | :--- |
| Engine (single source) | `frontend/src/art/character/characterEngine.ts` | Deterministic profile + layered SVG builder |
| Offline generator | `node scripts/generate-character-art.mjs` | `frontend/public/cards/art/c-001.svg … c-100.svg`, mirrored to `assets/art/` |
| Character descriptors | same run | `frontend/public/cards/characters/c-XXX.json` |
| Metadata enrichment | same run | `Character Class`, `Pose`, `Weapon`, `Scene` traits + `local_image` on the 20 NFT metadata files |
| Live renderer | `frontend/src/art/character/CharacterArt.tsx` | Inline SVG (idle breathing, aura, ember drift) |
| Battle sprite | `frontend/src/art/character/CharacterFigure.tsx` | Attack lunge + weapon swing, hurt flash, knockout collapse |
| Validation | XML parse of all 100 SVGs (0 errors) + browser render check | See `docs/evidence-pack.md` |
