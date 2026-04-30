// authRoutes.js
const express = require('express')
const router = express.Router()
const authController = require('../auth/authController')
const authMiddleware = require('../middlewares/authMiddleware')

// Rutas para la autenticación
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/me', authMiddleware, authController.me)

module.exports = router
