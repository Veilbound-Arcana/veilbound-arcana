# Known Gaps & Future Roadmap (KNOWN_GAPS.md)

This document outlines known non-blocking architectural boundaries and planned enhancements for future iterations of **Veilbound Arcana**.

---

### 1. Peer-to-Peer Networking
- **Current State:** Multiplayer matchmaking (`S14Matchmaking`) and duels (`S15BattleBoard`) utilize simulated bot AI (`src/game/bot.ts`) with organic 800ms natural delay and tactical decision trees.
- **Future Extension:** Integration with WebRTC or WebSocket duel rooms for live synchronous peer-to-peer duel matching without altering the pure TypeScript engine contract.

### 2. Physical Card Haptic Feedback
- **Current State:** Haptic feedback relies on the standard browser `navigator.vibrate` API with patterns `[10, 30, 10]` and `[20, 40, 20]`.
- **Future Extension:** When compiled to native iOS/Android wrappers (e.g. Capacitor or React Native), map to native core haptics (UIImpactFeedbackGenerator).

### 3. Extended Audio Synthesizer Controls
- **Current State:** Dynamic WebAudio sound engine synthesizes all 8 required acoustic events with volume and mute control.
- **Future Extension:** Add continuous ambient background drone synthesizer that reacts dynamically to remaining player vitality during battle.
