const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Guess The Secret Number", function () {
  let deployer;

  it("Solve the challenge", async () => {
    [deployer] = await ethers.getSigners();

    const factory = await ethers.getContractFactory("contracts/Lotteries/GuessTheSecretNumberChallenge.sol:GuessTheSecretNumberChallenge");
    this.factory = await factory.deploy({ value: ethers.utils.parseEther("1") });

    let answerHash = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";
    let secretNumber;

    for (let i = 0; i <= 255; i++) {
      const hash = ethers.utils.keccak256(i);
      if (answerHash == hash) {
        secretNumber = i;
        console.log(`The secret number is ${secretNumber}`);
        break;
      }
    }

    await this.factory.guess(secretNumber, { value: ethers.utils.parseEther("1") });

    expect(await this.factory.isComplete()).to.be.eq(true);
  });
});
