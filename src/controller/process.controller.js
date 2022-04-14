const { pullTxData, pullTxReceipt } = require ('./api.Controller');
const { decodeTxMethod } = require ('../decode/ethereum.decoder');
const { sortQuestData } = require('../contracts/quest');

/**
 * Fetch and process transaction data from API
 *
 * @param {string=} wallet a wallet hex address
 *    provider (wallet).
 * @return {Promise<Object>} the transaction data with receipts included
 *    
 *    
 */
exports.fetchTxData = async (wallet) => {
  const txData = await pullTxData(wallet);
  const processedData = await processTxData(txData);
  const sortedQuestData = sortQuestData(processedData);
  return processedData;
}

/**
 * pre-process transaction data from API
 *
 * @param {object} rawData Array of transaction data
 *    provider (wallet).
 * @return {Object} the returned data with decoded methods and receipt data included.
 *    
 *    
 */
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

