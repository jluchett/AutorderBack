const db = require('../../database/db')
const bcrypt = require('bcrypt')

const changePassword = async (req, res) => {
  const { id } = req.params
  const { password } = req.body
  try {
    if (typeof id !== 'string') throw new Error('El Id debe ser una cadena de texto')
    if (typeof password !== 'string') throw new Error('el password debe ser una cadena de texto')
    if (password.length < 8) throw new Error('El password debe tener minimo 8 caracteres')
    const usuario = await db.query('SELECT name FROM users WHERE id = $1', [id])
    if (usuario.rows.length === 0) throw new Error('Usuario con este id no esta registrado')
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id])
    if (result.rowCount > 0) {
      res.status(200).json({
        mensaje: 'Contraseña actualizada',
        success: true
      })
    } else {
      throw new Error('Error al actualizar contraseña')
    }
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      success: false
    })
  }
}
module.exports = changePassword
