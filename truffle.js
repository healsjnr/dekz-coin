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
    //ropsten: {
    //  network_id: 3,
    //  host: '127.0.0.1',
    //  port: 8545,
    //  gas: 4000000,
    //  from: '0x42f851bA62ED1fACA50250465727C474dC1B8a89'
    //},
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infraToken);
      },
      network_id: 3,
      gasPrice: 1000000000,
      gasLimit: 5000000,
      gas: 4700217,
    }
  }
};
