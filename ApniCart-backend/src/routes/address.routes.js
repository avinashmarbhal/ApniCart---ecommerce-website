const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize.middleware.js")
const addAddress = require("../controller/address/addAddress.controller.js")
const updateAddress = require("../controller/address/updateAddress.controller.js")
const removeAddress = require("../controller/address/removeAddress.controller.js")
const getAllAddresses = require("../controller/address/getAllAddress.controller.js")
const getAddressById = require("../controller/address/getAddressById.controller.js")
const getDefaultAddress = require("../controller/address/getDefaultAddress.controller.js")
const setDefaultAddress = require("../controller/address/setDefaultAddress.controller.js")


router.post("/addAddress",authorize("user","verifyUser","seller"),addAddress)
router.get("/getAllAddresses",authorize("user","verifyUser","seller"),getAllAddresses)
router.get("/getDefaultAddress",authorize("user","verifyUser","seller"),getDefaultAddress)
router.get("/getAddressById/:addressId",authorize("user","verifyUser","seller"),getAddressById)
router.patch("/updateAddress/:addressId",authorize("user","verifyUser","seller"),updateAddress)
router.patch("/setDefaultAddress/:addressId",authorize("user","verifyUser","seller"),setDefaultAddress)
router.delete("/removeAddress/:addressId",authorize("user","verifyUser","seller"),removeAddress)




module.exports = router;