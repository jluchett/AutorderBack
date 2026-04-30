// clientController.js
const logger = require('../utils/logger')
const clientService = require('../services/clientService')

const getClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients(req.query)
    res.status(200).json({ clients })
  } catch (error) {
    logger.error('Error al obtener clientes', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener clientes',
      success: false
    })
  }
}

const createClient = async (req, res) => {
  try {
    const result = await clientService.createClient(req.body)
    res.status(201).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al crear cliente', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al crear cliente',
      success: false
    })
  }
}

const updateClient = async (req, res) => {
  try {
    const result = await clientService.updateClient(req.params.id, req.body)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al actualizar info del cliente', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al actualizar info del cliente',
      success: false
    })
  }
}

const deleteClient = async (req, res) => {
  try {
    const result = await clientService.deleteClient(req.params.id)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al eliminar cliente', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar cliente',
      success: false
    })
  }
}

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient
}
