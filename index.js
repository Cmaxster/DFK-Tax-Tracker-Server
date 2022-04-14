const express = require('express');
const cors = require('cors');
const {fetchTxData} = require ('./src/controller/process.controller');

const app = express();
app.use(cors()); // cross domain policy

// app.get("/decode/:hex", (req, res, next) => {})

app.get("/transactions/:address", async (req, res, next) => {
  const preparedData = await fetchTxData(req.params.address);
  console.log(`>> [index] successfully pulled ${preparedData.length} transactions!!`)
  res.send(preparedData);
})

app.listen(3001, () => {
  console.clear();
  console.log("Server running on port 3001");
 });
 