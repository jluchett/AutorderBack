const { getPermissionsForRole } = require('../utils/permissions')

const requirePermission = (permission) => {
  return (req, res, next) => {
    const user = req.session?.user
    if (!user) {
      return res.status(401).json({ message: 'Acceso no autorizado', success: false })
    }

    const permissions = getPermissionsForRole(user.role)
    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Acceso denegado: permiso insuficiente',
        success: false
      })
    }

    next()
  }
}

const requireRole = (...roles) => {
  return (req, res, next) => {
    const user = req.session?.user
    if (!user) {
      return res.status(401).json({ message: 'Acceso no autorizado', success: false })
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: 'Acceso denegado: rol insuficiente',
        success: false
      })
    }

    next()
  }
}

const allowSelfOrRole = (...roles) => {
  return (req, res, next) => {
    const user = req.session?.user
    if (!user) {
      return res.status(401).json({ message: 'Acceso no autorizado', success: false })
    }

    if (req.params.id && req.params.id === user.id) {
      return next()
    }

    if (roles.includes(user.role)) {
      return next()
    }

    return res.status(403).json({
      message: 'Acceso denegado: sólo el propio usuario o rol autorizado puede acceder',
      success: false
    })
  }
}

module.exports = {
  requirePermission,
  requireRole,
  allowSelfOrRole
}
