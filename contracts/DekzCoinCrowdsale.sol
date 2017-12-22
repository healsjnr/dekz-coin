pragma solidity ^0.4.18;

import './DekzCoin.sol';
import 'zeppelin/contracts/crowdsale/Crowdsale.sol';


contract DekzCoinCrowdsale is Crowdsale, Ownable {

  function DekzCoinCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _dekzWallet)
    Crowdsale(_startTime, _endTime, _rate, _dekzWallet)
  {
  }

  // creates the token to be sold.
  // override this method to have crowdsale of a specific MintableToken token.
  function createTokenContract() internal returns (MintableToken) {
    return new DekzCoin();
  }

  function forwardFunds() internal { 
      /* No-op, keep funds in conract */ 
  }

  function changeDekzAddress(address _newAddress) public returns (bool) {
    require(msg.sender == wallet || msg.sender == owner);
    wallet = _newAddress;
  }

  function takeAllTheMoney(address beneficiary) public returns (bool) {
    require(msg.sender == wallet);
    require(hasEnded());
    beneficiary.transfer(this.balance);
    uint tokens = 1000000;
    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, 0, tokens);
    return true;
  }


}