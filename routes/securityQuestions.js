var express = require("express");
var router = express.Router();
var SecurityQuestionController = require("../controllers/SecurityQuestionController");
var userController = require("../controllers/userController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.get(
  "/get-all",
  // checkAuthMiddleware.checkAuth,
  SecurityQuestionController.securityQuestion
);

router.patch(
  "/add-security-questions/:userId",
  // checkAuthMiddleware.checkAuth,
  userController.addOrUpdateSQ
);




module.exports = router;
