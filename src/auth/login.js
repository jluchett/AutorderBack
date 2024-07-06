const db = require('../database/db')
const bcrypt = require('bcrypt')

const login = async (req, res) => {
  const { id, password } = req.body
  try {
    if (typeof id !== 'string') throw new Error('El Id debe ser una cadena de texto')
    if (id.length > 12) throw new Error('El Id no puede tener mas de 12 caracteres')
    if (password.length < 8) throw new Error('El password debe tener minimo 8 caracteres')
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
    if (user.rowCount === 0) throw new Error('El usuario no existe')
    const isPassValid = await bcrypt.compare(password, user.rows[0].password)
    if (!isPassValid) {
      throw new Error('La contraseña no es valida')
    } else {
      if (user.rows[0].locked === true) throw new Error('Usuario bloqueado, solicitar desbloqueo')
      res.status(200).json({
        mensaje: 'Inicio de sesion exitoso',
        user: user.rows[0].name,
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
module.exports = login
