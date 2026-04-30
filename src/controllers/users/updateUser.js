const logger = require('../../utils/logger')
const userService = require('../../services/userService')

const updateUser = async (req, res) => {
  const { id } = req.params
  try {
    const result = await userService.updateUser(id, req.body)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al actualizar usuario', { error, userId: id, body: req.body })
    res.status(error.status || 500).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = updateUser
