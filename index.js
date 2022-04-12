const express = require('express');
const axios = require("axios");
const axiosRetry = require('axios-retry');
const abiDecoder = require('abi-decoder');
const { ethers } = require("ethers");
const cors = require('cors');
const {getProvider, getContractQuest } = require('./ethereum');

const app = express();
app.use(cors()) // cross domain policy

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

var completedQuests = [];

axiosRetry(axios, {
  retries: 10, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2500; // time interval between retries
  }
});

// decode an isolated piece of a transaction
app.get("/decode/:hex", (req, res, next) => {
  let decodedData = abiDecoder.decodeMethod(req.params.hex);
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
    .then(async function(response) {
      console.log('>> Axios get transactions SUCCESS --! ');
      const transactionData = await processTxData(response.data.result); 
      console.log('>> transactionData after processing : ',transactionData[0]);
      console.log('>> Completed Quests: ', completedQuests.length);


      // testing log decode method
      const ifaceQuest = new ethers.utils.Interface(QuestCoreV2Abi);
      const questEvent = completedQuests[0].receipt.logs[0];
      try {
        // run through all the logs of a quest complete event to see if anything can be decoded..
        const decodedEvents = completedQuests[0].receipt.logs.map(
          (compQuest, index) => {
            let results;
            try {
              results = ifaceQuest.parseLog(compQuest);  
              console.log(`>> success! quest event decoded as follows: ${JSON.stringify(results)}`)

            } catch (err){
              console.log(`>> Error! Could not parse log for QuestEvent #${index}`)
              return err;
            }
            return result;
          }
        )
        console.log(`
        ////////////////////////////////////////////////////////////////////////////////////////
        >> Decoded quest log test: ${decodedEvents}`);
        try{
          const questRewards = Object.entries(results) // .filter([key, value]);
          
          //results.filter(result => Object.keys(result) === 'QuestReward');

          /* const result = Object.entries(data)
            .filter(([key, value]) => key.endsWith('A'))
            .map(([key, value]) => value)
            console.log(result) // [{id: 'idA', markdown: 'markdownA'}]
          */

          console.log(`////////////////////////////////////////////////////////////////////////////
          Quest Rewards = ${questRewards}`)

        }catch(err){
          console.log(`///////////////////////////////////////////////////////////////////////////
          >> Error! could not filter quest rewards.. Error:${err}
          `);
        }
      } catch (err) {
        console.log(`
        >> something went wrong when attempting to decode quest log..
        
        >> error logged as: ${err}

        `)
      }


      res.send(transactionData);
    }).catch(function (error) {
      console.log(">> Axios encountered an error when fetching transactions: ",error);
      return error;
    });
    
})

// process data.. add receipt to transaction data..
const processTxData = async (rawData) => {
  console.log('>> Attempting to process data..');
  processedData = [...rawData.transactions];

  // run through all the transactions, query API for receipts, and convert data to human readable format
  const result = Promise.all(processedData.map(async (tx, index) => {
    console.log(`>> [${index}] processing tx ${tx.ethHash}`)
    tx.receipt = await pullTxReceipt(tx.ethHash);
    tx.method = await abiDecoder.decodeMethod(tx.input);
    try { //try to gather up all the completed quest transactions..
      if(tx.method){
        if(tx.method.name === "completeQuest") {
          console.log(`>> [${index}] Quest Transaction Identified..'`)
          completedQuests.push(tx)
        }
      }
    } catch (err) {
      console.log(`>> [${index}] there was a problem reading tx.method ${err}. transaction data:${tx}`)
    }
    return tx;
  }));
  return result;
}

// pull a transaction receipt from API
const pullTxReceipt = async (txHash) => {
  return axios({
    method: 'get',
    url: 'https://api.harmony.one',
    headers: { 'Content-Type' : 'application/json' },
    data: JSON.stringify({
      "jsonrpc" : "2.0",
      "method" : "hmyv2_getTransactionReceipt",
      "params": [ txHash ],
      "id":1
      })
    })
    .then(function (response) { 
      //console.log('>> Get Transaction data response ', response.data.result.logs[0]);
      //console.log('//////////////////////////////////////////////////////////')
      return response.data.result; 
    })
    .catch(function (error) {
      //console.log('>> There was an error pulling TX reciept:',txHash,' :',error);
      return error;
    })
};

// listen for calls..
app.listen(3001, () => {
  console.clear();
  console.log("Server running on port 3001");

 });
 