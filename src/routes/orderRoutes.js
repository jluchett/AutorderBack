//orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/",orderController.getOrders)
router.post("/add",orderController.createOrder);
router.delete("/delete/:id", orderController.deleteOrder)
router.get("/detail/:id", orderController.getDetail)

module.exports = router;