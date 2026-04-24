// userRoutes.js
const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/users/userController.js')
const authMiddleware = require('../middlewares/authMiddleware')

// Rutas para administrar usuarios (Protegidas)
router.use(authMiddleware)

router.post('/create', controllerUser.createUser)
router.get('/:id', controllerUser.getUser)
router.get('/', controllerUser.getUsers)
router.put('/locked/:id', controllerUser.lockUser)
router.post('/update/:id', controllerUser.updateUser)
router.put('/changepass/:id', controllerUser.changePassword)

module.exports = router
