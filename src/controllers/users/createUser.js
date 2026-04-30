const logger = require('../../utils/logger')
const userService = require('../../services/userService')

const createUser = async (req, res) => {
  logger.info('Iniciando creación de usuario', { userId: req.body.id })

  try {
    const result = await userService.createUser(req.body)
    res.status(201).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al crear usuario', { error, requestBody: req.body })
    res.status(error.status || 400).json({
      message: error.message,
      success: false
    })
  }
}
module.exports = createUser
