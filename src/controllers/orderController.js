/* eslint-disable camelcase */
// orderController.js
const logger = require('../utils/logger')
const orderService = require('../services/orderService')

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders(req.query)
    res.status(200).json({ orders })
  } catch (error) {
    logger.error('Error al obtener ordenes', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener ordenes',
      success: false
    })
  }
}

const createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder(req.body)
    res.status(201).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al crear orden', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al crear orden',
      success: false
    })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.params.id)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al eliminar orden', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar orden',
      success: false
    })
  }
}

const getDetail = async (req, res) => {
  try {
    const result = await orderService.getOrderDetail(req.params.id)
    res.status(200).json({ success: true, detalle: result.detalle, total: result.total })
  } catch (error) {
    logger.error('Error al obtener detalles de orden', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener detalles de la orden',
      success: false
    })
  }
}

const getOrderStats = async (req, res) => {
  try {
    const stats = await orderService.getOrderStats(req.query)
    res.status(200).json({ success: true, stats })
  } catch (error) {
    logger.error('Error al obtener estadísticas de órdenes', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener estadísticas de órdenes',
      success: false
    })
  }
}

const getTopProductsReport = async (req, res) => {
  try {
    const report = await orderService.getTopProductsReport(req.query)
    res.status(200).json({ success: true, report })
  } catch (error) {
    logger.error('Error al obtener reporte de productos', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener reporte de productos',
      success: false
    })
  }
}

const getTopClientsReport = async (req, res) => {
  try {
    const report = await orderService.getTopClientsReport(req.query)
    res.status(200).json({ success: true, report })
  } catch (error) {
    logger.error('Error al obtener reporte de clientes', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener reporte de clientes',
      success: false
    })
  }
}

module.exports = {
  getOrders,
  createOrder,
  deleteOrder,
  getDetail,
  getOrderStats,
  getTopProductsReport,
  getTopClientsReport
}
