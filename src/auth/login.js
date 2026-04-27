const db = require('../database/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
      const token = jwt.sign({ id: user.rows[0].id, name: user.rows[0].name }, process.env.SECRET, { expiresIn: '1h' })
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60
        })
        .status(200)
        .json({
          success: true,
          message: 'Inicio de sesión exitoso',
          user: {
            id: user.rows[0].id,
            name: user.rows[0].name,
            role: user.rows[0].role,
            locked: user.rows[0].locked,
            token
          }
        })
    }
  } catch (error) {
    // Errores de autenticación (credenciales inválidas)
    const authErrors = [
      'El usuario no existe',
      'La contraseña no es valida',
      'Usuario bloqueado, solicitar desbloqueo'
    ]

    // Errores de validación (400 - Bad Request)
    const validationErrors = [
      'El Id debe ser una cadena de texto',
      'El Id no puede tener mas de 12 caracteres',
      'El password debe tener minimo 8 caracteres'
    ]

    let statusCode = 500
    if (authErrors.includes(error.message)) {
      statusCode = 401
    } else if (validationErrors.includes(error.message)) {
      statusCode = 400
    }

    res.status(statusCode).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = login
