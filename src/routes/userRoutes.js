// userRoutes.js
const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/users/userController.js')

// Rutas para administrar usuarios
router.post('/create', controllerUser.createUser)
router.get('/:id', controllerUser.getUser)
router.get('/', controllerUser.getUsers)
router.put('/locked/:id', controllerUser.lockUser)
router.post('/update/:id', controllerUser.updateUser)
router.put('/changepass/:id', controllerUser.changePassword)

module.exports = router
