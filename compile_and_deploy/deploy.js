var fs = require('fs');
let Web3 = require('web3');
let web3 = new Web3();

// set the local provider of block chain
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8080'));


//read ABI
let abi = JSON.parse(fs.readFileSync("../hello_world/HelloWorld.abi" , 'utf-8'));

// read Byte code and make it hexadecimal
let code = '0x' + fs.readFileSync("../hello_world/HelloWorld.code" , 'utf-8');
console.log(code);
// Create Contract proxy class
let SampleContract = web3.eth.contract(abi);

// Unlock the coinbase account to make transactions out of it
console.log("Unlocking coinbase account");
var password = "***********"; // replace * with your password set while creating account
console.log("\naccount : ","\n\n ");
var current_acc = web3.eth.accounts[0]
try {
  web3.personal.unlockAccount(current_acc, password);
} catch(e) {
  console.log(e);
  return;
}


console.log("Deploying the contract");
let contract = SampleContract.new({from: current_acc, gas: 1000000, data: code});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
async function waitBlock() {
  while (true) {
    let receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("Your contract has been deployed at : " + receipt.contractAddress);
      break;
    }
    console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
    await sleep(4000);
  }
}

waitBlock();
