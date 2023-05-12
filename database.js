const { createPool } = require("mysql");

const pool = createPool({
  host: "localhost",
  port: 3306, // Puerto por defecto de MySQL
  user: "root",
  password: "12345",
  database: "mynigth",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database", err.stack);
  } else {
    console.log("Connected to database");
  }
  connection.release();
});

module.exports = pool;