// orderRoutes.js
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware')
const { requirePermission } = require('../middlewares/permissionMiddleware')

router.use(authMiddleware)

router.get('/', requirePermission('view_orders'), orderController.getOrders)
router.post('/add', requirePermission('manage_orders'), orderController.createOrder)
router.delete('/delete/:id', requirePermission('manage_orders'), orderController.deleteOrder)
router.get('/detail/:id', requirePermission('view_orders'), orderController.getDetail)

module.exports = router
