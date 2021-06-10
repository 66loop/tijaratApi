var express = require("express");
var router = express.Router();
var ProductController = require("../controllers/ProductController");
var checkAuthMiddleware = require("../middleware/check-auth");
var upload = require("../config/multerService");

router.post(
  "/create",
  checkAuthMiddleware.checkAuth,
  upload.any('pictures'),
  ProductController.createproduct
);

router.get(
  "/list",
  // checkAuthMiddleware.checkAuth,
  ProductController.getAllproducts
);

router.get(
  "/by-seller/:sellerid",
  checkAuthMiddleware.checkAuth,
  ProductController.getAllproductsOfSeller
);

router.get(
  "/:productId",
  checkAuthMiddleware.checkAuth,
  ProductController.getproductById
);
router.patch(
  "/update/:productId",
  checkAuthMiddleware.checkAuth,
  upload.any('pictures'),
  ProductController.updateproduct
);
router.patch(
  "/update-status/:productId",
  // checkAuthMiddleware.checkAuth,
  ProductController.updateproductToInActive
);
router.delete(
  "/delete/:productId",
  checkAuthMiddleware.checkAuth,
  ProductController.deleteproduct
);

module.exports = router;
