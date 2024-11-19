const db = require("../config/database");

module.exports = class Documents {
  constructor() {}

  /**
   * @dev the function will create new record for given `payload`
   * @param {Object} payload is an object. it will contain following properties:
   * - `id `,
   * - `full_name`,
   * - `email`,
   * - `phone`,
   * - `bussiness_name`,
   * - `address`,
 
 
   *
   * @returns it will rertun a Promise <fulfiled | rejected>
   */
  updateInfo({ id, full_name, email, phone, bussiness_name, address }) {
    return db.execute(`UPDATE user SET full_name = '${full_name}', email = '${email}' , phone = '${phone}', bussiness_name = '${bussiness_name}', address = '${address}'
WHERE
id = '${id}'
`);
  }

  singUp({ email, password }) {
    return db.execute(`INSERT INTO user SET email = '${email}', password = '${password}'
`);
  }
};
