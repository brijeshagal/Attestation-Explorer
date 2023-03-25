const { localhost } = require("wagmi/dist/chains");

require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    defaultNetwork: localhost,
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
