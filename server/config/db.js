const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "b!Nu$04082002",
  database: "honeyhabit",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to DB(MySQL)");
  }
});

module.exports = db;