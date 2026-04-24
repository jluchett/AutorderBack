//productRoutes.js
const express = require("express")
const router = express.Router()
const productController = require('../controllers/productController')
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get('/', productController.getProducts)
router.post('/add',productController.createProduct)
router.put('/update/:id',productController.updateProduct)
router.delete('/delete/:id',productController.deleteProduct)

module.exports = router;