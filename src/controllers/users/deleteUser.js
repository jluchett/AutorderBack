const logger = require('../../utils/logger')
const userService = require('../../services/userService')

const deleteUser = async (req, res) => {
  const { id } = req.params

  try {
    const result = await userService.deleteUser(id)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al eliminar usuario', { error, userId: id })
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al eliminar usuario'
    })
  }
}

module.exports = deleteUser
