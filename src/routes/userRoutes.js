// userRoutes.js
const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/users/userController.js')
const authMiddleware = require('../middlewares/authMiddleware')

// Rutas para administrar usuarios (Protegidas)
router.post('/create', controllerUser.createUser)

router.use(authMiddleware)

router.get('/:id', controllerUser.getUser)
router.get('/', controllerUser.getUsers)
router.put('/locked/:id', controllerUser.lockUser)
router.put('/update/:id', controllerUser.updateUser)
router.put('/changepass/:id', controllerUser.changePassword)

module.exports = router
