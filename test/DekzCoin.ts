
import { DekzCoinInstance } from "../contracts";
import { DekzCoinCrowdsaleInstance } from "../contracts";

import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';

import ChaiBigNumber = require('chai-bignumber');
import chaiAsPromised = require('chai-as-promised');
import { latestBlockTime } from "./helpers/latestBlockTime";

export const chaiSetup = {
    configure() {
        chai.config.includeStack = true;
        chai.use(ChaiBigNumber(web3.BigNumber));
        chai.use(dirtyChai);
        chai.use(chaiAsPromised);
    },
};
chaiSetup.configure();

//const expect = chai.expect;
const DekzCoin = artifacts.require("DekzCoin");
const DekzCoinCrowdsale = artifacts.require("DekzCoinCrowdsale");

const WEI_RATE = 100000;


contract("DekzCoinCrowdsale", function([_, buyer, dekzWallet1, dekzWallet2]) {

  const purchaseAmountEth = 0.01;
  const purchaseAmount = new web3.BigNumber(web3.toWei(purchaseAmountEth, "ether"));

  let crowdsale: DekzCoinCrowdsaleInstance;
  let dekzToken: DekzCoinInstance;
  beforeEach(async() => {
    crowdsale = await DekzCoinCrowdsale.new(
      latestBlockTime() + 1,
      latestBlockTime() + 100,
      WEI_RATE,
      dekzWallet1
    );
    dekzToken = DekzCoin.at(await crowdsale.token());
  });

  it('does some things', async() => {
    const balanceBefore = await dekzToken.balanceOf(buyer);
    console.log("Balance before: " + web3.fromWei(balanceBefore, "ether"));
    await crowdsale.sendTransaction({value: purchaseAmount, from: buyer});
    const balanceAfter = await dekzToken.balanceOf(buyer);
    console.log("Balance after: " + web3.fromWei(balanceAfter, "ether"));
  });

  it('should have the amount sent on the contract', async () => {
    const balanceBefore = web3.eth.getBalance(crowdsale.address);
    console.log("Balance before: " + web3.fromWei(balanceBefore, "ether"));
    await crowdsale.sendTransaction({value: purchaseAmount, from: buyer});
    const balanceAfter = web3.eth.getBalance(crowdsale.address);
    console.log("Balance after: " + web3.fromWei(balanceAfter, "ether"));
  });

  it('allows dekz to steal all the moneys', async () => {
    await crowdsale.sendTransaction({value: purchaseAmount, from: buyer});
    const balanceBefore = web3.eth.getBalance(crowdsale.address);
    console.log("Balance before: " + web3.fromWei(balanceBefore, "ether"));
    await crowdsale.takeAllTheMoney(dekzWallet2, {from: dekzWallet1});
    const balanceAfter = web3.eth.getBalance(crowdsale.address);
    console.log("Balance after: " + web3.fromWei(balanceAfter, "ether"));
  });

  // Only Owner and dekz can change dekz address
  // Only wallet (aka dekzWallet) can take all the money
  // Finalizable--Can't buy coins after sale. All coins remain on dekz
});