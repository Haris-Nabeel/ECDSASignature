const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");
let web3 = new Web3(
  "https://rinkeby.infura.io/v3/5c1047d6f4314e7693c6912328594f29"
);
require("dotenv").config();
const { PRIVATEKEY } = process.env;
const EthCrypto = require("eth-crypto");

describe("RareCollection", function () {
  let deployer,
    alice,
    bob,
    jake,
    accounts = [],
    deployedRareCollection;
  beforeEach(async () => {
    const RareCollection = await hre.ethers.getContractFactory(
      "RareCollection"
    );
    deployedRareCollection = await RareCollection.deploy();

    await deployedRareCollection.deployed();
    accounts = await hre.ethers.getSigners();
    [deployer, alice, bob, jake] = accounts;
  });

  it("It should deploy RareCollection properly", async () => {
    expect(await deployedRareCollection.name()).to.be.equal("RareCollection");
    expect(await deployedRareCollection.symbol()).to.be.equal("RC");
    expect(await deployedRareCollection.owner()).to.be.equal(deployer.address);
  });

  it.only("Should allow to Mint using User", async function () {
    const tokenIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let currentTime = Math.round(new Date().getTime() / 1000); // acting as a nounce
    const encoded = web3.eth.abi.encodeParameters(
      ["address", "uint256", "uint256"],
      [alice.address, tokenIds[0], currentTime]
    );
    const hash = web3.utils.keccak256(encoded);
    // here owner is signing the data
    const signature = EthCrypto.sign(PRIVATEKEY, hash);

    await deployedRareCollection
      .connect(alice)
      .mintNft(alice.address, tokenIds[0], currentTime, signature);
    console.log("NFT minted Successfully");

    expect(await deployedRareCollection.ownerOf(tokenIds[0])).to.be.equal(
      alice.address
    );

    await expect(
      deployedRareCollection.mintNft(
        alice.address,
        tokenIds[0],
        currentTime,
        signature
      )
    ).to.be.revertedWith("RareCollection: Signature already Used");
  });
});
