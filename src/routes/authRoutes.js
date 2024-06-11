//authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas para la autenticación
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
