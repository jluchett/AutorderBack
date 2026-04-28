// vehicleRoutes.js
const express = require('express')
const router = express.Router()
const vehicleController = require('../controllers/vehicleController')
const authMiddleware = require('../middlewares/authMiddleware')
const { requirePermission } = require('../middlewares/permissionMiddleware')

router.use(authMiddleware)

router.get('/', requirePermission('view_vehicles'), vehicleController.getVehicles)
router.post('/add', requirePermission('manage_vehicles'), vehicleController.createVehicle)
router.put('/update/:placa', requirePermission('manage_vehicles'), vehicleController.updateVehicle)
router.delete('/delete/:placa', requirePermission('manage_vehicles'), vehicleController.deleteVehicle)
router.get('/client/:idClient', requirePermission('view_vehicles'), vehicleController.getVehiclesClient)

module.exports = router
