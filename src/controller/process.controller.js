const { pullTxData, pullTxReceipt } = require ('./api.controller');
const { decodeTxMethod } = require ('../decode/ethereum.decoder');
const questContract = require('../contracts/quest.contract');
const transaction = require ('./transaction.controller');

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
  const responseData = await buildResponseObject(processedData);
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
const buildResponseObject = async (processedData) => {
  const rObj = [];
  processedData.forEach((tx, i) => {
    //console.log(tx);
    const handleTransaction = {
      completeQuest: (tx) => questContract.completedQuestHandler(tx),
      default: (tx) => transaction.defaultHandler(tx)
    };
    console.log('>> [process.controller] (buildResponseObject) tx.method = ',tx.method.name)
    let txCollection = handleTransaction[tx.method.name] ? handleTransaction[tx.method.name](tx) : handleTransaction['default'](tx); //returns an array!
    txCollection.forEach((tx) => rObj.push(tx));
  })
  return rObj;
}