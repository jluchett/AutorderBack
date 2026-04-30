const db = require('../database/db')
const bcrypt = require('bcrypt')
const AppError = require('../utils/AppError')
const { validateId, validateName, validatePassword } = require('../utils/validators')
const { ROLE_PERMISSIONS } = require('../utils/permissions')

const createUser = async ({ id, name, password, role = 'ventas' }) => {
  validateId(id)
  if (typeof name !== 'string') throw new AppError('El nombre debe ser una cadena de texto', 400)
  if (name.length < 5) throw new AppError('El nombre debe tener minimo 5 letras', 400)
  validatePassword(password)

  if (!ROLE_PERMISSIONS[role]) {
    throw new AppError('El role especificado no es válido', 400)
  }

  const existing = await db.query('SELECT id FROM users WHERE id = $1', [id])
  if (existing.rows.length > 0) {
    throw new AppError('Usuario con este id ya esta registrado', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const insertQuery = 'INSERT INTO users (id, name, password, role) VALUES ($1, $2, $3, $4) RETURNING name'
  const result = await db.query(insertQuery, [id, name, hashedPassword, role])
  return { message: `Usuario ${result.rows[0].name} creado exitosamente` }
}

const deleteUser = async (id) => {
  if (!id || id.trim() === '') {
    throw new AppError('ID de usuario requerido', 400)
  }

  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id])
  if (result.rowCount === 0) {
    throw new AppError('Usuario no encontrado', 404)
  }

  return { message: `Usuario ${id} eliminado exitosamente` }
}

const getUserById = async (id) => {
  validateId(id)
  const result = await db.query('SELECT name, role, locked FROM users WHERE id = $1', [id])
  if (result.rows.length === 0) {
    throw new AppError('Usuario con este id no existe', 404)
  }
  return result.rows[0]
}

const getUsers = async () => {
  const result = await db.query('SELECT id, name, role, locked FROM users ORDER BY name')
  return result.rows || []
}

const lockUser = async (id, locked) => {
  validateId(id)
  if (typeof locked !== 'boolean') {
    throw new AppError('Valor invalido para locked', 400)
  }

  const usuario = await db.query('SELECT id FROM users WHERE id = $1', [id])
  if (usuario.rows.length === 0) {
    throw new AppError('Usuario con este id no existe', 404)
  }

  await db.query('UPDATE users SET locked = $1 WHERE id = $2', [locked, id])
  return { message: 'Estado del usuario actualizado con éxito' }
}

const updateUser = async (id, { name, role }) => {
  validateId(id)
  const userQuery = await db.query('SELECT name, role FROM users WHERE id = $1', [id])
  if (userQuery.rows.length === 0) {
    throw new AppError('No hay usuario con ese id', 404)
  }

  const existingUser = userQuery.rows[0]
  const updatedName = name !== undefined ? name : existingUser.name
  const updatedRole = role !== undefined ? role : existingUser.role

  if (typeof updatedName !== 'string') {
    throw new AppError('El nombre debe ser un texto', 400)
  }
  if (updatedName.trim().length < 5) {
    throw new AppError('El nombre debe tener minimo 5 letras', 400)
  }
  if (typeof updatedRole !== 'string') {
    throw new AppError('El role debe ser una dato tipo texto', 400)
  }
  if (!ROLE_PERMISSIONS[updatedRole]) {
    throw new AppError('El role especificado no es válido', 400)
  }

  const result = await db.query('UPDATE users SET name = $1, role = $2 WHERE id = $3', [updatedName, updatedRole, id])
  if (result.rowCount === 0) {
    throw new AppError('No se pudo actualizar el usuario', 404)
  }

  return { message: 'Datos del usuario actualizados' }
}

const changePassword = async (id, password) => {
  validateId(id)
  validatePassword(password)

  const usuario = await db.query('SELECT id FROM users WHERE id = $1', [id])
  if (usuario.rows.length === 0) {
    throw new AppError('Usuario con este id no esta registrado', 404)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const result = await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id])
  if (result.rowCount === 0) {
    throw new AppError('Error al actualizar contraseña', 500)
  }

  return { message: 'Contraseña actualizada' }
}

module.exports = {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  lockUser,
  updateUser,
  changePassword
}
