/**
 * Backward-compatible re-exports. The FHE helpers now live in `encryption.ts`.
 */
export {
  createMockEncryptedInput,
  createDecryptionSession,
  buildRoundCommitInputs,
  clampEnergy,
  clampSlot,
  randomSecretSalt,
} from "./encryption.js";
export type { EncryptedInput, RoundCommitInputs } from "./encryption.js";
