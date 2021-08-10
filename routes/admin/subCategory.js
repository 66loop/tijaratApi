const express = require('express')
const router = express.Router()
const upload = require('../../config/multerService')
const subCategoryController = require('../../controllers/admin/subCategoryController')


router.get("/", subCategoryController.getAllSubCategories)

router.post("/",  subCategoryController.createSubCategory)

router.get("/:categoryId",  subCategoryController.getSubCategoryById)

router.put("/:categoryId", subCategoryController.updateSubCategory)

module.exports = router