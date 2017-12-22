console.log('migrating')

var DekzCoinSale = artifacts.require("./DekzCoinCrowdsale");

module.exports = function(deployer) {

  if (process.env.TEST_RUN === "true") {
    console.log('Test run, exiting migration.');
    return;
  }
  
  const testNetDekz = "0x99E1fc7Fe05c00B09D541F37D15B9fd88dd0F013";   // TEST Dekz Account
  const owner = "0x42f851bA62ED1fACA50250465727C474dC1B8a89";         // TEST Owner Account

  const _start    = 1513749600; // Wednesday, December 20, 2017 5:00:00 PM GMT+11:00
  const start     = 1513918800; // Friday, December 22, 2017 4:00:00 PM GMT+11:00
  const end       = 1514118800; // Friday, December 22, 2017 4:00:00 PM GMT+11:00
  const weiRate = new web3.BigNumber(100000);
  console.log('deploying... ');
  return deployer.deploy(DekzCoinSale, start, end, weiRate, testNetDekz);
};


//module.exports = function(deployer) {}