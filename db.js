const config = require("./config.json");
// mysql
const mysql = require("mysql");
const con = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  port: config.db.port,
  password: config.db.password,
  database: config.db.database,
});
con.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
});

module.exports = con;
