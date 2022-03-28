const etherScanApiKey = "M8ERAJHIX5S5MWKM2EISGC56XUI3Q7B6HD";

const express = require('express');
const unirest = require("unirest");
const abiDecoder = require('abi-decoder');
var Web3 = require('web3');

const app = express();

var log = {};
var logs;
var smartContract;

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

// a sample input from a transaction contract
const inputHex = '0xc855dea30000000000000000000000000000000000000000000000000000000000000060000000000000000000000000e259e8386d38467f0e7ffedb69c3c9c935dfaefc000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000021c89';

const transactionHash = '0x86606a47b515861ec1461353c35f838b672e5f2c64ea336ba759fd303bc75b54'

let decodedDataTwo = abiDecoder.decodeMethod(inputHex);
console.log('>> decoded ABI = ',decodedDataTwo);

var web3 = new Web3('https://api.harmony.one');
const receipt =  web3.eth.getTransactionReceipt(transactionHash).then((res)=>{
  logs = res.logs;
  const decodedLogs = abiDecoder.decodeLogs(logs);
  console.log('>> decoded logs = ',decodedLogs)

  // log = res.logs[0];
  // console.log('>> log = ',log)
  // smartContract = log.address;
  // console.log ('>> address = ', smartContract)

})

app.listen(3001, () => {
  console.log("Server running on port 3000");
 });

// const testABI = [{"inputs": [{"type": "address", "name": ""}], "constant": true, "name": "isInstantiation", "payable": false, "outputs": [{"type": "bool", "name": ""}], "type": "function"}, {"inputs": [{"type": "address[]", "name": "_owners"}, {"type": "uint256", "name": "_required"}, {"type": "uint256", "name": "_dailyLimit"}], "constant": false, "name": "create", "payable": false, "outputs": [{"type": "address", "name": "wallet"}], "type": "function"}, {"inputs": [{"type": "address", "name": ""}, {"type": "uint256", "name": ""}], "constant": true, "name": "instantiations", "payable": false, "outputs": [{"type": "address", "name": ""}], "type": "function"}, {"inputs": [{"type": "address", "name": "creator"}], "constant": true, "name": "getInstantiationCount", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [{"indexed": false, "type": "address", "name": "sender"}, {"indexed": false, "type": "address", "name": "instantiation"}], "type": "event", "name": "ContractInstantiation", "anonymous": false}];
// abiDecoder.addABI(testABI);


//let decodedDataOne = Web3.utils.hexToAscii(hex);
//let decodedDataTwo = abiDecoder.decodeMethod(hex);

//console.log('>> decoded data1: ',decodedDataOne);
//console.log('>> decoded data2: ',decodedDataTwo);


// const { Harmony } = require('@harmony-js/core');

// app.get('/api/v1/dfk-wallet/:wallet', (req, res) => {
//   const request = unirest("GET", "https://twinword-word-associations-v1.p.rapidapi.com/associations/");
//   request.query({ "entry": req.params.word });
//   request.headers({
//     "x-rapidapi-host": "twinword-word-associations-v1.p.rapidapi.com",
//     "x-rapidapi-key": "YOUR_RAPID_API_KEY_GOES_HERE",
//     "useQueryString": true
//   });

//   request.end(function (response) {
//     if (response.error) throw new Error(response.error);

//     res.json(response.body.associations_scored || {});
//   });

// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });




// const {
//   ChainID,
//   ChainType,
//   hexToNumber,
//   numberToHex,
//   fromWei,
//   Units,
//   Unit,
// } = require('@harmony-js/utils');

// const hmy = new Harmony(
//     'https://api.s0.b.hmny.io/',
//     {
//         chainType: ChainType.Harmony,
//         chainId: ChainID.HmyTestnet,
//     },
// );


