const db = require("../config/database");

module.exports = class Users {
  constructor() {}

  fetchAll() {
    return db.execute(`SELECT * FROM  user 
     `);
  }

  logIn(email) {
    return db.execute(`SELECT * FROM  user 
    where
    email = '${email}' `);
  }

  dataUser() {
    return db.execute(`SELECT full_Name,id,email FROM  user `);
  }

  userProfile(id,full_name,phone,bussiness_name,address,image) {
    return db.execute(`UPDATE user SET full_name = '${full_name}', image = '${image}' , phone = '${phone}', bussiness_name = '${bussiness_name}', address = '${address}' WHERE id= ${id}
    `);
  }

  dataSingleUser(id){
    return db.execute(`SELECT full_Name,email FROM user WHERE id = '${id}'`);

  }

  deleteuser(email){
    return db.execute(`DELETE FROM user 
    where
    email = '${email}' `);
  }

  storeTransactionDetails(userId,auctionId,price,description){
    return db.execute(`INSERT INTO transactions SET userId = ${userId}, auctionId = ${auctionId}, price = ${price}, description = '${description}'`);
  }



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

  singUp({ email, password, full_name }) {
    return db.execute(`INSERT INTO user SET email = '${email}', password = '${password}',full_name= '${full_name}'
`);
  }

  checkEmail(email) {
    return db.execute(`SELECT * FROM user where email = '${email}'
    `);
  }

  resetTokenInsert(passwordResetToken, passwordResetExpire, email) {
    return db.execute(`UPDATE user SET passwordResetToken= '${passwordResetToken}', passwordResetExpire='${passwordResetExpire}' where email='${email}'
    `);
  }

  getToken(token) {
    return db.execute(`SELECT * FROM user where passwordResetToken='${token}'
    `);
  }

  setPassword(email, password) {
    return db.execute(`UPDATE user SET password='${password}', passwordResetToken= null , passwordResetExpire='null' where email='${email}'
    `);
  }
};
