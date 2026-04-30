// userRoutes.js
const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/users/userController.js')
const authMiddleware = require('../middlewares/authMiddleware')
const { requirePermission, allowSelfOrRole } = require('../middlewares/permissionMiddleware')

// Rutas para administrar usuarios (Protegidas)
router.post('/create', authMiddleware, requirePermission('manage_users'), controllerUser.createUser)

router.use(authMiddleware)

router.get('/:id', allowSelfOrRole('admin'), controllerUser.getUser)
router.get('/', requirePermission('view_users'), controllerUser.getUsers)
router.put('/locked/:id', requirePermission('manage_users'), controllerUser.lockUser)
router.put('/update/:id', allowSelfOrRole('admin'), controllerUser.updateUser)
router.put('/changepass/:id', allowSelfOrRole('admin'), controllerUser.changePassword)
router.delete('/:id', requirePermission('manage_users'), controllerUser.deleteUser)

module.exports = router
