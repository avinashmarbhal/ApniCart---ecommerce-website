const express = require("express")
const router = express.Router()
const authorize = require("../middleware/authorize.middleware.js")

const addReview = require("../controller/review/addReview.controller")
const updateReview = require("../controller/review/updateReview.controller")
const removeReview = require("../controller/review/removeReview.controller")
const likeReview = require("../controller/review/likeReview.controller.js")
const dislikeReview = require("../controller/review/dislikeReview.controller.js")
const getAllReviewsByProductId = require("../controller/review/getAllReviewsByProductId.controller.js")

router.post("/addReview",authorize("verifyUser"),addReview)
router.patch("/updateReview",authorize("verifyUser"),updateReview)
router.delete("/removeReview/:reviewId",authorize("verifyUser"),removeReview)
router.post("/likeReview/:reviewId",authorize("verifyUser"),likeReview)
router.post("/dislikeReview/:reviewId",authorize("verifyUser"),dislikeReview)
router.get("/getAllReviewsByProductId/:productId",getAllReviewsByProductId)


module.exports = router;
