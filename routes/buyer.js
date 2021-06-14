var express = require("express");
var router = express.Router();
var BuyerController = require("../controllers/BuyerController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
    "/add-review",
    //   checkAuthMiddleware.checkAuth,
    BuyerController.receiveFeedback
);




module.exports = router;
