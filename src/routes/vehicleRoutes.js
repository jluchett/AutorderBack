// vehicleRoutes.js
const express = require('express')
const router = express.Router()
const vehicleController = require('../controllers/vehicleController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/', vehicleController.getVehicles)
router.post('/add', vehicleController.createVehicle)
router.put('/update/:placa', vehicleController.updateVehicle)
router.delete('/delete/:placa', vehicleController.deleteVehicle)
router.get('/client/:idClient', vehicleController.getVehiclesClient)

module.exports = router
