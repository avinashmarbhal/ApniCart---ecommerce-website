const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize.middleware.js")
const placeOrder = require("../controller/order/placeOrder.controller.js")
const cancelOrder = require("../controller/order/cancelOrder.controller.js")
const updateOrderStatus = require("../controller/order/updateOrderStatus.controller.js")
const getAllOrders = require("../controller/order/getAllOrders.controller.js")

router.post("/placeOrder",authorize("verifyUser"),placeOrder)
router.patch("/cancelOrder",authorize("user","seller","admin"),cancelOrder)
router.patch("/updateOrderStatus",authorize("admin"),updateOrderStatus)
router.get("/orders",authorize("verifyUser"),getAllOrders)

module.exports = router;
