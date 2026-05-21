const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
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