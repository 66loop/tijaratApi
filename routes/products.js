var express = require("express");
var router = express.Router();
var ProductController = require("../controllers/ProductController");
var checkAuthMiddleware = require("../middleware/Check-auth");

router.post(
  "/create",
  checkAuthMiddleware.checkAuth,
  ProductController.createproduct
);

router.get(
  "/list",
  // checkAuthMiddleware.checkAuth,
  ProductController.getAllproducts
);
router.get(
  "/:productId",
  checkAuthMiddleware.checkAuth,
  ProductController.getproductById
);
router.patch(
  "/update/:productId",
  checkAuthMiddleware.checkAuth,
  ProductController.updateproduct
);
router.delete(
  "/delete/:productId",
  checkAuthMiddleware.checkAuth,
  ProductController.deleteproduct
);

module.exports = router;
