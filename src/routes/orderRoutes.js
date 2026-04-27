// orderRoutes.js
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/', orderController.getOrders)
router.post('/add', orderController.createOrder)
router.delete('/delete/:id', orderController.deleteOrder)
router.get('/detail/:id', orderController.getDetail)

module.exports = router
