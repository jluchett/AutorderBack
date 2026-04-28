// clientRoutes.js
const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const authMiddleware = require('../middlewares/authMiddleware')
const { requirePermission } = require('../middlewares/permissionMiddleware')

router.use(authMiddleware)

router.get('/', requirePermission('view_clients'), clientController.getClients)
router.post('/add', requirePermission('manage_clients'), clientController.createClient)
router.put('/update/:id', requirePermission('manage_clients'), clientController.updateClient)
router.delete('/delete/:id', requirePermission('manage_clients'), clientController.deleteClient)

module.exports = router
