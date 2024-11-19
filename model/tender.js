const db = require('../config/database');

module.exports = class Tenders {
  constructor() {}

  getAllTenders() {
    return db.execute(`SELECT * FROM tenders`);
  }

  createTender({ name, description, price }) {
    return db.execute(
      `INSERT INTO tenders (name, description, price) VALUES (?, ?, ?)`,
      [name, description, price]
    );
  }

  updateTender(id, { name, description, price }) {
    return db.execute(
      `UPDATE tenders SET name = ?, description = ?, price = ? WHERE id = ?`,
      [name, description, price, id]
    );
  }

  deleteTender(id) {
    return db.execute(`DELETE FROM tenders WHERE id = ?`, [id]);
  }
};
