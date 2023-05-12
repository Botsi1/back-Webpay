const pool = require("../../database.js");

export function insertarTransaccion(transaccion, callback) {
  const sql = "INSERT INTO TransaccionesTransbank SET ?";

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    connection.query(sql, transaccion, (err, result) => {
      connection.release();

      if (err) {
        callback(err, null);
        return;
      }

      callback(null, result);
    });
  });
}
