var express = require("express");
var UserController = require("../controllers/userController");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send();
});

router.get(
  "/verify-user/:email",
  UserController.verifyUserByEmail
);
router.get(
  "/verify-code/:email/:code",
  UserController.verifyCode
);

module.exports = router;
