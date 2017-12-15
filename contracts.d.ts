import * as Web3 from "web3";
import * as BigNumber from "bignumber.js";

type Address = string;
type TransactionOptions = Partial<Transaction>;
type UInt = number | BigNumber.BigNumber;

interface Transaction {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: Address | ContractInstance;
  to: string | null;
  value: UInt;
  gasPrice: UInt;
  gas: number;
  input: string;
}

interface ContractInstance {
  address: string;
  sendTransaction(options?: TransactionOptions): Promise<void>;
}

export interface BasicTokenInstance extends ContractInstance {
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  balanceOf(
    owner: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
}

export interface BookingInstance extends ContractInstance {
  drawDown(bookingId: UInt, options?: TransactionOptions): Promise<boolean>;
  getBalance(
    unnamed0: UInt,
    options?: TransactionOptions
  ): Promise<
    [
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      Address,
      Address,
      BigNumber.BigNumber
    ]
  >;
  bookings(
    unnamed1: UInt,
    unnamed2: Address,
    commissionValue: UInt,
    customer: Address,
    supplier: Address,
    finalisedAtEpochSeconds: UInt,
    options?: TransactionOptions
  ): Promise<
    [
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      Address,
      Address,
      BigNumber.BigNumber
    ]
  >;
  balances(
    unnamed3: UInt,
    unnamed4: Address,
    commissionValue: UInt,
    customer: Address,
    supplier: Address,
    finalisedAtEpochSeconds: UInt,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  createBooking(
    bookingId: UInt,
    bookingValue: UInt,
    commissionValue: UInt,
    customer: Address,
    supplier: Address,
    finalisedAtEpochSeconds: UInt,
    options?: TransactionOptions
  ): Promise<
    [
      boolean,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      Address,
      Address,
      BigNumber.BigNumber
    ]
  >;
  bookingProvider(
    bookingId: UInt,
    options?: TransactionOptions
  ): Promise<
    [
      Address,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      Address,
      Address,
      BigNumber.BigNumber
    ]
  >;
  getBookingDetails(
    bookingId: UInt,
    options?: TransactionOptions
  ): Promise<
    [
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      BigNumber.BigNumber,
      Address,
      Address,
      BigNumber.BigNumber
    ]
  >;
  balanceOf(
    bookingId: UInt,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  payForBooking(
    bookingId: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
}

export interface CrowdsaleInstance extends ContractInstance {
  rate(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  endTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  weiRaised(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  wallet(options?: TransactionOptions): Promise<Address>;
  startTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  buyTokens(beneficiary: Address, options?: TransactionOptions): Promise<void>;
  hasEnded(options?: TransactionOptions): Promise<boolean>;
  token(options?: TransactionOptions): Promise<Address>;
}

export interface DekzCoinInstance extends ContractInstance {
  mintingFinished(options?: TransactionOptions): Promise<boolean>;
  name(options?: TransactionOptions): Promise<string>;
  approve(
    spender: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  transferFrom(
    from: Address,
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  decimals(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  mint(
    to: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  decreaseApproval(
    spender: Address,
    subtractedValue: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  balanceOf(
    owner: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  finishMinting(options?: TransactionOptions): Promise<boolean>;
  owner(options?: TransactionOptions): Promise<Address>;
  symbol(options?: TransactionOptions): Promise<string>;
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  increaseApproval(
    spender: Address,
    addedValue: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>;
}

export interface DekzCoinCrowdsaleInstance extends ContractInstance {
  rate(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  endTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  weiRaised(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  wallet(options?: TransactionOptions): Promise<Address>;
  startTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  buyTokens(beneficiary: Address, options?: TransactionOptions): Promise<void>;
  hasEnded(options?: TransactionOptions): Promise<boolean>;
  token(options?: TransactionOptions): Promise<Address>;
}

export interface ERC20Instance extends ContractInstance {
  approve(
    spender: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  transferFrom(
    from: Address,
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  balanceOf(
    who: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
}

export interface ERC20BasicInstance extends ContractInstance {
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  balanceOf(
    who: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
}

export interface MigrationsInstance extends ContractInstance {
  upgrade(new_address: Address, options?: TransactionOptions): Promise<void>;
  last_completed_migration(
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  owner(options?: TransactionOptions): Promise<Address>;
  setCompleted(completed: UInt, options?: TransactionOptions): Promise<void>;
}

export interface MintableTokenInstance extends ContractInstance {
  mintingFinished(options?: TransactionOptions): Promise<boolean>;
  approve(
    spender: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  transferFrom(
    from: Address,
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  mint(
    to: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  decreaseApproval(
    spender: Address,
    subtractedValue: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  balanceOf(
    owner: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  finishMinting(options?: TransactionOptions): Promise<boolean>;
  owner(options?: TransactionOptions): Promise<Address>;
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  increaseApproval(
    spender: Address,
    addedValue: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>;
}

export interface OwnableInstance extends ContractInstance {
  owner(options?: TransactionOptions): Promise<Address>;
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>;
}

export interface SafeMathInstance extends ContractInstance {}

export interface StandardTokenInstance extends ContractInstance {
  approve(
    spender: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  transferFrom(
    from: Address,
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  decreaseApproval(
    spender: Address,
    subtractedValue: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  balanceOf(
    owner: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  increaseApproval(
    spender: Address,
    addedValue: UInt,
    options?: TransactionOptions
  ): Promise<boolean>;
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
}
