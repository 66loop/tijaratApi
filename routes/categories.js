var express = require("express");
var router = express.Router();
var CategoryController = require("../controllers/CategoryController");
var SubCategoryController = require("../controllers/SubCategoryController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
  "/create",
  checkAuthMiddleware.checkAuth,
  CategoryController.createcategory
);

router.post(
  "/add-sub-category",
  checkAuthMiddleware.checkAuth,
  SubCategoryController.addSubCategoryToCategory
);

router.get(
  "/list",
  checkAuthMiddleware.checkAuth,
  CategoryController.getAllcategories
);
router.get(
  "/:categoryid",
  checkAuthMiddleware.checkAuth,
  CategoryController.getcategoryById
);
router.patch(
  "/update/:categoryid",
  checkAuthMiddleware.checkAuth,
  CategoryController.updatecategory
);
router.delete(
  "/delete/:categoryid",
  checkAuthMiddleware.checkAuth,
  CategoryController.deletecategory
);
router.delete(
  "/delete-sub-category/:subcategoryid",
  checkAuthMiddleware.checkAuth,
  SubCategoryController.deletecategory
);

router.patch(
  "/update-sub-category/:subcategoryid",
  checkAuthMiddleware.checkAuth,
  SubCategoryController.updateSubCategory
);

module.exports = router;
