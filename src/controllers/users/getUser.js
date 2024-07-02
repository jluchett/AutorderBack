const db = require('../../database/db')

const getUser = async (req, res) => {
  const { id } = req.params
  try {
    if (typeof id !== 'string') throw new Error('El Id debe ser una cadena de texto')
    if (id.length > 12) throw new Error('El Id no puede tener mas de 12 caracteres')
    const usuario = await db.query('SELECT name, role, locked FROM users WHERE id = $1', [id])
    if (usuario.rows.length === 0) throw new Error('Usuario con este id no existe')
    res.status(200).json({
      usuario: usuario.rows,
      success: true
    })
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
      success: false
    })
  }
}
module.exports = getUser
