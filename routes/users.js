var express = require("express");
var UserController = require("../controllers/userController");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send();
});

router.get(
  "/verifyuser",
  UserController.verifyUserByEmail
  // res.send();
);


module.exports = router;
