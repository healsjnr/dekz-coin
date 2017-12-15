# Agent Booking Contract

This is a very naive attempt at creating a contract that models the process of a booking hotel room through an online travel agent. It is entirely meant as an exercise in understanding how to build a smart contract and the complexities that arise. 

The problem self (sounds) relatively straight forward. There are three parties:
  - Customer: The customer who purchases the rooms
  - Agent: The intermediary that provides the booking website
  - Supplier: The hotel providing the hotel rooms

It is assumed that there exists an app that allows customers to browse hotels and offers. This is out of scope of this project. Given this the contract would follow the following stages (effectively states):

  1. Once a customer has selected the particular hotel / room / offer to be booked the agent would creates a `booking` with a unique `id`. The details of the booking consist of
    - `bookingId` the unique id of the booking
    - `bookingValue` the cost of the booking in wei
    - `commissionValue` the commission the agent earns on the booking
    - `customer` the address of the customers wallet
    - `supplier` the address of the suppliers wallet
    - `finalisedAtEpochSeconds` the date at which the booking becomes non-refundable
  2. The customer pays for the booking using the `id` and the `bookingValue` specified
  3. The customer can cancel the booking at any point up to the `finalisedAtEpochSeconds` at which point the `bookingValue` is refunded to the customer
  4. Once the `finalisedAtEpochSeconds` time has past either the agent or the supplier can call `drawDown`. This transfers the `commissionValue` to the agent's wallet and the `bookingValue - commissionValue` to the supplier's wallet.

# Problems

Privacy
  - We have public ledger that includes wallets and values and times for real world events
  - Given 
    - A hotels wallet address was known
    - And you knew that the finalisedAtEpochSeconds represented the check in date (ie.,the booking was refundable up until check in)
  - Then the ledger would tell you where the owner of a particular wallet was going to be in the real world
  
Price volatility
  - The standard crypto-currency volatility problems.
  - Someone could book a room for a stay in a months time, two weeks later the price of ETH has gone up 200%
  - This would then encourage prople to cancel the booking for a refund and then re-book the same room for half the amount in ETH
  - This is fine and means the customer can mitigate the volatility risk (although the amount cancellations and rebookings would probably be a bit of headache)
  - The same is not true for the supplier / agent. If the price of ETH halves in the same period, the supplier / agent have no recourse to cancel the booking and then force the customer to re-book at twice the price.

Real world interaction
  - The practicalities of these wallets synching with the real world inventory systems can't be overlooked. 
  - In a standard OTA, the agent controlls when and how customers can book / cancel / amend. 
  - With a contract, once the token has been created, the customer has the ability to interact with the contract directly. There is no need for them to interact with the OTA website.
  - So in the case of cancellation a customer can create a booking and then cancel it by invoking the contract. There is no guarantee that this change would then be picked up by the supplier and as a result they might be unaware of the cancellation.
  - This could be mitigated using events potentially, but it puts a burden on the supplier or the agent to ensure these events are captured. 

# Future work

## Non-fungible token
In many ways this appears very similar to a non-fungible token. The customer is effectively awarded a token (the bookingId) that is unique (ie., non-fungible). That customer / token has a balance that can be transfered, however, the transfer rules are complex and depend on the state and time at which the transfer occurs.

## IPFS
This contract aims to minimise the amount of data stored against the booking id. This is for two reason, one gas prices and two privacy concerns. It would be intersting to see whehter more useful information about the booking could be stored using IPFS. 

