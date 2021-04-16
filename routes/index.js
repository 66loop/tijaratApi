var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController");
var SellerController = require("../controllers/SellerController");
var checkAuthMiddleware = require("../middleware/Check-auth");

/* GET home page. */

/*Authentication*/
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/socialSignin", UserController.socialSignin);
router.post("/seller-login", SellerController.sellerLogin);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/change-password", checkAuthMiddleware.checkAuth, UserController.changePassword);
/* GET users listing. */
router.get("/list", checkAuthMiddleware.checkAuth, UserController.getAllUsers);
router.get(
  "/:userId",
  checkAuthMiddleware.checkAuth,
  UserController.getUserById
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
