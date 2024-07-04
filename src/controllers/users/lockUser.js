const db = require('../../database/db')

const lockUser = async (req, res) => {
  const { id } = req.params
  const { locked } = req.body
  try {
    if (typeof id !== 'string') throw new Error('El Id debe ser una cadena de texto')
    if (id.length < 6 || id.length > 12) throw new Error('El Id no puede tener menos de 6 o mas de 12 caracteres')
    if (typeof locked !== 'boolean') throw new Error('Valor invalido para locked')
    const usuario = await db.query('SELECT name, role, locked FROM users WHERE id = $1', [id])
    if (usuario.rows.length === 0) throw new Error('Usuario con este id no existe')
    const result = await db.query('UPDATE users SET locked = $1 WHERE id = $2', [locked, id])
    if (result.rowCount > 0) {
      res.status(200).json({
        message: 'Estado del usuario actualizado con éxito',
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
module.exports = lockUser
