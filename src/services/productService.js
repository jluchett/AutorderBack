const db = require('../database/db')
const AppError = require('../utils/AppError')
const { validateName, validatePrice } = require('../utils/validators')

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
  return result.rows || []
}

const createProduct = async ({ nombre, precio }) => {
  if (!nombre || precio === undefined) {
    throw new AppError('Los campos nombre y precio son obligatorios', 400)
  }

  validateName(nombre)
  validatePrice(precio)

  const existing = await db.query('SELECT 1 FROM prodserv WHERE nombre = $1', [nombre])
  if (existing.rows.length > 0) {
    throw new AppError('Ya hay un producto con ese nombre', 400)
  }

  await db.query('INSERT INTO prodserv (nombre, precio) VALUES ($1, $2)', [nombre, precio])
  return { message: 'producto agregado con exito' }
}

const updateProduct = async (id, payload) => {
  const { nombre, precio } = payload

  if (nombre === undefined && precio === undefined) {
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
