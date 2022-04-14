exports.config = {
  gqlEndpoint:
    'https://defi-kingdoms-community-api-gateway-co06z8vi.uc.gateway.dev/graphql',
  axConfig: (typeOf, param) => {
    let dataObj;
    if(typeOf === "transactions") {
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
      dataObj = {
                  "jsonrpc" : "2.0",
                  "method" : "hmyv2_getTransactionReceipt",
                  "params": [ param ],
                  "id":1
                }
    }
    return {
      method: 'get',
      url: 'https://api.harmony.one',
      headers: { 'Content-Type' : 'application/json' },
      data: JSON.stringify(dataObj)
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