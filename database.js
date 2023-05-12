const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "12345",
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database", err.stack);
  } else {
    console.log("Connected to database");
  }
  release();
});
module.exports = pool;
