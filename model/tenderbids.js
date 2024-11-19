const db = require("../config/database");

module.exports = class TenderBid {
  constructor() {}

  getTenderWinner(id) {
    return db.execute(`SELECT user_id,amount,name
    FROM tenderbid
    WHERE tender_id = ${id} AND  amount = (SELECT MIN(amount) FROM tenderbid)`);
  }

  addTenderBid(user_id, tender_id, amount, description, time) {
    return db.execute(`INSERT INTO tenderbid (user_id, tender_id, amount, description, time) VALUES (${user_id}, ${tender_id}, "${amount}", "${description}", "${time}")`);
}

}