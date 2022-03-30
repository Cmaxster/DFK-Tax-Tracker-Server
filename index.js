const express = require('express');
const unirest = require("unirest");
const abiDecoder = require('abi-decoder');
var Web3 = require('web3');
var cors = require('cors');

const app = express();
const web3 = new Web3('https://api.harmony.one');

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
//const transactionHash = '0x86606a47b515861ec1461353c35f838b672e5f2c64ea336ba759fd303bc75b54'
//console.log('>> decoded ABI = ',decodedDataTwo);

app.get("/decode/:transaction", (req, res, next) => {
  console.log ('///////////////////////////////////////////////////////////////')
  console.log('>> received request : ',req.params.transaction)
  let decodedData = abiDecoder.decodeMethod(req.params.transaction);
  console.log('>> decoded request: ',decodedData)
  res.send(decodedData);
 })
  
  // const receipt =  web3.eth.getTransactionReceipt(transactionHash).then((res)=>{
  //   let logs = res.logs;
  //   const decodedLogs = abiDecoder.decodeLogs(logs);
  //   console.log('>> decoded logs = ',decodedLogs)
    
  // log = res.logs[0];
  // console.log('>> log = ',log)
  // smartContract = log.address;
  // console.log ('>> address = ', smartContract)

  // })

app.listen(3001, () => {
  console.log("Server running on port 3001");
 });
