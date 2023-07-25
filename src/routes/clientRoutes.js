const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/", clientController.getClients);
router.post("/add", clientController.createClient)
router.put("/update/:id", clientController.updateClient)
router.delete("/delete/:id", clientController.deleteClient)

module.exports = router;