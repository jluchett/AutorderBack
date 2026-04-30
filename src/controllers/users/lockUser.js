const logger = require('../../utils/logger')
const userService = require('../../services/userService')

const lockUser = async (req, res) => {
  const { id } = req.params
  const { locked } = req.body
  try {
    const result = await userService.lockUser(id, locked)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al actualizar estado de usuario', { error, userId: id, locked })
    res.status(error.status || 500).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = lockUser
