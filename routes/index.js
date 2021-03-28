var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController");
var checkAuthMiddleware = require("../middleware/Check-auth");

/* GET home page. */

/*Authentication*/
router.post("/register", UserController.register);
router.post("/login", UserController.login);
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
