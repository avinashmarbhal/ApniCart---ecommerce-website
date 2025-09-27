const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize.middleware.js")
const upload = require("../middleware/multer.middleware.js")
const addProduct = require("../controller/product/addProduct.controller.js");
const removeProduct = require("../controller/product/removeProduct.controller.js")
const updateProduct = require("../controller/product/updateProduct.controller.js")
const getAllProducts = require("../controller/product/getAllProduct.controller.js")
const getProductById = require("../controller/product/getProductById.controller.js")
const getAllProductByCategory = require("../controller/product/getAllProductByCategory.controller.js")
const getAllProductByUserId = require("../controller/product/getProductByUserId.controller.js")
const getAllProductBySubCategory = require("../controller/product/getAllProductBySubCategory.controller.js")
const productSearch = require("../controller/product/productSearch.controller.js")
const getSuggestions = require("../controller/product/productSuggestion.controller.js")


router.post('/addProduct',upload.single("imageFile"),authorize("seller"),addProduct)
router.patch('/updateProduct',upload.single("imageFile"),authorize("seller"),updateProduct)
router.delete('/removeProduct',authorize("seller"),removeProduct)
router.get('/getSuggestions',getSuggestions)
router.get('/productSearch',productSearch)
router.get('/getAllProducts',getAllProducts)
router.get('/getProductById/:productId',getProductById)
router.get('/getAllProductByCategory',getAllProductByCategory)
router.get('/getAllProductBySubCategory',getAllProductBySubCategory)
router.get('/getAllProductByUserId',authorize("seller"),getAllProductByUserId)

module.exports = router;
