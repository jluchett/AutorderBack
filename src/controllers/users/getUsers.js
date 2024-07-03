const db = require('../../database/db')

const getUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT id, name, role, locked FROM users ORDER BY name')
    if (users.rows.length === 0) throw new Error('No se encontraron usuarios')
    res.status(200).json({
      users: users.rows,
      success: true
    })
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      success: false
    })
  }
}
module.exports = getUsers
