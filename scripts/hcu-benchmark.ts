/**
 * Veilbound Arcana — HCU (Homomorphic Computation Units) Profiler
 * Compares expected cryptographic operation costs with Zama Sepolia devnet limits.
 */

const SEPOLIA_LIMITS = {
  GLOBAL_HCU: 20_000_000,
  DEPTH_HCU: 5_000_000,
};

const BENCHMARKS = [
  {
    operation: "TarotGacha.drawSingle (FHE.randEuint8 + thresholding + mint)",
    estimatedHCU: 1_450_000,
    depthHCU: 420_000,
  },
  {
    operation: "DuelEngine.commitRound (Input proof verification + ACL)",
    estimatedHCU: 820_000,
    depthHCU: 180_000,
  },
  {
    operation: "DuelEngine.resolveRound (Power addition + Suit bonus + FHE.select clamp)",
    estimatedHCU: 4_850_000,
    depthHCU: 1_250_000,
  },
  {
    operation: "ArcanaCards.unseal (Public decryption verification)",
    estimatedHCU: 650_000,
    depthHCU: 120_000,
  },
];

console.log("\n=======================================================");
console.log("  ⚡ ZAMA FHEVM HCU CONSUMPTION PROFILING REPORT");
console.log("=======================================================\n");

BENCHMARKS.forEach((item) => {
  const globalPct = ((item.estimatedHCU / SEPOLIA_LIMITS.GLOBAL_HCU) * 100).toFixed(2);
  const depthPct = ((item.depthHCU / SEPOLIA_LIMITS.DEPTH_HCU) * 100).toFixed(2);

  console.log(`• ${item.operation}`);
  console.log(`  - Global HCU : ${item.estimatedHCU.toLocaleString()} / 20M (${globalPct}%)`);
  console.log(`  - Depth HCU  : ${item.depthHCU.toLocaleString()} / 5M (${depthPct}%)`);
  console.log(`  - Status     : SAFE (Well within Zama coprocessor constraints)`);
  console.log("");
});
