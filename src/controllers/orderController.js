const db = require("../database/db");

const getOrders = async (req, res) => {
  try {
    const query =
      "SELECT o.id AS orden_id, TO_CHAR(o.fecha, 'YYYY-MM-DD') AS fecha_orden, c.id AS id_cliente, c.nombre AS nombre_cliente, c.telefono AS telefono_cliente, v.placa AS placa_vehi FROM ordenes o JOIN clientes c ON o.cliente_id = c.id JOIN vehiculos v ON o.vehiculo_placa = v.placa ORDER BY o.fecha DESC";
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "no hay ordenes registradas" });
    }
    const orders = result.rows;
    res.status(201).json({
      orders,
    });
  } catch (error) {
    console.error("Error al obtener ordenes", error);
    res.status(500).json({ message: "Error al obtener ordenes" });
  }
};
const createOrder = async (req, res) => {
    //const client = await db.connect(); // Obtener una conexión del pool
  
    try {
      const { fecha_orden, id_cliente, placa_vehic, total_orden, detalle } = req.body;
  
      await db.query('BEGIN'); // Iniciar la transacción
  
      // Insertar en la tabla 'ordenes'
      const orderInsertQuery =
        'INSERT INTO ordenes (fecha, cliente_id, vehiculo_placa, total) VALUES ($1, $2, $3, $4) RETURNING id';
      const orderInsertValues = [fecha_orden, id_cliente, placa_vehic, total_orden];
  
      const orderResult = await db.query(orderInsertQuery, orderInsertValues);
      const orden_id = orderResult.rows[0].id;
  
      // Insertar en la tabla 'detalle_ordenes'
      for (const detalleItem of detalle) {
        const { producto_id, cantidad, precio_unitario } = detalleItem;
        const detalleInsertQuery =
          'INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)';
        const detalleInsertValues = [orden_id, producto_id, cantidad, precio_unitario];
        await db.query(detalleInsertQuery, detalleInsertValues);
      }
  
      await db.query('COMMIT'); // Confirmar la transacción
  
      res.status(201).json({
        success: true,
        message: 'Orden registrada con éxito',
      });
    } catch (error) {
      await db.query('ROLLBACK'); // Revertir la transacción en caso de error
      console.error('Error al crear orden', error);
      res.status(500).json({ message: 'Error al crear orden' });
    } 
};

const deleteOrder = async (req, res) => {
    try {
    const { id } = req.params;

    await db.query('BEGIN'); // Iniciar una transacción

    // 1. Realizar una copia de seguridad en otras tablas (por ejemplo, backup_ordenes y backup_detalle_ordenes)
    const backupQueryor = 'INSERT INTO ordenes_del (SELECT * FROM ordenes WHERE id = $1)';
    await db.query(backupQueryor, [id]);
  
    const backupQuerydor = 'INSERT INTO detalle_ordenes_del (SELECT * FROM detalle_ordenes WHERE orden_id = $1)';
    await db.query(backupQuerydor, [id]);

    // 2. Eliminar las órdenes y su detalle de la tabla principal
    const deldetordquery = 'DELETE FROM detalle_ordenes WHERE orden_id = $1';
    await db.query(deldetordquery, [id]);

    const deleteOrderQuery = 'DELETE FROM ordenes WHERE id = $1';
    await db.query(deleteOrderQuery, [id]);

    await db.query('COMMIT'); // Confirmar la transacción

    return res.status(201).json({
      message: 'Orden eliminada con éxito',
      success: true,
    });
  } catch (error) {
    await db.query('ROLLBACK'); // Revertir la transacción en caso de error
    console.error('Error al eliminar orden', error);
    res.status(500).json({
      message: 'Error al eliminar orden',
      success: false,
    });
  } 
};


module.exports = {
  getOrders,
  createOrder,
  deleteOrder,
};
