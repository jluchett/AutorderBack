// authMiddleware.js
const authMiddleware = (req, res, next) => {
  const user = req.user || req.session?.user
  if (!user) {
    return res.status(401).json({
      message: 'Acceso no autorizado. Debe iniciar sesión.',
      success: false
    })
  }
  req.user = user
  req.session = req.session || { user }
  req.session.user = user
  next()
}

module.exports = authMiddleware
