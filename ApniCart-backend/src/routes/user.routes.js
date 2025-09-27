const express = require("express");
const router = express.Router();

//user controller
const signup = require("../controller/user/signup.controller.js");
const login = require("../controller/user/login.controller.js");
const logoutUser = require("../controller/user/logout.controller.js")
const updateUserInfo = require("../controller/user/updateUserInfo.controller.js")
const chnagePassword = require("../controller/user/changePassword.controller.js")
const sendOtpController = require("../controller/user/sendOtp.controller.js")
const verifyOtpController = require("../controller/user/verifyOtp.controller.js")
const requestSeller = require("../controller/user/requestSeller.controller.js")
const cancelSellerRequest =  require("../controller/user/cancelSellerRequest.controller.js")
const checkEmailExists  = require("../controller/user/checkEmailExists.controller.js")

const authorize = require("../middleware/authorize.middleware.js")

router.get('/verify', authorize("user","seller","admin","verifyUser"), (req, res) => {
    res.json({ user: req.user });
  });
router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',authorize("user","seller","admin","verifyUser"),logoutUser)
router.patch('/updateUser',authorize("user","seller","admin","verifyUser"),updateUserInfo)
router.patch('/updatePass',chnagePassword)
router.post('/sendOtpController',authorize("user"),sendOtpController)
router.post('/sendOtpController/:email',sendOtpController)
router.patch('/verifyOtpController',authorize("user"),verifyOtpController)
router.patch('/verifyOtpController/:email',verifyOtpController)
router.patch('/requestSeller',authorize("verifyUser"),requestSeller)
router.patch('/cancelSellerRequest',authorize("verifyUser"),cancelSellerRequest)
router.get('/checkEmailExists/:email',checkEmailExists)


module.exports = router;
