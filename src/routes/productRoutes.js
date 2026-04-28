// productRoutes.js
const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const authMiddleware = require('../middlewares/authMiddleware')
const { requirePermission } = require('../middlewares/permissionMiddleware')

router.use(authMiddleware)

router.get('/', requirePermission('view_products'), productController.getProducts)
router.post('/add', requirePermission('manage_products'), productController.createProduct)
router.put('/update/:id', requirePermission('manage_products'), productController.updateProduct)
router.delete('/delete/:id', requirePermission('manage_products'), productController.deleteProduct)

module.exports = router
