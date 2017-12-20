interface BlockInfo {
  number: number;
  timestamp: number;
}

export function latestBlockNumber(): number {
  return latestBlock().number;
}

export function latestBlockTime(): number {
  return latestBlock().timestamp;
}

export async function advanceBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        id: Date.now()
      },
      (err, res) => {
        return err ? reject(err) : resolve(res);
      }
    );
  });
}

export async function timer(s: any) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [s], // 60 seaconds, may need to be hex, I forget
        id: Math.floor(Math.random() * 10000000) // Id of the request; anything works, really
      },
      function(err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

function latestBlock(): BlockInfo {
  const latestBlock = web3.eth.getBlock("latest");

  if (latestBlock && latestBlock.number && latestBlock.timestamp) {
    return {
      number: latestBlock.number,
      timestamp: latestBlock.timestamp
    }
  } else {
    throw `Expected web3.eth.getBlock to return a block object but got ${latestBlock}`;
  }
}