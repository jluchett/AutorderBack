/* eslint-disable camelcase */
const db = require('../database/db')
const AppError = require('../utils/AppError')
const { validateId, validatePlate } = require('../utils/validators')

const { buildPagination, addCondition, toSafeNumber } = require('../utils/queryBuilder')

const getAllOrders = async ({ search, clienteId, placaVehic, startDate, endDate, minTotal, maxTotal, page, limit } = {}) => {
  const conditions = []
  const values = []

  addCondition(conditions, values, (index) => `c.id = $${index}`, clienteId)
  addCondition(conditions, values, (index) => `v.placa = $${index}`, placaVehic)

  if (startDate) {
    values.push(startDate)
    conditions.push(`o.fecha >= $${values.length}`)
  }
  if (endDate) {
    values.push(endDate)
    conditions.push(`o.fecha <= $${values.length}`)
  }

  const minTotalNum = toSafeNumber(minTotal)
  const maxTotalNum = toSafeNumber(maxTotal)
  addCondition(conditions, values, (index) => `o.total >= $${index}`, minTotalNum)
  addCondition(conditions, values, (index) => `o.total <= $${index}`, maxTotalNum)

  if (search) {
    const searchValue = `%${search}%`
    values.push(searchValue, searchValue, searchValue)
    conditions.push(`(o.id::text ILIKE $${values.length - 2} OR c.nombre ILIKE $${values.length - 1} OR v.placa ILIKE $${values.length})`)
  }

  let query = "SELECT o.id AS orden_id, TO_CHAR(o.fecha, 'YYYY-MM-DD') AS fecha_orden, c.id AS id_cliente, c.nombre AS nombre_cliente, c.telefono AS telefono_cliente, v.placa AS placa_vehi, o.total FROM ordenes o JOIN clientes c ON o.cliente_id = c.id JOIN vehiculos v ON o.vehiculo_placa = v.placa"
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }
  query += ' ORDER BY o.fecha DESC'

  const pagination = buildPagination({ page, limit })
  query += pagination.clause.replace('$LIMIT', `$${values.length + 1}`).replace('$OFFSET', `$${values.length + 2}`)
  values.push(...pagination.values)

  const result = await db.query(query, values)
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

const getOrderStats = async ({ startDate, endDate } = {}) => {
  const conditions = []
  const values = []

  if (startDate) {
    values.push(startDate)
    conditions.push(`o.fecha >= $${values.length}`)
  }
  if (endDate) {
    values.push(endDate)
    conditions.push(`o.fecha <= $${values.length}`)
  }

  let query = 'SELECT COUNT(*) AS total_orders, COALESCE(SUM(o.total), 0) AS total_revenue, COALESCE(AVG(o.total), 0) AS average_order_value, COALESCE(MAX(o.total), 0) AS max_order_value, COALESCE(MIN(o.total), 0) AS min_order_value FROM ordenes o'
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  const result = await db.query(query, values)
  return result.rows[0] || {
    total_orders: 0,
    total_revenue: 0,
    average_order_value: 0,
    max_order_value: 0,
    min_order_value: 0
  }
}

const getTopProductsReport = async ({ startDate, endDate, limit = 10 } = {}) => {
  const conditions = []
  const values = []

  if (startDate) {
    values.push(startDate)
    conditions.push(`o.fecha >= $${values.length}`)
  }
  if (endDate) {
    values.push(endDate)
    conditions.push(`o.fecha <= $${values.length}`)
  }

  let query = `
    SELECT 
      p.id AS producto_id,
      p.nombre AS producto_nombre,
      SUM(d.cantidad) AS total_quantity,
      SUM(d.cantidad * d.precio_unitario) AS total_revenue
    FROM detalle_ordenes d
    JOIN prodserv p ON d.producto_id = p.id
    JOIN ordenes o ON d.orden_id = o.id
  `

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  query += ' GROUP BY p.id, p.nombre ORDER BY total_quantity DESC LIMIT $' + (values.length + 1)
  values.push(Number(limit) || 10)

  const result = await db.query(query, values)
  return result.rows || []
}

const getTopClientsReport = async ({ startDate, endDate, limit = 10 } = {}) => {
  const conditions = []
  const values = []

  if (startDate) {
    values.push(startDate)
    conditions.push(`o.fecha >= $${values.length}`)
  }
  if (endDate) {
    values.push(endDate)
    conditions.push(`o.fecha <= $${values.length}`)
  }

  let query = `
    SELECT
      c.id AS cliente_id,
      c.nombre AS cliente_nombre,
      COUNT(o.id) AS order_count,
      SUM(o.total) AS total_revenue
    FROM ordenes o
    JOIN clientes c ON o.cliente_id = c.id
  `

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  query += ' GROUP BY c.id, c.nombre ORDER BY total_revenue DESC LIMIT $' + (values.length + 1)
  values.push(Number(limit) || 10)

  const result = await db.query(query, values)
  return result.rows || []
}

module.exports = {
  getAllOrders,
  createOrder,
  deleteOrder,
  getOrderDetail,
  getOrderStats,
  getTopProductsReport,
  getTopClientsReport
}
