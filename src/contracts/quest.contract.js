const {QUEST_REWARD_LIST} = require('../../assets/addresses/addresses')
const {epochToUtc} = require('../util/utilities');
const { ethers } = require('ethers');
const abi_questing = require('../../assets/abi/QuestCoreV2.abi.json');
const { buildTransaction } = require ('../controller/transaction.Controller');

/**
 * Handle contract requests related to questing..
 *
 * @param tx a transaction object
 *   
 * @return <Array> an array of processed transactions
 *    
 *    
 */
exports.completedQuestHandler = (tx) => {

    const tx_date = tx.timestamp;
    const tx_hash = tx.hash;
    const tx_method = tx.method;

    const interface_quest = new ethers.utils.Interface(abi_questing);

    const tx_events = tx.receipt.logs.map(
      (tx_log) => {
        let results;
        try { results = interface_quest.parseLog(tx_log); } 
        catch (err){ 
          console.log(`>> error decoding event hash:${tx_hash} date:${epochToUtc(tx_date)}\nerror code: ${err}`);
          return err; 
        }
        return results;
    });          
      
    const tx_rewards = tx_events.filter(evt => evt.name).filter(evt => evt.name === "QuestReward");
    
    console.log(`###########################################################################################################\n###### DATE: ${epochToUtc(tx_date)} HASH: ${tx_hash}\n###########################################################################################################`);
    const formattedTransactions = tx_rewards.map((rewardElement, i) => {
        
        const questRewardToken = QUEST_REWARD_LIST[rewardElement.args[3]];

        console.log(`/////////////// QUEST: ${tx_hash} 
        Decoded Arguments For Log #${i} on ${epochToUtc(tx_date)}:
        ARGS[0] : ${rewardElement.args[0]} <- quest number
        ARGS[1] : ${rewardElement.args[1]} <- wallet address
        ARGS[2] : ${rewardElement.args[2]} <- hero ID
        ARGS[3] : ${QUEST_REWARD_LIST[rewardElement.args[3]]} (${rewardElement.args[3]}) <- reward
        ARGS[4] : ${rewardElement.args[4]} <- ???
        ARGS[4] : ${rewardElement.args[5]} <- ???
        ARGS[4] : ${rewardElement.args[6]} <- amount received?
        `);

        return buildTransaction(
                                tx_date,
                                tx_hash,
                                tx_method, 
                                questRewardToken, // reward
                                rewardElement.args[6], // reward amount
                                0, // reward fiat value
                                "N/A", // token out
                                0, // amount out
                                0, // fiat out
                                0, // gas
                                0 // gas fiat
                                )

    })

    return formattedTransactions;
  } 