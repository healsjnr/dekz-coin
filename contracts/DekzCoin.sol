
pragma solidity ^0.4.15;

import 'zeppelin/contracts/token/MintableToken.sol';

contract DekzCoin is MintableToken {
  string public name = "DEKZ COIN";
  string public symbol = "DKZ";
  uint256 public decimals = 18;
}