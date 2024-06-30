const db = require('../../database/db')
const bcrypt = require('bcrypt')

const createUser = async (req, res) => {
  const { id, name, password, role = 'ventas' } = req.body
  try {
    if (typeof id !== 'string') throw new Error('El Id debe ser una cadena de texto')
    if (id.length > 12) throw new Error('El Id no puede tener mas de 12 caracteres')
    if (typeof name !== 'string') throw new Error('El nombre debe ser una cadena de texto')
    if (name.length < 5) throw new Error('El nombre debe tener minimo 5 letras')
    if (typeof password !== 'string') throw new Error('el password debe ser una cadena de texto')
    if (password.length < 8) throw new Error('El password debe tener minimo 8 caracteres')

    const usuario = await db.query('SELECT id FROM users WHERE id = $1', [id])

    if (usuario.rows.length > 0) throw new Error('Usuario con este id ya esta registrado')

    const hashedPassword = await bcrypt.hash(password, 10)
    const insertQuery = 'INSERT INTO users (id, name, password, role) VALUES ($1, $2, $3, $4) RETURNING name'
    const insertValues = [id, name, hashedPassword, role]
    const result = await db.query(insertQuery, insertValues)
    res.status(201).json({
      mensaje: `Usuario ${result.rows[0].name} creado exitosamente`,
      success: true
    })
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
      success: false
    })
  }
}
module.exports = createUser
