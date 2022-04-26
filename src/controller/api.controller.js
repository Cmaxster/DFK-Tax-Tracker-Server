const axios = require("axios");
const axiosRetry = require('axios-retry');
const {config} = require('../config');

//use to speed up testing:
const savedData = require('../../assets/sample_wallet_data.json');

axiosRetry(axios, config.getRetryConfig());

/**
 * Fetch transaction data from API
 *
 * @param {string=} wallet a wallet hex address
 *    provider (wallet).
 * @return {Promise<Object>} the transaction data
 *    
 *    
 */
exports.pullTxData = async (wallet) => {
  return axios(config.axConfig('transactions', wallet))
  .then(function(response) { return response.data.result })
  .catch(function (error) {
    console.log(">> [Api.controller] encountered an error when fetching transactions: ",error);
    return error;
  });
}

exports.pullTxReceipt = async (txHash) => {
  return axios(config.axConfig('receipts', txHash))
  .then(function (response) {
    console.log(`>> [Api.controller] successfully pulled tx:${txHash}`); 
    return response.data.result; 
  })
  .catch(function (error) {
    console.log(`>> [Api.controller] There was an error pulling TX reciept for tx:${txHash} \n${error}`);
    return error;
  })
};

exports.pullCoinPrice = async (coinCode, epochSeconds) => {
  return axios(config.axConfig('coin_price', {coin:coinCode, date:epochToDDMMYYYY(epochSeconds)}))
  .then(function(response) { return response.data.result })
  .catch(function (error) {
    console.log(">> [Api.controller] encountered an error when fetching coin price: ",error);
    return error;
  });
  //https://api.coingecko.com/api/v3/coins/{0}/history?date={1}&localization=false
}


  