const express = require('express')
const router = express.Router()
const upload = require('../../config/multerService')
const  categoryController = require('../../controllers/admin/categaryController')


router.get("/", categoryController.getAllcategories)

router.post("/", upload.any('images'), categoryController.createCategory)

router.get("/:categoryId",  categoryController.getcategoryById)

router.put("/:categoryId", upload.any('images'), categoryController.updateCategory)

module.exports = router