const {QUEST_REWARDS} = require('../../assets/addresses/addresses')
const {epochToUtc} = require('../util/utilities');
const { ethers } = require('ethers');
const QuestCoreV2Abi = require('../../assets/abi/QuestCoreV2.abi.json');

exports.sortQuestData = (data) => {

    let completedQuests = data.filter(tx => tx.method).filter(tx => tx.method.name === "completeQuest")
  
    console.log(`>> [contract/quest] (sortQuestData) Completed Quests Array length is ${completedQuests.length}`)
  
    const ifaceQuest = new ethers.utils.Interface(QuestCoreV2Abi);
      try { //try to decode quests
      const decodedQuests = completedQuests.map((completedQuest, i) => {
        var txDate = completedQuest.timestamp,
            txHash = completedQuest.hash;
          
        const decodedEvents = completedQuest.receipt.logs.map(
          (compQuestEvt) => {
            let results;
            try { results = ifaceQuest.parseLog(compQuestEvt); } 
            catch (err){ 
              console.log(compQuestEvt)
              console.log(`>> error decoding event #${i} hash:${txHash} date:${epochToUtc(txDate)}\nerror code: ${err}`)
              return err; 
            }
            return results;
          }
        ) // decodedEvents map end
          
        const questRewards = decodedEvents.filter(evt => evt.name).filter(evt => evt.name === "QuestReward")
          
          console.log(`###########################################################################################################
  ###### QUEST #: ${i} DATE: ${epochToUtc(txDate)} HASH: ${txHash}      
  ###########################################################################################################`);
  
          //console.log('>> Quest Reward Events: ',questRewards)
          questRewards.forEach((rewardElement, i) => {
            console.log(`/////////////// QUEST: ${txHash} 
          Decoded Arguments For Log #${i} on ${epochToUtc(txDate)}:
            ARGS[0] : ${rewardElement.args[0]} <- quest number
            ARGS[1] : ${rewardElement.args[1]} <- wallet address
            ARGS[2] : ${rewardElement.args[2]} <- hero ID
            ARGS[3] : ${QUEST_REWARDS[rewardElement.args[3]]} (${rewardElement.args[3]}) <- reward
            ARGS[4] : ${rewardElement.args[4]} < - amount received
            `);
          })
  
      })//decodedQuests map end
    } catch (err) {
      console.log(`
      >> [contract/quest] (sortQuestData) something went wrong when attempting to decode quest log..\nerror logged as: ${err}
  
      `)
    }    
  } 