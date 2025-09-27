const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize.middleware.js")
const addItem = require("../controller/cart/addItem.controller.js")
const removeItem = require("../controller/cart/removeItem.controller.js")
const selectToggle = require("../controller/cart/selectToggle.controller.js")
const increaseQuantity = require("../controller/cart/increaseQuantity.controller.js")
const decreaseQuantity = require("../controller/cart/decreaseQuantity.controller.js")
const removeSelectedItems = require("../controller/cart/removeSelectedItems.controller.js")
const getCart = require("../controller/cart/getCart.controller.js")
const getSelectedCartItems = require("../controller/cart/getSelectedCartItems.controller.js")

router.get("/",authorize("user","verifyUser"),getCart)
router.get("/selected",authorize("user","verifyUser"),getSelectedCartItems)
router.post("/addItem",authorize("user","verifyUser"),addItem)
router.delete("/removeItem/:productId",authorize("user","verifyUser"),removeItem)
router.delete("/removeSelectedItems",authorize("user","verifyUser"),removeSelectedItems)
router.patch("/selectToggle/:productId",authorize("user","verifyUser"),selectToggle)
router.patch("/increaseQuantity/:productId",authorize("user","verifyUser"),increaseQuantity)
router.patch("/decreaseQuantity/:productId",authorize("user","verifyUser"),decreaseQuantity)

module.exports = router;