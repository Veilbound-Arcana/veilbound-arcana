import { ethers } from "ethers";

/**
 * Encrypted input helpers for confidential round commits.
 *
 * Production note: on Sepolia the browser builds real FHE encrypted inputs with
 * a client confidential coprocessor SDK (userEncrypt) and submits handle + proof.
 * The helpers below produce deterministic mock handles so the local lobby, practice
 * bot, and offline replay can run without a relayer — they are clearly marked as
 * mocks and are never presented as on-chain proofs.
 */

export interface EncryptedInput {
  handle: string;
  proof: string;
  mocked: true;
}

export function randomSecretSalt(): string {
  return ethers.hexlify(ethers.randomBytes(16));
}

/** Deterministic mock handle+proof for local/devnet flows. */
export function createMockEncryptedInput(value: number, secretSalt: string): EncryptedInput {
  const handle = ethers.keccak256(ethers.toUtf8Bytes(`veilbound:${value}:${secretSalt}`));
  const proof = ethers.hexlify(ethers.toUtf8Bytes(`mock-proof:${value}`));
  return { handle, proof, mocked: true };
}

export interface RoundCommitInputs {
  slot: EncryptedInput;
  energy: EncryptedInput;
}

/**
 * Build the pair of encrypted handles submitted to `DuelEngine.commitRound`.
 * @param slot 1..3 hand slot (client clamps to valid range before encryption)
 * @param energy 0..remaining energy (client clamps — mirror of on-chain zero-revert rule)
 */
export function buildRoundCommitInputs(
  slot: number,
  energy: number,
  remainingEnergy: number,
  salt: string = randomSecretSalt()
): RoundCommitInputs {
  const safeSlot = Math.max(1, Math.min(3, Math.floor(slot)));
  const safeEnergy = Math.max(0, Math.min(Math.floor(energy), remainingEnergy));
  return {
    slot: createMockEncryptedInput(safeSlot, salt),
    energy: createMockEncryptedInput(safeEnergy, salt),
  };
}

/** Client-side mirror of the FHEVM zero-revert clamp rule (never reject — clamp). */
export function clampEnergy(requested: number, remaining: number): number {
  if (!Number.isFinite(requested) || requested < 0) return 0;
  return Math.min(Math.floor(requested), Math.max(0, remaining));
}

export function clampSlot(slot: number): number {
  if (!Number.isFinite(slot)) return 1;
  return Math.max(1, Math.min(3, Math.floor(slot)));
}

/**
 * One-signature decryption session payload (EIP-712).
 * Enables the "authorize once, decrypt many" flow with a single wallet signature.
 */
export async function createDecryptionSession(signer: ethers.Signer, contractAddress: string) {
  const address = await signer.getAddress();
  const domain = {
    name: "Veilbound Decryption Authorization",
    version: "1",
    chainId: 11155111,
    verifyingContract: contractAddress,
  };

  const types = {
    Session: [
      { name: "user", type: "address" },
      { name: "expiry", type: "uint256" },
    ],
  };

  const expiry = Math.floor(Date.now() / 1000) + 86400;
  const signature = await signer.signTypedData(domain, types, { user: address, expiry });

  return { address, expiry, signature };
}
