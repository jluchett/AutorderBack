// userRoutes.js
const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/users/userController.js')

// Rutas para la creación de usuarios
router.post('/create', controllerUser.createUser)
router.get('/getUser/:id', controllerUser.getUser)
router.get('/users', controllerUser.getUsers)

module.exports = router
