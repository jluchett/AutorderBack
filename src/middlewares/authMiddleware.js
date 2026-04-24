// authMiddleware.js
const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: 'Acceso no autorizado. Debe iniciar sesión.',
      success: false
    })
  }
  next()
}

module.exports = authMiddleware
