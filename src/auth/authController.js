const login = require('./login')
const logout = require('./logout')

const me = (req, res) => {
  const user = req.user || req.session?.user
  if (!user) {
    return res.status(401).json({
      message: 'No autenticado',
      success: false
    })
  }

  res.status(200).json({
    success: true,
    user
  })
}

module.exports = {
  login,
  logout,
  me
}
