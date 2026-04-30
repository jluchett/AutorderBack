const logger = require('../../utils/logger')
const userService = require('../../services/userService')

const getUser = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await userService.getUserById(id)
    res.status(200).json({ usuario, success: true })
  } catch (error) {
    logger.error('Error al obtener usuario', { error, userId: id })
    res.status(error.status || 400).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = getUser
