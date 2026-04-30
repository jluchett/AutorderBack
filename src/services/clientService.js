const db = require('../database/db')
const AppError = require('../utils/AppError')
const { validateId, validateName, validatePhone, validateEmail } = require('../utils/validators')

const getAllClients = async () => {
  const result = await db.query('SELECT * FROM clientes ORDER BY id')
  return result.rows || []
}

const createClient = async ({ id, nombre, telefono, email }) => {
  if (!id || !nombre || !telefono) {
    throw new AppError('Los campos id, nombre y telefono son obligatorios', 400)
  }

  validateId(id)
  validateName(nombre)
  validatePhone(telefono)

  if (email && !validateEmail(email)) {
    throw new AppError('El email no tiene un formato válido', 400)
  }

  const existing = await db.query('SELECT 1 FROM clientes WHERE id = $1', [id])
  if (existing.rows.length > 0) {
    throw new AppError('El cliente ya existe en la base de datos', 400)
  }

  const insertQuery = 'INSERT INTO clientes (id, nombre, telefono, email) VALUES ($1, $2, $3, $4)'
  await db.query(insertQuery, [id, nombre, telefono, email || null])
  return { message: 'Cliente registrado con exito' }
}

const updateClient = async (id, payload) => {
  const { nombre, telefono, email } = payload

  if (!nombre && !telefono && email === undefined) {
    throw new AppError('Debe proporcionar al menos un campo para actualizar', 400)
  }

  const setClauses = []
  const values = [id]

  if (nombre !== undefined) {
    validateName(nombre)
    values.push(nombre)
    setClauses.push(`nombre = $${values.length}`)
  }

  if (telefono !== undefined) {
    validatePhone(telefono)
    values.push(telefono)
    setClauses.push(`telefono = $${values.length}`)
  }

  if (email !== undefined) {
    if (email && !validateEmail(email)) {
      throw new AppError('El email no tiene un formato válido', 400)
    }
    values.push(email || null)
    setClauses.push(`email = $${values.length}`)
  }

  const query = `UPDATE clientes SET ${setClauses.join(', ')} WHERE id = $1`
  const result = await db.query(query, values)

  if (result.rowCount === 0) {
    throw new AppError('Cliente no encontrado', 404)
  }

  return { message: 'Datos del cliente actualizados' }
}

const deleteClient = async (id) => {
  if (!id) {
    throw new AppError('ID de cliente requerido', 400)
  }

  const vehiculosResult = await db.query('SELECT COUNT(*) FROM vehiculos WHERE cliente_id = $1', [id])
  if (parseInt(vehiculosResult.rows[0].count, 10) > 0) {
    throw new AppError('No se puede eliminar el cliente. Tiene vehículos registrados', 400)
  }

  const ordenesResult = await db.query('SELECT COUNT(*) FROM ordenes WHERE cliente_id = $1', [id])
  if (parseInt(ordenesResult.rows[0].count, 10) > 0) {
    throw new AppError('No se puede eliminar el cliente. Tiene órdenes registradas', 400)
  }

  const result = await db.query('DELETE FROM clientes WHERE id = $1', [id])
  if (result.rowCount === 0) {
    throw new AppError('Cliente no encontrado', 404)
  }

  return { message: 'Cliente eliminado con exito' }
}

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient
}
