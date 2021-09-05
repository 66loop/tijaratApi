var express = require('express')
var router = express.Router()
var productController = require('../../controllers/admin/productController')
var upload = require("../../config/multerService");
const { createproduct } = require('../../controllers/ProductController')

router.get("/", productController.getAllProducts)

router.get("/serch", productController.searchProducts)

router.get("/of-seller/:sellerId", productController.getAllProductsbySeller)

router.post("/",upload.any('pictures'), createproduct)

router.put("/:productId", productController.updateProductByadmin)

router.get("/:productId", productController.getAProduct)



module.exports = router