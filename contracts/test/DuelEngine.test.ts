import { expect } from "chai";
import { ethers } from "hardhat";

describe("DuelEngine & ArcanaCards Lifecycle", function () {
  let catalog: any;
  let arcanaCards: any;
  let duelEngine: any;
  let owner: any;
  let playerA: any;
  let playerB: any;

  beforeEach(async function () {
    [owner, playerA, playerB] = await ethers.getSigners();

    const CardCatalogFactory = await ethers.getContractFactory("CardCatalog");
    catalog = await CardCatalogFactory.deploy();
    await catalog.waitForDeployment();

    const ArcanaCardsFactory = await ethers.getContractFactory("ArcanaCards");
    arcanaCards = await ArcanaCardsFactory.deploy(await catalog.getAddress());
    await arcanaCards.waitForDeployment();

    const DuelEngineFactory = await ethers.getContractFactory("DuelEngine");
    duelEngine = await DuelEngineFactory.deploy(
      await arcanaCards.getAddress(),
      await catalog.getAddress()
    );
    await duelEngine.waitForDeployment();
  });

  it("should have 20 cards registered in catalog", async function () {
    const card1 = await catalog.getCard(1);
    expect(card1.name).to.equal("Page of Wands");
    expect(card1.cost).to.equal(1);
    expect(card1.basePower).to.equal(2);

    const card20 = await catalog.getCard(20);
    expect(card20.name).to.equal("XXI - The World");
    expect(card20.cost).to.equal(4);
    expect(card20.basePower).to.equal(5);
  });

  it("should prevent transfer of Sealed cards until unsealed", async function () {
    const handle = ethers.keccak256(ethers.toUtf8Bytes("random-seed"));
    await arcanaCards.mintSealed(playerA.address, handle);

    // Attempting to transfer sealed card should revert
    await expect(
      arcanaCards
        .connect(playerA)
        .transferFrom(playerA.address, playerB.address, 1)
    ).to.be.revertedWith("ArcanaCards: Sealed cards cannot be transferred");

    // Unseal card
    await arcanaCards.connect(playerA).unseal(1, 1);
    const card = await arcanaCards.getCardInstance(1);
    expect(card.isSealed).to.be.false;
    expect(card.defId).to.equal(1);

    // Transfer should now succeed
    await arcanaCards
      .connect(playerA)
      .transferFrom(playerA.address, playerB.address, 1);
    expect(await arcanaCards.ownerOf(1)).to.equal(playerB.address);
  });

  it("should create match, join, and reject deck exceeding cost 12", async function () {
    // Create match
    await duelEngine.connect(playerA).createMatch();
    await duelEngine.connect(playerB).joinMatch(1);

    // Mint 5 Legendary cards with defIds [17, 17, 18, 18, 19] (all cost 4 -> total 20 > 12)
    const handle = ethers.keccak256(ethers.toUtf8Bytes("test"));
    const defs = [17, 17, 18, 18, 19];
    for (let i = 1; i <= 5; i++) {
      await arcanaCards.mintSealed(playerA.address, handle);
      await arcanaCards.connect(playerA).unseal(i, defs[i - 1]);
    }

    await expect(
      duelEngine.connect(playerA).lockDeck(1, [1, 2, 3, 4, 5])
    ).to.be.revertedWith("DuelEngine: Total deck cost exceeds 12");
  });
});
