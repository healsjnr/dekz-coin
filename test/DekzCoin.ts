
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


contract("DekzCoinCrowdsale", function([_, buyer, wallet]) {

  let crowdsale: DekzCoinCrowdsaleInstance;
  beforeEach(async() => {
    crowdsale = await DekzCoinCrowdsale.new(
      latestBlockTime() + 1,
      latestBlockTime() + 100,
      50,
      wallet
    );
  });

  it('does some things', async() => {
    const dekzToken = DekzCoin.at(await crowdsale.token());
    const balanceBefore = await dekzToken.balanceOf(buyer);
    console.log("Balance before: " + balanceBefore);
    await crowdsale.sendTransaction({value: 50, from: buyer});
    const balanceAfter = await dekzToken.balanceOf(buyer);
    console.log("Balance after: " + balanceAfter);
  });
});