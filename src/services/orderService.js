const db = require('../database/db')
const AppError = require('../utils/AppError')
const { validateId, validatePlate } = require('../utils/validators')

const getAllOrders = async () => {
  const query = "SELECT o.id AS orden_id, TO_CHAR(o.fecha, 'YYYY-MM-DD') AS fecha_orden, c.id AS id_cliente, c.nombre AS nombre_cliente, c.telefono AS telefono_cliente, v.placa AS placa_vehi, o.total FROM ordenes o JOIN clientes c ON o.cliente_id = c.id JOIN vehiculos v ON o.vehiculo_placa = v.placa ORDER BY o.fecha DESC"
  const result = await db.query(query)
  return result.rows || []
}

const createOrder = async ({ fecha_orden, id_cliente, placa_vehic, total_orden, detalle }) => {
  if (!fecha_orden || !id_cliente || !placa_vehic || total_orden === undefined || !Array.isArray(detalle)) {
    throw new AppError('Todos los campos de la orden son obligatorios', 400)
  }

  validateId(id_cliente)
  validatePlate(placa_vehic)

  const total = parseFloat(total_orden)
  if (Number.isNaN(total) || total < 0) {
    throw new AppError('El total de la orden debe ser un número válido y no negativo', 400)
  }

  if (detalle.length === 0) {
    throw new AppError('El detalle de la orden no puede estar vacío', 400)
  }

  await db.query('BEGIN')
  try {
    const orderInsertQuery = 'INSERT INTO ordenes (fecha, cliente_id, vehiculo_placa, total) VALUES ($1, $2, $3, $4) RETURNING id'
    const orderInsertValues = [fecha_orden, id_cliente, placa_vehic, total]
    const orderResult = await db.query(orderInsertQuery, orderInsertValues)
    const orden_id = orderResult.rows[0].id

    for (const detalleItem of detalle) {
      const { producto_id, cantidad, precio_unitario } = detalleItem
      if (!producto_id || cantidad === undefined || precio_unitario === undefined) {
        throw new AppError('Cada detalle debe incluir producto_id, cantidad y precio_unitario', 400)
      }
      await db.query(
        'INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [orden_id, producto_id, cantidad, precio_unitario]
      )
    }

    await db.query('COMMIT')
    return { message: 'Orden registrada con éxito' }
  } catch (error) {
    await db.query('ROLLBACK')
    throw error
  }
}

const deleteOrder = async (id) => {
  await db.query('BEGIN')
  try {
    const detailDeleteQuery = 'DELETE FROM detalle_ordenes WHERE orden_id = $1'
    await db.query(detailDeleteQuery, [id])

    const deleteOrderQuery = 'DELETE FROM ordenes WHERE id = $1'
    const deleteResult = await db.query(deleteOrderQuery, [id])
    if (deleteResult.rowCount === 0) {
      await db.query('ROLLBACK')
      throw new AppError('Orden no encontrada', 404)
    }

    await db.query('COMMIT')
    return { message: 'Orden eliminada con éxito' }
  } catch (error) {
    await db.query('ROLLBACK')
    throw error
  }
}

const getOrderDetail = async (id) => {
  if (!id) {
    throw new AppError('ID de orden requerido', 400)
  }

  const query = `
      SELECT 
        dor.id AS detalle_id,
        dor.orden_id,
        dor.producto_id,
        p.nombre AS producto_nombre,
        dor.cantidad,
        dor.precio_unitario,
        (dor.cantidad * dor.precio_unitario) AS subtotal
      FROM detalle_ordenes dor
      JOIN prodserv p ON dor.producto_id = p.id
      WHERE dor.orden_id = $1
      ORDER BY dor.id
    `
  const result = await db.query(query, [id])
  const detalle = result.rows || []
  const total = detalle.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0)
  return { detalle, total }
}

module.exports = {
  getAllOrders,
  createOrder,
  deleteOrder,
  getOrderDetail
}
