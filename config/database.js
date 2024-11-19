const mysql = require('mysql2');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: '24.199.82.205',
  user: 'sheraz',
  password: 'Sherazali11.',
  database: 'tenderbidding',
});
module.exports = pool.promise();
