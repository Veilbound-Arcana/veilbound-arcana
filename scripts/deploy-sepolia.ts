import { ethers } from "hardhat";

async function main() {
  console.log("====================================================");
  console.log("  Deploying Veilbound Arcana Suite to Sepolia Testnet");
  console.log("====================================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer Address:", deployer.address);

  // 1. Deploy CardCatalog
  const CardCatalogFactory = await ethers.getContractFactory("CardCatalog");
  const catalog = await CardCatalogFactory.deploy();
  await catalog.waitForDeployment();
  console.log("CardCatalog deployed at:", await catalog.getAddress());

  // 2. Deploy ArcanaCards (NFT ERC-721)
  const ArcanaCardsFactory = await ethers.getContractFactory("ArcanaCards");
  const arcanaCards = await ArcanaCardsFactory.deploy(await catalog.getAddress());
  await arcanaCards.waitForDeployment();
  console.log("ArcanaCards deployed at:", await arcanaCards.getAddress());

  // 3. Deploy FateToken (ERC-7984 + Faucet)
  const FateTokenFactory = await ethers.getContractFactory("FateToken");
  const fateToken = await FateTokenFactory.deploy();
  await fateToken.waitForDeployment();
  console.log("FateToken deployed at:", await fateToken.getAddress());

  // 4. Deploy TarotGacha
  const TarotGachaFactory = await ethers.getContractFactory("TarotGacha");
  const gacha = await TarotGachaFactory.deploy(
    await fateToken.getAddress(),
    await arcanaCards.getAddress(),
    await catalog.getAddress()
  );
  await gacha.waitForDeployment();
  console.log("TarotGacha deployed at:", await gacha.getAddress());

  // Authorize Gacha as minter in ArcanaCards
  await arcanaCards.setGachaContract(await gacha.getAddress());

  // 5. Deploy DuelEngine
  const DuelEngineFactory = await ethers.getContractFactory("DuelEngine");
  const duelEngine = await DuelEngineFactory.deploy(
    await arcanaCards.getAddress(),
    await catalog.getAddress()
  );
  await duelEngine.waitForDeployment();
  console.log("DuelEngine deployed at:", await duelEngine.getAddress());

  // 6. Deploy StakeEscrow
  const StakeEscrowFactory = await ethers.getContractFactory("StakeEscrow");
  const stakeEscrow = await StakeEscrowFactory.deploy(
    await arcanaCards.getAddress(),
    await catalog.getAddress()
  );
  await stakeEscrow.waitForDeployment();
  await stakeEscrow.setDuelEngine(await duelEngine.getAddress());
  console.log("StakeEscrow deployed at:", await stakeEscrow.getAddress());

  // 7. Deploy Market (Swap)
  const MarketFactory = await ethers.getContractFactory("Market");
  const market = await MarketFactory.deploy(await arcanaCards.getAddress());
  await market.waitForDeployment();
  console.log("Market deployed at:", await market.getAddress());

  console.log("\nDeployment completed successfully! Save addresses to .env and evidence/manifest.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
