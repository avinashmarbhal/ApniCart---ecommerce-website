const express = require("express");
const router = express.Router();
const addCategory = require("../controller/category/addCategory.controller.js");
const addSubCategory = require("../controller/category/addSubCategory.controller.js");
const authorize = require("../middleware/authorize.middleware.js")
const getAllCategory = require("../controller/category/getAllCategory.controller.js")
const getAllSubCategory = require("../controller/category/getAllSubCategory.controller.js")
const removeCategory = require("../controller/category/removeCategory.controller.js")
const removeSubCategory = require("../controller/category/removeSubCategory.controller.js")
const getProductsByCategory = require("../controller/category/getProductsByCategory.controller.js")
const getProductsBySubCategory = require("../controller/category/getProductsBySubCategory.controller.js")

router.post("/addCategory", authorize("admin"), addCategory);
router.post("/addSubCategory", authorize("admin"), addSubCategory);
router.get("/allCategory",getAllCategory)
router.get("/allSubCategory",getAllSubCategory)
router.get("/by-category/:categoryId", getProductsByCategory);
router.get("/by-subCategory/:subCategoryId", getProductsBySubCategory);
router.delete("/removeCategory/:id",authorize("admin"),removeCategory)
router.delete("/removeSubCategory/:id",authorize("admin"),removeSubCategory)

module.exports = router;
