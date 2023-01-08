require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
// NFTMarketContract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// NFTContract deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
const fs = require("fs");
const privatekey = fs.readFileSync(".secret").toString();
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/2Gd2cSLJcKQlVRGLgfUsfZvLOql",
      accounts: [
        `0x90dd98e24d269a50a5e61e1cccb6fa4e446308e42c189bc1f715a9cc7d15f549`,
      ],
      chainId: 5,
    },
  },
  solidity: "0.8.1",
};
