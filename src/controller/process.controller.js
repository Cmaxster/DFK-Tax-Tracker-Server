const { pullTxData, pullTxReceipt } = require ('./api.Controller');
const { decodeTxMethod } = require ('../decode/ethereum.decoder');
const { questContract } = require('../contracts/quest.contract');
const { transaction } = require ('./transaction.Controller');

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
  const responseData = buildResponseObject();
  return responseData;
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
  
  const result = Promise.all(rawData.transactions.map(async (tx, index) => {
    console.log(`>> [process.controller] [${index}] processing tx ${tx.ethHash}`)
    tx.receipt = await pullTxReceipt(tx.ethHash);
    tx.method = await decodeTxMethod(tx.input);
    return tx;
  }));
  
  return result;
}

/**
 * Build a transaction to be returned
 *
 * @return {Object} the returned data with sorted data
 *    
 *    
 */
const buildResponseObject = (processedData) => {
  rObj = [];
  processedData.forEach((tx, i) => {
    const handleTransaction = {
      'CompleteQuest': (tx) => questContract.completedQuestHandler(tx),
      'default': (tx) => transaction.defaultHandler(tx)
    };

    let txCollection = handleTransaction[tx.method](tx) || handleTransaction['default'](tx); //returns an array!
    txCollection.forEach((tx) => rObj.push(tx));
  })
}