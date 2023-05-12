export function eliminarPedido(idPedido, callback) {
  const sql = "DELETE FROM Pedidos WHERE ID = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    connection.query(sql, idPedido, (err, result) => {
      connection.release();

      if (err) {
        callback(err, null);
        return;
      }

      callback(null, result);
    });
  });
}
