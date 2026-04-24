const logout = (req, res) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Sesión cerrada exitosamente', success: true })
}

module.exports = logout
