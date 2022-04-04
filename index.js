const express = require('express');
const unirest = require("unirest");
const axios = require("axios");
const abiDecoder = require('abi-decoder');
var Web3 = require('web3');
var cors = require('cors');

const app = express();

// Defi Kingdoms API definitions
const HeroesAbi = require('./assets/abi/Heroes.abi.json');
const BankAbi = require('./assets/abi/Bank.abi.json');
const ERC20Abi = require('./assets/abi/ERC20.abi.json');
const ERC721Abi = require('./assets/abi/ERC721.abi.json');
const HeroSaleAbi = require('./assets/abi/HeroSale.abi.json');
const HSUAbi = require('./assets/abi/HeroSummoningUpgradeable.abi.json');
const MasterGardenerAbi = require('./assets/abi/MasterGardener.abi.json');
const MeditationCircleAbi = require('./assets/abi/MeditationCircle.abi.json');
const QuestCoreV2Abi = require('./assets/abi/QuestCoreV2.abi.json');
const SaleAuctionAbi = require('./assets/abi/SaleAuction.abi.json');
const USV2FAbi = require('./assets/abi/UniswapV2Factory.abi.json');
const JewelAbi = require('./assets/abi/Jewel.abi.json');
const ProfileAbi = require('./assets/abi/Profile.abi.json');
const USV3Abi = require('./assets/abi/UniswapV3.abi.json');
const USV2Router = require('./assets/abi/IUniswapV2Router02.abi.json');

app.use(cors()) // cross domain policy

// Load up ABIs
abiDecoder.addABI(HeroesAbi);
abiDecoder.addABI(BankAbi);
abiDecoder.addABI(ERC20Abi);
abiDecoder.addABI(ERC721Abi);
abiDecoder.addABI(HeroSaleAbi);
abiDecoder.addABI(HSUAbi);
abiDecoder.addABI(MasterGardenerAbi);
abiDecoder.addABI(MeditationCircleAbi);
abiDecoder.addABI(QuestCoreV2Abi);
abiDecoder.addABI(SaleAuctionAbi);
abiDecoder.addABI(USV2FAbi);
abiDecoder.addABI(JewelAbi);
abiDecoder.addABI(ProfileAbi);
abiDecoder.addABI(USV3Abi);
abiDecoder.addABI(USV2Router);

var processedData = {};

// decode an isolated piece of a transaction
app.get("/decode/:hex", (req, res, next) => {
  //console.log ('///////////////////////////////////////////////////////////////')
  //console.log('>> received request : ',req.params.hex)
  let decodedData = abiDecoder.decodeMethod(req.params.hex);
  //console.log('>> decoded request: ',decodedData)
  res.send(decodedData);
})

// pull wallet transactions
app.get("/transactions/:address", (req, res, next) => {
  axios({
    method: 'post',
    url: 'https://api.harmony.one',
    headers: { 'Content-Type' : 'application/json' },
    data: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "hmyv2_getTransactionsHistory",
        "params": [{
          "address": req.params.address,
          "pageIndex": 0,
          "pageSize": 1000,
          "fullTx": true,
          "txType": "ALL",
          "order": "DESC"
        }],
        "id": 1
      })
    })
    .then(function (response) {
      console.log('>> Axios get transactions SUCCESS --! ');
      const transactionData = await processTxData(response.data.result); 
      // await throwing error  'await is only valid in async function', but processTxData is async.. what's happening here?
      // my  understanding is res.send won't execute until promise is passed and await is cleared, seems to be executing immediately..
      console.log('>> transactionData after processing : ',transactionData[0]) //console logging 'undefined' even though I have a lot of 'await' in place
      res.send(transactionData);
    }).catch(function (error) {
      console.log(">> Axios encountered an error when fetching transactions: ",error);
      return error;
    });
    
})

const processTxData = async (rawData) => {
  console.log('>> Attempting to process data..');
  processedData = [...rawData.transactions];
  console.log('>> Processed data [0] = ',processedData[0]);

  // pull all the transactions, query API for receipts, and watch for result
  // should be waiting?.. "await"
  const result = await Promise.all(processedData.map(async (tx) => {
    tx.receipt = await pullTxReceipt(tx.ethHash);
    return tx;
  }));
  return result;
}

const pullTxReceipt = (txHash) => {
  return axios({
    method: 'post',
    url: 'https://api.harmony.one',
    headers: { 'Content-Type' : 'application/json' },
    data: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "hmyv2_getTransactionReceipt",
        "params": [txHash],
        "id": 1
      })
    })
    .then(function (response) { return response.data; })
    .catch(function (error) {
      console.log('>> There was an error pulling TX reciept:',txHash,' :',error);
      return error;
    })
};

app.listen(3001, () => {
  console.log("Server running on port 3001");
 });
 

// var data = JSON.stringify({
//   "jsonrpc": "2.0",
//   "id": 1,
//   "method": "hmyv2_getTransactionReceipt",
//   "params": [
//     "0xd324cc57280411dfac5a7ec2987d0b83e25e27a3d5bb5d3531262387331d692b"
//   ]
// });

// var config = {
//   method: 'get',
//   url: 'https://api.harmony.one',
//   headers: { 
//     'Content-Type': 'application/json', 
//     'Cookie': 'DO-LB="MTAuMTE2LjAuOTo4NTAw"'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });
