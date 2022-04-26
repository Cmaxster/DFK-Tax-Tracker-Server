/**
 * Handle transaction generation
 * @param {date} tx_date - the date of the transaction (epoch format)
 * @param {string} tx_hash - the hash code of the transaction
 * @param {string} tx_method - the method run by the transaction contract (used to categorize)
 * @param {string} intoWalletToken - the type of token aquired
 * @param {number} intoWalletAmount - the amount of token aquired 
 * @param {number} intoWalletFiat - the amount of token aquired expressed in fiat dollars (default:USD)
 * @param {string} outOfWalletToken - the type of token disposed
 * @param {number} outOfWalletAmount - the amount of token disposed 
 * @param {number} outOfWalletFiat - the amount of token disposed expressed in fiat dollars (default:USD)
 * @param {number} gasFee - the amount of gas paid in native token ($ONE)
 * @param {number} gasFeeFiat - gas fee expressed in fiat (default:USD)
 *     
 */
exports.buildTransaction = (
    tx_date,
    tx_hash,
    tx_method,
    intoWalletToken,
    intoWalletAmount,
    intoWalletFiat,
    outOfWalletToken,
    outOfWalletAmount,
    outofWalletFiat,
    gasFee,
    gasFeeFiat
) => {
    const builtTransaction = {
        date: tx_date,
        hash: tx_hash || "N/A",
        method:tx_method || "N/A",
        tokenIn: intoWalletToken || "N/A",
        inVal: intoWalletAmount || null,
        intoFiat: intoWalletFiat || null,
        tokenOut: outOfWalletToken || null,
        outVal: outOfWalletAmount || null,
        outFiat: outofWalletFiat || null,
        gasFee: gasFee || "N/A",
        gassFiat: gasFeeFiat || null
    }
    return builtTransaction;
}

exports.defaultHandler = (tx) => {
    const defaultBuild = [this.buildTransaction(tx.timestamp, tx.hash, tx.method, "N/A", 0, 0, "N/A", 0, 0, tx.receipt.gasUsed, 0)]
    return defaultBuild;
} 