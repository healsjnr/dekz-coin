
import { DekzCoinInstance } from "../contracts";
import { DekzCoinCrowdsaleInstance } from "../contracts";

import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';

import ChaiBigNumber = require('chai-bignumber');
import chaiAsPromised = require('chai-as-promised');
import * as blockTools from "./helpers/blockTools";

export const chaiSetup = {
    configure() {
        chai.config.includeStack = true;
        chai.use(ChaiBigNumber(web3.BigNumber));
        chai.use(dirtyChai);
        chai.use(chaiAsPromised);
    },
};
chaiSetup.configure();

const ONE_DAY_SECONDS = 60 * 60 * 24;
const expect = chai.expect;
const DekzCoin = artifacts.require("DekzCoin");
const DekzCoinCrowdsale = artifacts.require("DekzCoinCrowdsale");

const WEI_RATE = 100000;

contract("DekzCoinCrowdsale", function([owner, buyer, dekzWallet1, dekzWallet2, dummy]) {

  const purchaseAmountEth = 0.01;
  const purchaseAmount = new web3.BigNumber(web3.toWei(purchaseAmountEth, "ether"));

  let crowdsale: DekzCoinCrowdsaleInstance;
  let dekzToken: DekzCoinInstance;
  let startTime: number; 
  let endTime: number; 

  beforeEach(async() => {
    startTime = blockTools.latestBlockTime() + 1;
    endTime = blockTools.latestBlockTime() + ONE_DAY_SECONDS;
    crowdsale = await DekzCoinCrowdsale.new(
      startTime,
      endTime,
      WEI_RATE,
      dekzWallet1
    );
    dekzToken = DekzCoin.at(await crowdsale.token());

    blockTools.timer(10);
    await blockTools.advanceBlock();
  });

  describe('during the sale', () => {
    describe('buying tokens', () => {
      it('allocates tokens to the buyer', async () => {
        const balanceBefore = await dekzToken.balanceOf(buyer);
        await crowdsale.sendTransaction({value: purchaseAmount, from: buyer});
        const balanceAfter = await dekzToken.balanceOf(buyer);
        expect(balanceAfter.minus(balanceBefore)).to.be.bignumber.equal(web3.toWei(1000, "ether"));
      });

      it('should keep the amount sent from the buyer in the contract', async () => {
        const balanceBefore = web3.eth.getBalance(crowdsale.address);
        await crowdsale.sendTransaction({value: purchaseAmount, from: buyer});
        const balanceAfter = web3.eth.getBalance(crowdsale.address);
        expect(balanceAfter.minus(balanceBefore)).to.be.bignumber.equal(purchaseAmount);
      });

    });

    it('does not allow jacob to steal the money', async () => {
      try {
        await crowdsale.takeAllTheMoney(dekzWallet2, {from: dekzWallet1});
      } catch(error) {
        expect(error.message).to.have.string('invalid opcode');
        return;
      } 
      assert.fail(null, null, 'Expected invalid opcode');
    });
  });

  describe('change address', () => {
    it('only allows contract owner to change the wallet', async () => {
      await crowdsale.changeDekzAddress(dummy, {from: owner});
      const wallet = await crowdsale.wallet.call({from: owner});
      expect(wallet).to.equal(dummy);
    });
    
    it('only allows wallet owner to change the wallet', async () => {
      await crowdsale.changeDekzAddress(dummy, {from: dekzWallet1});
      const wallet = await crowdsale.wallet.call({from: owner});
      expect(wallet).to.equal(dummy);
    });
    
    it('does not allow anyone else to change the wallet', async () => {
      try {
        await crowdsale.changeDekzAddress(dummy, {from: buyer});
      } catch(error) {
        expect(error.message).to.have.string('invalid opcode');
        return;
      } 
      assert.fail(null, null, 'Expected invalid opcode');

    });
  });

  describe('leaving messages', () => {
    
    const message = 'This is a message';
    
    beforeEach(async() => {
      await crowdsale.leaveMessage(message);
    });

    it('allows someone to leave a message', async () => {
      const messageResult = await crowdsale.getMessage.call(0, {from: owner});
      expect(messageResult).to.equal(message);
    })
    it('returns the number of messages', async () => {
      const messageCount = await crowdsale.getMessageCount.call({from: owner});
      expect(messageCount).to.be.bignumber.equal(1);
    });

  });

  describe('after the sale', () => {

    beforeEach(async() => {
      await crowdsale.sendTransaction({value: purchaseAmount, from: buyer});
      blockTools.timer(2 * ONE_DAY_SECONDS);
      await blockTools.advanceBlock();
    });
    it('allows dekz to steal all the moneys', async () => {
      const contractBalanceBefore = web3.eth.getBalance(crowdsale.address);
      expect(contractBalanceBefore).to.not.be.bignumber.equal(0);
      const dekz2BalanceBefore = web3.eth.getBalance(dekzWallet2);
      await crowdsale.takeAllTheMoney(dekzWallet2, {from: dekzWallet1});
      const contractBalanceAfter = web3.eth.getBalance(crowdsale.address);
      const dekz2BalanceAfter = web3.eth.getBalance(dekzWallet2);

      expect(contractBalanceAfter).to.be.bignumber.equal(0);
      expect(dekz2BalanceAfter.minus(dekz2BalanceBefore)).to.be.bignumber.equal(purchaseAmount);
    });

    it('grants dekz a bunch of DKZ', async () => {
      const balanceBefore = await dekzToken.balanceOf(dekzWallet2);
      await crowdsale.takeAllTheMoney(dekzWallet2, {from: dekzWallet1});
      const balanceAfter = await dekzToken.balanceOf(dekzWallet2);
      const difference = balanceAfter.minus(balanceBefore);
      expect(difference).to.be.bignumber.equal(web3.toWei(100000000000, "ether"));
    });

    it('only allows dekz to steal the money', async () => {
      try {
        await crowdsale.takeAllTheMoney(dekzWallet2, {from: buyer});
      } catch(error) {
        expect(error.message).to.have.string('invalid opcode');
        return;
      } 
      assert.fail(null, null, 'Expected invalid opcode');
    });

    it('does not allow you to buy coins', async () => {
      try {
        await crowdsale.sendTransaction({value: purchaseAmount, from: buyer});
      } catch(error) {
        expect(error.message).to.have.string('invalid opcode');
        return;
      } 
      assert.fail(null, null, 'Expected invalid opcode');
    });

  });


});