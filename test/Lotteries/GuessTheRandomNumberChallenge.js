const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Guess The Random Number", function () {
  let deployer;

  it("Solve the challenge", async () => {
    [deployer] = await ethers.getSigners();

    const factory = await ethers.getContractFactory("contracts/Lotteries/GuessTheRandomNumberChallenge.sol:GuessTheRandomNumberChallenge");
    this.factory = await factory.deploy({ value: ethers.utils.parseEther("1") });

    // Reading sensitive On-Chain Data
    // Here simply we are reading the first slot of contract because the uint8 is stored at 0 storage slot, and data on the blockchain is not private
    const secretNumber = await ethers.provider.getStorageAt(this.factory.address, 0)

    console.log('The secret number in hex is:', ethers.utils.hexValue(secretNumber))

    await this.factory.guess(secretNumber, { value: ethers.utils.parseEther("1") });

    expect(await this.factory.isComplete()).to.be.eq(true);
  });
});
