var express = require('express')
var router = express.Router()
var productController = require('../../controllers/admin/productController')
var upload = require("../../config/multerService");
const { createproduct } = require('../../controllers/ProductController')

router.get("/", async (req, res, next) => {
    try {
        res.send(await productController.getAllProducts()) 
    } catch (error) {
        next(error)
    }
})

router.get("/serch", async (req,res, next) => {
    try {
        res.send( await productController.searchProducts(req.query))
    } catch (error) {
        next(error)
    }
})

router.get("/of-seller/:sellerId", async (req,res, next) => {
    try {
        res.send( await productController.getAllProductsbySeller(req.params.sellerId))
    } catch (error) {
        next(error)
    }
})


router.post("/",upload.any('pictures'), createproduct)

router.put("/:productId", async (req, res, next) => {
    try {
        res.send(await productController.updateProductByadmin( req.params.productId, req.body )) 
    } catch (error) {
        next(error)
    }
})



module.exports = router