const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas para la creación de usuarios
router.post('/signup', userController.createUser);
router.put('/update/:id', userController.updateUser);

module.exports = router;
