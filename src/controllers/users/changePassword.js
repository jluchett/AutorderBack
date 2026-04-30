const logger = require('../../utils/logger')
const userService = require('../../services/userService')

const changePassword = async (req, res) => {
  const { id } = req.params
  const { password } = req.body
  logger.info('Iniciando cambio de contraseña', { userId: id })
  try {
    const result = await userService.changePassword(id, password)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error en changePassword', {
      userId: id,
      message: error.message,
      stack: error.stack
    })
    res.status(error.status || 500).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = changePassword
