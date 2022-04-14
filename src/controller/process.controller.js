const { pullTxData, pullTxReceipt } = require ('./api.Controller');
const { decodeTxMethod } = require ('../decode/ethereum.decoder');
const { sortQuestData } = require('../contracts/quest');

exports.fetchTxData = async (wallet) => {
  const txData = await pullTxData(wallet);
  const processedData = await processTxData(txData);
  const sortedQuestData = sortQuestData(processedData);
  return processedData;
}

const processTxData = async (rawData) => { 
  
  console.log('>> [process.controller] pre-processing raw data..');
  
  const result = Promise.all(rawData.transactions.map(async (tx, index) => {
    console.log(`>> [process.controller] [${index}] processing tx ${tx.ethHash}`)
    tx.receipt = await pullTxReceipt(tx.ethHash);
    tx.method = await decodeTxMethod(tx.input);
    return tx;
  }));
  
  return result;
}

