export const pool = require("../../database.js");

function hacerPedido(pedido, detalles, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        callback(err);
        return;
      }

      const sqlPedido = "INSERT INTO Pedidos SET ?";
      connection.query(sqlPedido, pedido, (err, resultPedido) => {
        if (err) {
          return connection.rollback(() => {
            callback(err);
          });
        }

        const pedidoId = resultPedido.insertId;

        const sqlDetalles =
          "INSERT INTO PedidoDetalles (PedidoID, ProductoID, Cantidad) VALUES ?";
        const valuesDetalles = detalles.map((detalle) => [
          pedidoId,
          detalle.ProductoID,
          detalle.Cantidad,
        ]);

        connection.query(
          sqlDetalles,
          [valuesDetalles],
          (err, resultDetalles) => {
            if (err) {
              return connection.rollback(() => {
                callback(err);
              });
            }

            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  callback(err);
                });
              }

              connection.release();
              callback(null, { pedidoId, resultDetalles });
            });
          }
        );
      });
    });
  });
}

export default hacerPedido;
