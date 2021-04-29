var express = require("express");
var router = express.Router();
var UserController = require("../controllers/userController");
var SellerController = require("../controllers/SellerController");
var checkAuthMiddleware = require("../middleware/check-auth");
var upload = require("../config/multerService");

/* GET home page. */

/*Authentication*/
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/socialSignin", UserController.socialSignin);
router.post("/seller-login", SellerController.sellerLogin);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/change-password", checkAuthMiddleware.checkAuth, UserController.changePassword);
router.post("/upload-any-image", upload.any('pictures'), UserController.uploadImage);
/* GET users listing. */
router.get("/list", checkAuthMiddleware.checkAuth, UserController.getAllUsers);
router.get(
  "/:userId",
  checkAuthMiddleware.checkAuth,
  UserController.getUserById
);

router.get(
  "/seller/:sellerId",
  checkAuthMiddleware.checkAuth,
  UserController.getSellerById
);

router.post(
  "/register-as-seller",
  checkAuthMiddleware.checkAuth,
  UserController.registerUserAsSeller
);
router.patch(
  "/update/:userId",
  checkAuthMiddleware.checkAuth,
  UserController.updateUser
);
router.delete(
  "/delete/:userId",
  checkAuthMiddleware.checkAuth,
  UserController.deleteUser
);

module.exports = router;
