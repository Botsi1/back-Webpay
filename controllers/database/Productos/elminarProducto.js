export function eliminarProducto(idProducto, callback) {
  const sql = "DELETE FROM Productos WHERE ID = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    connection.query(sql, idProducto, (err, result) => {
      connection.release();

      if (err) {
        callback(err, null);
        return;
      }

      callback(null, result);
    });
  });
}
