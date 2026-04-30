const logger = require('../../utils/logger')
const userService = require('../../services/userService')

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers()
    res.status(200).json({ users, success: true })
  } catch (error) {
    logger.error('Error al obtener usuarios', { error })
    res.status(error.status || 500).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = getUsers
