export function actualizarEstadoPedido(pedidoId, estado, callback) {
  const sql = "UPDATE Pedidos SET Estado = ? WHERE ID = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    connection.query(sql, [estado, pedidoId], (err, result) => {
      connection.release();

      if (err) {
        callback(err, null);
        return;
      }

      callback(null, result);
    });
  });
}
