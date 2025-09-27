const express = require("express");
const router = express.Router();

const authorize = require("../middleware/authorize.middleware.js")
const approveSeller = require("../controller/admin/approveSeller.controller.js")
const disapproveSeller = require("../controller/admin/disapproveSeller.controller.js")
const getAllSellerRequests = require("../controller/admin/getAllSellerRequests.controller.js")


router.patch('/approveSeller/:userId',authorize("admin"),approveSeller)
router.patch('/disapproveSeller/:userId',authorize("admin"),disapproveSeller)
router.get('/getAllSellerRequests',authorize("admin"),getAllSellerRequests)


module.exports = router;
