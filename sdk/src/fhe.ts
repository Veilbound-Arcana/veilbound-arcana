import { ethers } from "ethers";

/**
 * Helper to generate pseudorandom mock handles and FHE input proofs for local testing & devnet.
 */
export function createMockEncryptedInput(value: number, secretSalt: string): { handle: string; proof: string } {
  const handle = ethers.keccak256(ethers.toUtf8Bytes(`${value}-${secretSalt}`));
  const proof = ethers.hexlify(ethers.toUtf8Bytes(`mock-zkp-proof-for-${value}`));
  return { handle, proof };
}

/**
 * Creates EIP-712 decryption signature session payload for Zama FHEVM SDK.
 */
export async function createDecryptionSession(signer: ethers.Signer, contractAddress: string) {
  const address = await signer.getAddress();
  const domain = {
    name: "Veilbound Decryption Authorization",
    version: "1",
    chainId: 11155111, // Sepolia
    verifyingContract: contractAddress,
  };

  const types = {
    Session: [
      { name: "user", type: "address" },
      { name: "expiry", type: "uint256" },
    ],
  };

  const expiry = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  const signature = await signer.signTypedData(domain, types, { user: address, expiry });

  return { address, expiry, signature };
}
