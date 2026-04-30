// productController.js
const logger = require('../utils/logger')
const productService = require('../services/productService')

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts()
    res.status(200).json({ products })
  } catch (error) {
    logger.error('Error al obtener productos', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener productos',
      success: false
    })
  }
}

const createProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body)
    res.status(201).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al crear producto', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al crear producto',
      success: false
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al actualizar producto', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al actualizar producto',
      success: false
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al eliminar producto', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar producto',
      success: false
    })
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
}
