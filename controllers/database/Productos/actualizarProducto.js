export function actualizarProducto(idProducto, productoActualizado, callback) {
  const sql = "UPDATE Productos SET ? WHERE ID = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    connection.query(sql, [productoActualizado, idProducto], (err, result) => {
      connection.release();

      if (err) {
        callback(err, null);
        return;
      }

      callback(null, result);
    });
  });
}
