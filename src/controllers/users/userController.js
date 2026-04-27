const createUser = require('./createUser')
const getUser = require('./getUser')
const getUsers = require('./getUsers')
const lockUser = require('./lockUser')
const updateUser = require('./updateUser')
const changePassword = require('./changePassword')
const deleteUser = require('./deleteUser')

module.exports = {
  createUser,
  getUser,
  getUsers,
  lockUser,
  updateUser,
  changePassword,
  deleteUser
}
