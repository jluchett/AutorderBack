const db = require('../../database/db')

const updateUser = async (req, res) => {
  const { id } = req.params
  const { name, role } = req.body
  try {
    if (typeof name !== 'string') throw new Error('El nombre debe ser un texto')
    if (name.length < 5) throw new Error('El nombre debe tener minimo 5 letras')
    if (typeof role !== 'string') throw new Error('El role debe ser una dato tipo texto')
    const user = await db.query('SELECT name FROM users WHERE id = $1', [id])
    if (user.rows.length === 0) throw new Error('No hay usuario con ese id')
    const result = await db.query('UPDATE users SET name = $1, role = $2 WHERE id = $3', [name, role, id])
    if (result.rowCount > 0) {
      res.status(200).json({
        mensaje: 'Datos del usuario actualizados',
        success: true
      })
    }
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      success: false
    })
  }
}
module.exports = updateUser
