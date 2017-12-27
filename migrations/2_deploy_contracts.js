console.log('migrating')

var DekzCoinSale = artifacts.require("./DekzCoinCrowdsale");

module.exports = function(deployer) {
  var network = deployer.network;
  console.log("network: " + network);

  if (process.env.TEST_RUN === "true") {
    console.log('Test run, exiting migration.');
    return;
  }

  const weiRate = new web3.BigNumber(100000);
  if (network === 'ropsten') {
      deployRopsten(deployer, weiRate);
  } else if (network === 'live') {
      deployMainNet(deployer, weiRate);
      console.log('prod deploy');
  } else {
      console.log('unknown network')
  }
};

function deployRopsten(deployer, weiRate) {
  const owner = "0x42f851bA62ED1fACA50250465727C474dC1B8a89";         // TEST Owner Account
  const testNetDekz = "0x99E1fc7Fe05c00B09D541F37D15B9fd88dd0F013";   // TEST Dekz Account
  const start     = 1514338562; // 
  const end       = 1514345562; // Friday, January 5, 2018 1:20:00 PM GMT+11:00
  console.log('Ropsten deploying... ');
  return deployer.deploy(DekzCoinSale, start, end, weiRate, testNetDekz);
}

function deployMainNet(deployer, weiRate) {
  const owner = "0x77732DAEfE999d8FA1a4a4CF52139173f3b98439";             // Prod owner account
  const dekzAccount = "0x9f988CD74c5E5A7C4D929bbe3a7E364D3454EE50";       // Prod dekz account
  const start     = 1514725200; // Monday, January 1, 2018 12:00:00 AM GMT+11:00
  const end       = 1515085200; // Friday, January 5, 2018 4:00:00 AM GMT+11:00
  console.log('Mainnet deploying... ');
  return deployer.deploy(DekzCoinSale, start, end, weiRate, dekzAccount);
}
