/* eslint-disable camelcase */
// vehicleController.js
const logger = require('../utils/logger')
const vehicleService = require('../services/vehicleService')

const getVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles(req.query)
    res.status(200).json({ vehicles })
  } catch (error) {
    logger.error('Error al obtener Vehiculos', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener Vehiculos',
      success: false
    })
  }
}

const createVehicle = async (req, res) => {
  try {
    const result = await vehicleService.createVehicle(req.body)
    res.status(201).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al ingresar vehiculo', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al registrar vehiculo',
      success: false
    })
  }
}

const updateVehicle = async (req, res) => {
  try {
    const result = await vehicleService.updateVehicle(req.params.placa, req.body)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al actualizar info del vehiculo', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al actualizar datos del vehiculo',
      success: false
    })
  }
}

const deleteVehicle = async (req, res) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.placa)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    logger.error('Error al eliminar Vehiculo', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar Vehiculo',
      success: false
    })
  }
}

const getVehiclesClient = async (req, res) => {
  try {
    const vehiclesClient = await vehicleService.getVehiclesByClient(req.params.idClient)
    res.status(200).json({ vehiclesClient })
  } catch (error) {
    logger.error('Error al obtener vehículos del cliente', { error })
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener vehículos del cliente',
      success: false
    })
  }
}

module.exports = {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesClient
}
