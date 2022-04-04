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
  var transactionData;
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
      transactionData = response.data.result;
      processTxData(response.data.result);
      res.send(transactionData);
    }).catch(function (error) {
      console.log(">> Error axios get transactions: ",error);
      return;
    });
    
})
 
// retrieve a transaction receipt
/*
app.get("/receipt/:transaction", (req, res, next) => {
  console.log ('///////////////////////////////////////////////////////////////')
  console.log('>> received receipt request for tx: ',req.params.transaction)

  var receiptData;
  // call to the BlockChain API
  axios({
    method: 'post',
    url: 'https://api.harmony.one',
    headers: { 'Content-Type' : 'application/json' },
    data: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "hmy_getTransactionReceipt",
        "params": [req.params.transaction],
        "id": 1
      })
    })
    .then(function (response) {
      console.log(">> transaction receipt call successful, data retrieved: ",response.data.result)
      receiptData = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  res.send(receiptData);
 })
*/

app.listen(3001, () => {
  console.log("Server running on port 3001");
 });

 var receiptCalls = [];

const processTxData = async (rawData) => {
  console.log('>> Attempting to process data..');
  processedData = [...rawData.transactions];
  console.log('>> Processed data [0] = ',processedData[0]);



  const result = await Promise.all(processedData.map(async (tx) => {
    tx.receipt = await pullTxReceipt(tx.ethHash);
    return tx;
  }));
  return result;

  console.log('>> After Processed data [0] = ',processedData[0].receipt);

}

const pullRxReceipts = () => {
  return Promise.all()

}

const pullTxReceipt = (txHash) => {
  return axios({
    method: 'post',
    url: 'https://api.harmony.one',
    headers: { 'Content-Type' : 'application/json' },
    data: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "hmy_getTransactionReceipt",
        "params": txHash,
        "id": 1
      })
    })
    .then(function (response) {
      //console.log('response.data.result = ',response.data)
      return response.data;  
    })
    .catch(function (error) {
      console.log('>> There was an error pulling TX reciept..');
      return error;
    })
};




/*

let URLs= ["https://jsonplaceholder.typicode.com/posts/1", "https://jsonplaceholder.typicode.com/posts/2", "https://jsonplaceholder.typicode.com/posts/3"]

function getAllData(URLs){
  return Promise.all(URLs.map(fetchData));
}

function fetchData(URL) {
  return axios
    .get(URL)
    .then(function(response) {
      return {
        success: true,
        data: response.data
      };
    })
    .catch(function(error) {
      return { success: false };
    });
}

getAllData(URLs).then(resp=>{console.log(resp)}).catch(e=>{console.log(e)})

*/



 