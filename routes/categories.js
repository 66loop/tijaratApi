var express = require("express");
var router = express.Router();
var CategoryController = require("../controllers/CategoryController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
  "/create",
  checkAuthMiddleware.checkAuth,
  CategoryController.createcategory
);

router.get(
  "/list",
  checkAuthMiddleware.checkAuth,
  CategoryController.getAllcategories
);
router.get(
  "/:CategoryId",
  checkAuthMiddleware.checkAuth,
  CategoryController.getcategoryById
);
router.patch(
  "/update/:CategoryId",
  checkAuthMiddleware.checkAuth,
  CategoryController.updatecategory
);
router.delete(
  "/delete/:CategoryId",
  checkAuthMiddleware.checkAuth,
  CategoryController.deletecategory
);

module.exports = router;
