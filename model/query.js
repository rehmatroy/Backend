const db = require("../config/database");

class Query {
  constructor() {
    this.table = "messages";
  }

  addQuery(name, query) {
    return db.execute(
      `INSERT INTO ${this.table} SET name="${name}", query="${query}"`
    );
  }

  getQuery() {
    return db.execute(`SELECT * FROM ${this.table}`);
  }
}

module.exports = Query;
