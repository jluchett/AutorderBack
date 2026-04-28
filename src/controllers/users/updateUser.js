const db = require('../../database/db')

const updateUser = async (req, res) => {
  const { id } = req.params
  const { name, role } = req.body
  try {
    const userQuery = await db.query('SELECT name, role FROM users WHERE id = $1', [id])
    if (userQuery.rows.length === 0) throw new Error('No hay usuario con ese id')

    const existingUser = userQuery.rows[0]
    const updatedName = name !== undefined ? name : existingUser.name
    const updatedRole = role !== undefined ? role : existingUser.role

    if (typeof updatedName !== 'string') throw new Error('El nombre debe ser un texto')
    if (updatedName.trim().length < 5) throw new Error('El nombre debe tener minimo 5 letras')
    if (typeof updatedRole !== 'string') throw new Error('El role debe ser una dato tipo texto')

    const result = await db.query('UPDATE users SET name = $1, role = $2 WHERE id = $3', [updatedName, updatedRole, id])
    if (result.rowCount > 0) {
      return res.status(200).json({
        message: 'Datos del usuario actualizados',
        success: true
      })
    }

    return res.status(404).json({
      message: 'No se pudo actualizar el usuario',
      success: false
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = updateUser
