// authRoutes.js
const express = require('express')
const router = express.Router()
const authController = require('../auth/authController')

// Rutas para la autenticación
router.post('/login', authController.login)

module.exports = router
