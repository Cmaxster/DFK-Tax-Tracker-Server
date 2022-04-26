/**
 * A singleton to store data constants
 *   
 */
class DataStore {

    constructor() {
        this.transactionData = [];
    }

    // get count() {
    //     return this.logs.length;
    // }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        console.log(`${timestamp} - ${message}`);
    }
}

class Singleton {

  constructor() {
      if (!Singleton.instance) {
          Singleton.instance = new DataStore();
      }
  }

  getInstance() {
      return Singleton.instance;
  }

}

module.exports = Singleton;