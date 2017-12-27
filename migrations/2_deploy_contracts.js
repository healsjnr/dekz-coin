console.log('migrating')

var DekzCoinSale = artifacts.require("./DekzCoinCrowdsale");

module.exports = function(deployer) {
  console.log("network: " + deployer.network);

  if (process.env.TEST_RUN === "true") {
    console.log('Test run, exiting migration.');
    return;
  }
  

  const testNetDekz = "0x99E1fc7Fe05c00B09D541F37D15B9fd88dd0F013";   // TEST Dekz Account
  const start     = 1514358716; // Wednesday, December 27, 2017 6:11:56 PM GMT+11:00
  const end       = 1515118800; // Friday, December 22, 2017 4:00:00 PM GMT+11:00
  const weiRate = new web3.BigNumber(100000);
  console.log('deploying... ');
  return deployer.deploy(DekzCoinSale, start, end, weiRate, testNetDekz);
};


function deployRopsten(testNetDekz, weiRate) {
  const owner = "0x42f851bA62ED1fACA50250465727C474dC1B8a89";         // TEST Owner Account
  const testNetDekz = "0x99E1fc7Fe05c00B09D541F37D15B9fd88dd0F013";   // TEST Dekz Account
  const start     = 1514358716; // Wednesday, December 27, 2017 6:11:56 PM GMT+11:00
  const end       = 1515118800; // Friday, January 5, 2018 1:20:00 PM GMT+11:00
  console.log('Ropsten deploying... ');
  return deployer.deploy(DekzCoinSale, start, end, weiRate, testNetDekz);
}

function deployMainNet(testNetDekz, weiRate) {
  const owner = "";             // Prod owner account
  const dekzAccount = "";       // Prod dekz account
  const start     = 1514725200; // Monday, January 1, 2018 12:00:00 AM GMT+11:00
  const end       = 1515085200; // Friday, January 5, 2018 4:00:00 AM GMT+11:00
  console.log('Mainnet deploying... ');
  return deployer.deploy(DekzCoinSale, start, end, weiRate, dekzAccount);
}