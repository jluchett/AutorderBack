const db = require('../database/db')
const AppError = require('../utils/AppError')
const { validateName, validateProductType, validatePrice } = require('../utils/validators')

const { buildPagination, addCondition, toSafeNumber } = require('../utils/queryBuilder')

const getAllProducts = async ({ search, nombre, minPrice, maxPrice, page, limit } = {}) => {
  const conditions = []
  const values = []

  addCondition(conditions, values, (index) => `nombre ILIKE $${index}`, nombre ? `%${nombre}%` : nombre)

  if (search) {
    values.push(`%${search}%`)
    conditions.push(`nombre ILIKE $${values.length}`)
  }

  const minPriceNum = toSafeNumber(minPrice)
  const maxPriceNum = toSafeNumber(maxPrice)
  addCondition(conditions, values, (index) => `precio >= $${index}`, minPriceNum)
  addCondition(conditions, values, (index) => `precio <= $${index}`, maxPriceNum)

  let query = 'SELECT * FROM prodserv'
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }
  query += ' ORDER BY nombre'

  const pagination = buildPagination({ page, limit })
  query += pagination.clause.replace('$LIMIT', `$${values.length + 1}`).replace('$OFFSET', `$${values.length + 2}`)
  values.push(...pagination.values)

  const result = await db.query(query, values)
  const queryStock = `
      SELECT 
        p.id, 
        p.nombre, 
        p.precio, 
        p.tipo,
        COALESCE(
          SUM(CASE WHEN m.tipo_movimiento = 'ENTRADA' THEN m.cantidad 
                  WHEN m.tipo_movimiento = 'SALIDA' THEN -m.cantidad 
                  ELSE 0 END), 0
        ) AS stock_actual
      FROM prodserv p
      LEFT JOIN movimientos_productos m ON p.id = m.producto_id
      GROUP BY p.id, p.nombre, p.precio, p.tipo
      ORDER BY p.nombre ASC
    `
  const stockResult = await db.query(queryStock)
  const stockMap = {}
  stockResult.rows.forEach(row => {
    stockMap[row.id] = row.stock_actual
  })
  console.log('Stock Map:', stockMap)
  console.log('Productos obtenidos:', result.rows)
  const productsStock = result.rows.map(product => ({
    ...product,
    stock: stockMap[product.id] || 0
  }))
  console.log('Productos con stock:', productsStock)
  return result.rows || []
}

const createProduct = async ({ nombre, precio, tipo }) => {
  if (!nombre || precio === undefined || tipo === undefined) {
    throw new AppError('Los campos nombre, precio y tipo son obligatorios', 400)
  }

  validateName(nombre)
  validateProductType(tipo)
  validatePrice(precio)

  const existing = await db.query('SELECT 1 FROM prodserv WHERE nombre = $1', [nombre])
  if (existing.rows.length > 0) {
    throw new AppError('Ya hay un producto con ese nombre', 400)
  }

  await db.query('INSERT INTO prodserv (nombre, precio, tipo) VALUES ($1, $2, $3)', [nombre, precio, tipo])
  return { message: 'producto agregado con exito' }
}

const updateProduct = async (id, payload) => {
  const { nombre, precio, tipo } = payload

  if (nombre === undefined && precio === undefined && tipo === undefined) {
    throw new AppError('Debe proporcionar al menos un campo para actualizar', 400)
  }

  const setClauses = []
  const values = [id]

  if (nombre !== undefined) {
    validateName(nombre)
    values.push(nombre)
    setClauses.push(`nombre = $${values.length}`)
  }

  if (precio !== undefined) {
    validatePrice(precio)
    values.push(precio)
    setClauses.push(`precio = $${values.length}`)
  }

  if (tipo !== undefined) {
    validateProductType(tipo)
    values.push(tipo)
    setClauses.push(`tipo = $${values.length}`)
  }

  const query = `UPDATE prodserv SET ${setClauses.join(', ')} WHERE id = $1`
  const result = await db.query(query, values)
  if (result.rowCount === 0) {
    throw new AppError('No se pudo actualizar producto - Producto no encontrado', 404)
  }

  return { message: 'Datos del producto actualizados' }
}

const deleteProduct = async (id) => {
  const detalleResult = await db.query('SELECT COUNT(*) FROM detalle_ordenes WHERE producto_id = $1', [id])
  if (parseInt(detalleResult.rows[0].count, 10) > 0) {
    throw new AppError('No se puede eliminar el producto. Está siendo usado en órdenes', 400)
  }

  const result = await db.query('DELETE FROM prodserv WHERE id = $1', [id])
  if (result.rowCount === 0) {
    throw new AppError('No se pudo eliminar el producto - No encontrado', 404)
  }

  return { message: 'Producto eliminado con exito' }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
}
