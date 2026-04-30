const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

const sessionMiddleware = (req, res, next) => {
  req.user = null
  req.session = { user: null }

  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies?.access_token

  if (!token) {
    return next()
  }

  try {
    const data = jwt.verify(token, process.env.SECRET)
    req.user = data
    req.session.user = data
  } catch (err) {
    logger.warn('Token inválido o expirado', {
      message: err.message,
      path: req.originalUrl,
      method: req.method
    })
    if (req.cookies?.access_token) {
      res.clearCookie('access_token')
    }
  }

  next()
}

module.exports = sessionMiddleware
