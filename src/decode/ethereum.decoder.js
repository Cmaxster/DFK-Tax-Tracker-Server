/**
 * @fileoverview Ethereum 
 */

const { ethers } = require('ethers');
const { QUEST_CONTRACT } = require('../../assets/addresses/addresses');
const abiDecoder = require('abi-decoder');

// Defi Kingdoms API definitions
const abiQuest = require('../../assets/abi/QuestCoreV2.abi.json');
const HeroesAbi = require('../../assets/abi/Heroes.abi.json');
const BankAbi = require('../../assets/abi/Bank.abi.json');
const ERC20Abi = require('../../assets/abi/ERC20.abi.json');
const ERC721Abi = require('../../assets/abi/ERC721.abi.json');
const HeroSaleAbi = require('../../assets/abi/HeroSale.abi.json');
const HSUAbi = require('../../assets/abi/HeroSummoningUpgradeable.abi.json');
const MasterGardenerAbi = require('../../assets/abi/MasterGardener.abi.json');
const MeditationCircleAbi = require('../../assets/abi/MeditationCircle.abi.json');
const QuestCoreV2Abi = require('../../assets/abi/QuestCoreV2.abi.json');
const SaleAuctionAbi = require('../../assets/abi/SaleAuction.abi.json');
const USV2FAbi = require('../../assets/abi/UniswapV2Factory.abi.json');
const JewelAbi = require('../../assets/abi/Jewel.abi.json');
const ProfileAbi = require('../../assets/abi/Profile.abi.json');
const USV3Abi = require('../../assets/abi/UniswapV3.abi.json');
const USV2Router = require('../../assets/abi/IUniswapV2Router02.abi.json');

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


//get provider object, private key is optional..
exports.getProvider = async (optPrivKey) => {
  const getProvider = async () => provider = new ethers.providers.JsonRpcProvider('https://api.harmony.one/');
  const currentRPC = await getProvider();

  if (optPrivKey) {
      const signerRpc = exports._getSigner(currentRPC, optPrivKey);
      return signerRpc;
    }
  
  return currentRPC;
  
}

// if private key available get signer RPC
exports._getSigner = (currentRPC, privKey) => {
  const signerRpc = {
    name: currentRPC.name,
    provider: currentRPC.provider,
    lastBlockMined: currentRPC.lastBlockMined,
    isSigner: true,
    signer: new ethers.Wallet(privKey, currentRPC.provider),
  };
  return signerRpc;
};

exports.providerError = async () => {};

/**
 * Get the Quest contract.
 *
 * @param {Object} currentRPC The current RPC to get the contract for.
 * @return {Object} An ethers.js contract instance.
 */
 exports.getContractQuest = (currentRPC) => {
  const { provider } = currentRPC;
  const contract = new ethers.Contract(
    QUEST_CONTRACT,
    abiQuest,
    provider,
  );
  return contract;
};


exports.decodeTxMethod = (methodHex) => {// req.params.hex
  let decodedTx = abiDecoder.decodeMethod(methodHex);
  if(decodedTx === undefined) decodedTx = {name:'default'};
  return decodedTx;
}

// const ifaceConsumable = new ethers.utils.Interface(consumableAbi);
// const itemConsumedEvent = itemConsumedEventFix();
// const dec = ifaceConsumable.parseLog(itemConsumedEvent);