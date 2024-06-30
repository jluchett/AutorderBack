// userRoutes.js
const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/users/userController.js')

// Rutas para la creación de usuarios
router.post('/create', controllerUser.createUser)

module.exports = router
