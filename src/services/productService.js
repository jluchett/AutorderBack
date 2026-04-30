const db = require('../database/db')
const AppError = require('../utils/AppError')
const { validateName, validatePrice } = require('../utils/validators')

const getAllProducts = async () => {
  const result = await db.query('SELECT * FROM prodserv ORDER BY nombre')
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
