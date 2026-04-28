const db = require('../../database/db')
const logger = require('../../utils/logger')

const getUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT id, name, role, locked FROM users ORDER BY name')
    res.status(200).json({
      users: users.rows || [],
      success: true
    })
  } catch (error) {
    logger.error('Error al obtener usuarios', { error })
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = getUsers
