// productController.js
const db = require('../database/db')
const logger = require('../utils/logger')
const { validateName, validatePrice } = require('../utils/validators')

const getProducts = async (req, res) => {
  try {
    const query = 'SELECT * FROM prodserv order by nombre'
    const result = await db.query(query)
    const products = result.rows || []
    res.status(200).json({
      products
    })
  } catch (error) {
    logger.error('Error al obtener productos', { error })
    res.status(500).json({ message: 'Error al obtener productos' })
  }
}

const createProduct = async (req, res) => {
  try {
    const { nombre, precio } = req.body

    // Validar campos requeridos
    if (!nombre || precio === undefined) {
      return res.status(400).json({
        message: 'Los campos nombre y precio son obligatorios',
        success: false
      })
    }

    // Validar formato de datos
    validateName(nombre)
    validatePrice(precio)

    // Verificar si el producto ya existe en la base de datos
    const query = 'SELECT * FROM prodserv WHERE nombre = $1'
    const values = [nombre]
    const result = await db.query(query, values)

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: 'Ya hay un producto con ese nombre',
        success: false
      })
    }

    // Ingresar producto a la base de datos
    const insertQuery = 'INSERT INTO prodserv (nombre, precio) VALUES ($1, $2)'
    const insertValues = [nombre, precio]
    await db.query(insertQuery, insertValues)
    res.status(201).json({
      success: true,
      message: 'producto agregado con exito'
    })
  } catch (error) {
    logger.error('Error al crear producto', { error })
    res.status(500).json({
      message: error.message || 'Error al crear producto',
      success: false
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, precio } = req.body

    // Validar que al menos un campo a actualizar sea proporcionado
    if (!nombre && precio === undefined) {
      return res.status(400).json({
        message: 'Debe proporcionar al menos un campo para actualizar',
        success: false
      })
    }

    // Validar formatos si se proporcionan
    if (nombre) validateName(nombre)
    if (precio !== undefined) validatePrice(precio)

    const query = 'UPDATE prodserv SET nombre = $2, precio = $3 WHERE id = $1'
    const values = [id, nombre, precio]

    const result = await db.query(query, values)

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'No se pudo actualizar producto - Producto no encontrado',
        success: false
      })
    }

    return res.status(200).json({
      message: 'Datos del producto actualizados',
      success: true
    })
  } catch (error) {
    logger.error('Error al actualizar producto', { error })
    res.status(500).json({
      message: error.message || 'Error al actualizar producto',
      success: false
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar si el producto está siendo usado en órdenes
    const detalleQuery = 'SELECT COUNT(*) FROM detalle_ordenes WHERE producto_id = $1'
    const detalleResult = await db.query(detalleQuery, [id])

    if (detalleResult.rows[0].count > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar el producto. Está siendo usado en órdenes',
        success: false
      })
    }

    const query = 'DELETE FROM prodserv WHERE id = $1'
    const result = await db.query(query, [id])

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: 'No se pudo eliminar el producto - No encontrado',
        success: false
      })
    }

    return res.status(201).json({
      message: 'Producto eliminado con exito',
      success: true
    })
  } catch (error) {
    logger.error('Error al eliminar producto', { error })
    res.status(500).json({
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
