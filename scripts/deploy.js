const ether = require("@openzeppelin/test-helpers/src/ether");
const { ethers } = require("ethers");
const hre = require("hardhat");
const network = hre.hardhatArguments.network;
const { updateContractAddresses } = require("../utils/contractsManagement");

async function main() {
  const feedAddress = ethers.constants.AddressZero; // to be replaced with desired feed address
  const deployedPriceConsumerV3 = await (
    await (
      await hre.ethers.getContractFactory("PriceConsumerV3")
    ).deploy(feedAddress)
  ).deployed();

  updateContractAddresses(
    {
      PriceConsumerV3: deployedPriceConsumerV3.address,
    },
    network
  );

  if (hre.network.name != "hardhat") {
    console.log("Verifying........");
    // wait for half minute so that the contract should be propagated properly on blockchain
    await new Promise((resolve) => setTimeout(resolve, 30000));

    await hre.run("verify:verify", {
      address: deployedPriceConsumerV3.address,
      constructorArguments: [feedAddress],
    });
  }

  console.log("PricConsumerV3 deployed to:", deployedPriceConsumerV3.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
