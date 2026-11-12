# Architectural Decisions & Conflict Resolutions (DECISIONS.md)

This log records design, balance, architecture, and parity trade-offs made during the implementation of **Veilbound Arcana**.

---

### Decision Log

| ID | Topic | Decision | Justification |
| :--- | :--- | :--- | :--- |
| **D-01** | **Artwork Generation** | Full procedural SVG generation via `ProceduralArt.tsx` seeded by mulberry32 hash of card id. Optional WebP override at `/public/art/{cardId}.webp`. | Guarantees 100% original visuals with zero external copyright dependencies or network asset loads. |
| **D-02** | **Audio Synthesis** | Real-time WebAudio synthesis via `SoundEngine` (`src/fx/audio.ts`) without external mp3/wav samples. | Eliminates 3rd-party audio sample tracking and provides zero-latency parameterized sounds for flips, chimes, arpeggios, and choir swells. |
| **D-03** | **Deterministic Randomness** | Seeded PRNG (`mulberry32` in `src/game/rng.ts`) injected into pack generation and duel matches. No direct `Math.random()`. | Ensures reproducible pack generation, match testing, daily seed replayability, and server verification without nondeterministic drift. |
| **D-04** | **Deck Size & Rule Enforcement** | Strict 20-card deck requirement, max 2 duplicate copies per card, minimum 1 Basic Veilborn spirit. | Standard mobile collectible duel pacing: fast, high-density decision making, prevented infinite duplicate stalling. |
| **D-05** | **Weakness Damage Bonus** | Set to `+20` flat damage in `rules.config.ts` based on dual interlocking Aspect rings. | Configurable parameter that rewards tactical element counters without completely invalidating high-vitality Stage 1 / Crowned spirits. |
| **D-06** | **Rarity System Glyphs** | Custom geometric SVG runes (Rune I–IV: single to quad chevrons; Moon I–III: crescent to full radiant moon; Veil: sacred dual-winged moth). Never stars or diamonds. | Preserves the visual reward tiering of the genre while maintaining 100% original symbolic identity. |
| **D-07** | **Tear Interaction & Detachment** | Horizontal swipe gesture on the top 14% strip of a sealed vellum envelope. Triggers ribbon cut at 70% threshold. | High-fidelity tactile parity with physical card unsealing, utilizing a wax seal and ribbon instead of a foil packet. |
| **D-08** | **Immersive Full-Art Display** | Veil-tier cards feature an interactive "Immersive View" with slow breathing motion and ambient choir pad chords. | Provides peak collector satisfaction and highlights the rare Crowned spirit artwork. |
| **D-09** | **Pure TypeScript Engine** | `src/game/engine.ts` has zero UI/DOM imports, operating strictly as a state reducer `applyAction(state, action) -> { state, events }`. | Allows 100% unit test coverage via Vitest and shared execution between client UI, bot AI, and potential server validation. |
| **D-10** | **Viewport & Ergonomics** | Enforced 390×844 mobile viewport inside a desktop emulator `PhoneFrame.tsx`, supporting touch and mouse interactions with safe area insets. | Optimized for single-thumb mobile accessibility, clean screen transitions, and consistent portrait rendering. |
