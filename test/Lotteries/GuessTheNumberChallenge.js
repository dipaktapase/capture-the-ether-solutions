const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Guess The Number", function () {
  let deployer;

  it("Solve the challenge", async () => {
    [deployer] = await ethers.getSigners();

    const factory = await ethers.getContractFactory("contracts/Lotteries/GuessTheNumberChallenge.sol:GuessTheNumberChallenge");
    this.factory = await factory.deploy({ value: ethers.utils.parseEther("1") });

    await this.factory.guess(42, { value: ethers.utils.parseEther("1") });

    expect(await this.factory.isComplete()).to.be.eq(true);
  });
});
