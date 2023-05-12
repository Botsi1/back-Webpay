const pool = require("../../database.js");
export function insertarProducto(producto, callback) {
  const sql = "INSERT INTO Productos SET ?";

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    connection.query(sql, producto, (err, result) => {
      connection.release();

      if (err) {
        callback(err, null);
        return;
      }

      callback(null, result);
    });
  });
}

export default insertarProducto;
