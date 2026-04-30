const db = require('../database/db')
const AppError = require('../utils/AppError')
const { validateId, validatePlate, validateName, validateYear, validateMileage } = require('../utils/validators')

const getAllVehicles = async () => {
  const query = 'SELECT v.placa, v.marca, v.modelo, v.anio, v.kilometraje, v.motor, v.transmision, v.cliente_id, c.nombre AS nombre_cliente FROM vehiculos v JOIN clientes c ON v.cliente_id = c.id ORDER BY v.placa'
  const result = await db.query(query)
  return result.rows || []
}

const createVehicle = async ({ placa, marca, modelo, anio, kilometraje, motor, transmision, cliente_id }) => {
  if (!placa || !marca || !modelo || !anio || !cliente_id) {
    throw new AppError('Los campos placa, marca, modelo, anio y cliente_id son obligatorios', 400)
  }

  validatePlate(placa)
  validateName(marca)
  validateName(modelo)
  validateYear(anio)
  validateId(cliente_id)
  if (kilometraje !== undefined) validateMileage(kilometraje)

  const clienteResult = await db.query('SELECT id FROM clientes WHERE id = $1', [cliente_id])
  if (clienteResult.rows.length === 0) {
    throw new AppError('El cliente especificado no existe', 400)
  }

  const existingVehicle = await db.query('SELECT 1 FROM vehiculos WHERE placa = $1', [placa])
  if (existingVehicle.rows.length > 0) {
    throw new AppError('El vehiculo ya fue registrado', 400)
  }

  const insertQuery = 'INSERT INTO vehiculos (placa, marca, modelo, anio, kilometraje, motor, transmision, cliente_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
  const insertValues = [placa, marca, modelo, anio, kilometraje || null, motor || null, transmision || null, cliente_id]
  await db.query(insertQuery, insertValues)

  return { message: 'Vehiculo registrado con exito' }
}

const updateVehicle = async (placa, payload) => {
  const { marca, modelo, anio, kilometraje, motor, transmision, cliente_id } = payload

  if (marca === undefined && modelo === undefined && anio === undefined && kilometraje === undefined && motor === undefined && transmision === undefined && cliente_id === undefined) {
    throw new AppError('Debe proporcionar al menos un campo para actualizar', 400)
  }

  const setClauses = []
  const values = [placa]

  if (marca !== undefined) {
    validateName(marca)
    values.push(marca)
    setClauses.push(`marca = $${values.length}`)
  }
  if (modelo !== undefined) {
    validateName(modelo)
    values.push(modelo)
    setClauses.push(`modelo = $${values.length}`)
  }
  if (anio !== undefined) {
    validateYear(anio)
    values.push(anio)
    setClauses.push(`anio = $${values.length}`)
  }
  if (kilometraje !== undefined) {
    validateMileage(kilometraje)
    values.push(kilometraje)
    setClauses.push(`kilometraje = $${values.length}`)
  }
  if (motor !== undefined) {
    values.push(motor)
    setClauses.push(`motor = $${values.length}`)
  }
  if (transmision !== undefined) {
    values.push(transmision)
    setClauses.push(`transmision = $${values.length}`)
  }
  if (cliente_id !== undefined) {
    validateId(cliente_id)
    const clienteResult = await db.query('SELECT id FROM clientes WHERE id = $1', [cliente_id])
    if (clienteResult.rows.length === 0) {
      throw new AppError('El cliente especificado no existe', 400)
    }
    values.push(cliente_id)
    setClauses.push(`cliente_id = $${values.length}`)
  }

  const query = `UPDATE vehiculos SET ${setClauses.join(', ')} WHERE placa = $1`
  const result = await db.query(query, values)
  if (result.rowCount === 0) {
    throw new AppError('Vehiculo no encontrado en la bd', 404)
  }

  return { message: 'Datos del vehiculo actualizados' }
}

const deleteVehicle = async (placa) => {
  const ordenesResult = await db.query('SELECT COUNT(*) FROM ordenes WHERE vehiculo_placa = $1', [placa])
  if (parseInt(ordenesResult.rows[0].count, 10) > 0) {
    throw new AppError('No se puede eliminar el vehículo. Tiene órdenes registradas', 400)
  }

  const result = await db.query('DELETE FROM vehiculos WHERE placa = $1', [placa])
  if (result.rowCount === 0) {
    throw new AppError('Vehiculo no encontrado', 404)
  }

  return { message: 'Vehiculo eliminado con exito' }
}

const getVehiclesByClient = async (idClient) => {
  validateId(idClient)
  const query = 'SELECT placa, marca, modelo, anio, kilometraje FROM vehiculos WHERE cliente_id = $1'
  const result = await db.query(query, [idClient])
  return result.rows || []
}

module.exports = {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByClient
}
