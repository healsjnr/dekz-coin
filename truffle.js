require("babel-register");
require("babel-polyfill");
require('dotenv').config();

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.ROP_MNEMONIC;
var infraToken = process.env.INFURA_KEY;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 1e7
    },
    test: {
      provider: require("ethereumjs-testrpc").provider({ gasLimit: 1e7 }),
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infraToken);
      },
      network_id: 3,
      gasPrice: 20000000000,
      gasLimit: 5000000,
      gas:      4700217  //Gas used with messages: 4649321
    }
  }
};
