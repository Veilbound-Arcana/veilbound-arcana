import { expect } from "chai";
import { ethers } from "hardhat";

describe("FateToken", function () {
  let fateToken: any;
  let owner: any;
  let user1: any;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    const FateTokenFactory = await ethers.getContractFactory("FateToken");
    fateToken = await FateTokenFactory.deploy();
    await fateToken.waitForDeployment();
  });

  it("should have correct token metadata", async function () {
    expect(await fateToken.name()).to.equal("Fate Shard");
    expect(await fateToken.symbol()).to.equal("FATE");
    expect(await fateToken.decimals()).to.equal(6);
  });

  it("should allow a user to claim daily faucet", async function () {
    const initialBalance = await fateToken.balanceOf(user1.address);
    expect(initialBalance).to.equal(0);

    await fateToken.connect(user1).claimFaucet();
    const newBalance = await fateToken.balanceOf(user1.address);
    expect(newBalance).to.equal(10 * 10 ** 6); // 10 FATE
  });

  it("should enforce faucet 24h cooldown", async function () {
    await fateToken.connect(user1).claimFaucet();
    await expect(fateToken.connect(user1).claimFaucet()).to.be.revertedWith(
      "FateToken: Faucet cooldown active"
    );
  });
});
