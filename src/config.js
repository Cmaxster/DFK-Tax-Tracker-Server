exports.config = {
  gqlEndpoint:
    'https://defi-kingdoms-community-api-gateway-co06z8vi.uc.gateway.dev/graphql',
  localizations: [
    {country:"canada", currency:"cad"},
    {country:"united states", currency:"usd"}
  ],
  axConfig: (typeOf, param) => {
    let dataObj;
    let endpoint;
    if(typeOf === "transactions") {
      url = "https://api.harmony.one";
      dataObj = {
                  "jsonrpc": "2.0",
                  "method": "hmyv2_getTransactionsHistory",
                  "params": [{
                    "address": param,
                    "pageIndex": 0,
                    "pageSize": 1000,
                    "fullTx": true,
                    "txType": "ALL",
                    "order": "DESC"
                  }],
                  "id": 1
                }
    } else if(typeOf === "receipts") {
      url = "https://api.harmony.one";
      dataObj = {
                  "jsonrpc" : "2.0",
                  "method" : "hmyv2_getTransactionReceipt",
                  "params": [ param ],
                  "id":1
                }
    } else if(typeOf === "coin_price") {
      url = `https://api.coingecko.com/api/v3/coins/${param.coin}/history?date=${param.date}&localization=false`;
      console.log(`>> coin fetch url = https://api.coingecko.com/api/v3/coins/${param.coin}/history?date=${param.date}&localization=false`);
      dataObj = null;
    }
    if(dataObj){
      return {
        method: 'get',
        url: endpoint,
        headers: { 'Content-Type' : 'application/json' },
        data: JSON.stringify(dataObj)
      }
    } else {
      return { method: 'get', url: endpoint, headers: { 'Content-Type' : 'application/json' } }
    }
  },
  getRetryConfig: () => {
    const retryConfig = {
        retries: 10, // number of retries
        retryDelay: (retryCount) => {
          console.log(`retry attempt: ${retryCount}`);
          return retryCount * 2500; // time interval between retries
        }
      }
    return retryConfig;
  }
};