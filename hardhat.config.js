require("@typechain/hardhat");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("hardhat-abi-exporter");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();



/* This loads the variables in your .env file to `process.env` */

const { PRIVATEKEY, INFURA_PROJECT_ID, ETHERSCANAPI, Coinmarketcap_API } =
  process.env;
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 20,
          },
        },
      },
    ],
  },
  gasReporter: {
    coinmarketcap: Coinmarketcap_API,
    currency: "USD",
    gasPrice: 21,
    token: "ETH",
  },
  networks: {
    mainnet: {
      // ethereum mainnet
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 1,
      accounts: [`0x${PRIVATEKEY}`],
      gasPrice: 470000000000, // gas price in gwei
    },

    bsc: {
      //mainnet
      url: `https://bsc-dataseed.binance.org/`,
      chainId: 56,
      accounts: [`0x${PRIVATEKEY}`],
      gasPrice: 5000000000, // gas price in gwei
    },
    polygon: {
      //mainnet
      url: "https://polygon-rpc.com",
      chainId: 137,
      accounts: [`0x${PRIVATEKEY}`],
      gasPrice: 35000000000, // gas price in gwei
    },

    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [`0x${PRIVATEKEY}`],
      gasPrice: 5000000000, // gas price in gwei
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 4,
      accounts: [`0x${PRIVATEKEY}`],
      gas: 4500000, // gas price in gwei
      gasPrice: 10000000000, // gas is the gas limit
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 42,
      accounts: [`0x${PRIVATEKEY}`],
      gasPrice: 35000000000, // gas price in gwei
    },

    polygonMumbai: {
      url: "https://rpc-mumbai.maticvigil.com	",
      chainId: 80001,
      accounts: [`0x${PRIVATEKEY}`],
      gasPrice: 35000000000,
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: { rinkeby: `${ETHERSCANAPI}`, polygon: "abc" },
  },
  mocha: {
    timeout: 2000000000,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
};