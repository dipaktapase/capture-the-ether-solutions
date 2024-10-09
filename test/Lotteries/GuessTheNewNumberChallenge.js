const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Guess The New Random Number", function () {
  let deployer;

  it("Solve the challenge", async () => {
    [deployer] = await ethers.getSigners();

    const challengeFactory = await ethers.getContractFactory(
      "contracts/Lotteries/GuessTheNewNumberChallenge.sol:GuessTheNewNumberChallenge"
    );
    this.challengeContract = await challengeFactory.deploy({ value: ethers.utils.parseEther("1") });

    const attackFactory = await ethers.getContractFactory("contracts/Lotteries/GuessTheNewNumberChallenge.sol:GuessTheNewNumberAttack");
    this.attackContract = await attackFactory.deploy(this.challengeContract.address);

    const tx = await this.attackContract.attack({ value: ethers.utils.parseEther("1") });
    await tx.wait();

    expect(await this.challengeContract.isComplete()).to.be.eq(true);
  });
});
