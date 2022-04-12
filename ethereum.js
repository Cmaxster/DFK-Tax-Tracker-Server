/**
 * @fileoverview Ethereum 
 */

const { ethers } = require('ethers');
const { QUEST_CONTRACT } = require('./assets/addresses/addresses');
const abiQuest = require('./assets/abi/QuestCoreV2.abi.json');

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


// const ifaceConsumable = new ethers.utils.Interface(consumableAbi);
// const itemConsumedEvent = itemConsumedEventFix();
// const dec = ifaceConsumable.parseLog(itemConsumedEvent);