// userRoutes.js
const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/users/userController.js')
const authMiddleware = require('../middlewares/authMiddleware')
const { requirePermission, requireRole, allowSelfOrRole } = require('../middlewares/permissionMiddleware')

// Rutas para administrar usuarios (Protegidas)
router.post('/create', authMiddleware, requireRole('admin'), controllerUser.createUser)

router.use(authMiddleware)

router.get('/:id', allowSelfOrRole('admin'), controllerUser.getUser)
router.get('/', requirePermission('view_users'), controllerUser.getUsers)
router.put('/locked/:id', requireRole('admin'), controllerUser.lockUser)
router.put('/update/:id', allowSelfOrRole('admin'), controllerUser.updateUser)
router.put('/changepass/:id', allowSelfOrRole('admin'), controllerUser.changePassword)
router.delete('/:id', requireRole('admin'), controllerUser.deleteUser)

module.exports = router
