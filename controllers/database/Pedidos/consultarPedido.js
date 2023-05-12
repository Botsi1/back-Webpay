export function consultarPedidos(callback) {
  const sql = "SELECT * FROM Pedidos";

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    connection.query(sql, (err, result) => {
      connection.release();

      if (err) {
        callback(err, null);
        return;
      }

      callback(null, result);
    });
  });
}
