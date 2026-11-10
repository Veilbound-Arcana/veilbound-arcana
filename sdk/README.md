# @veilbound/sdk

> **Mandatory Disclaimer:** *This project is not audited, endorsed or operated by Zama. Use at your own risk.*

Official client SDK for Veilbound Arcana, providing:
- Typed data models for cards, suits, and match lifecycle states
- Cryptographic proof generation and FHE session management
- Battle math evaluation and non-revert clamp simulators
- High-level `VeilboundClient` wrapper for ethers/viem.

## Usage

```typescript
import { VeilboundClient, getSuitAdvantage, OFFICIAL_CARD_CATALOG } from "@veilbound/sdk";

// Read card parameters
const card = OFFICIAL_CARD_CATALOG[1]; // Page of Wands
console.log(card.name, card.cost, card.basePower);

// Evaluate suit advantage (Wands beats Swords)
const advantage = getSuitAdvantage("Wands", "Swords"); // +1
```
