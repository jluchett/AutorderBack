const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

router.get("/", vehicleController.getVehicles);
router.post("/add", vehicleController.createVehicle)
router.put("/update/:id", vehicleController.updateVehicle)
router.delete("/delete/:id", vehicleController.deleteVehicle)

module.exports = router;