const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/", clientController.getClients);
router.post("/add", clientController.createClient)

module.exports = router;