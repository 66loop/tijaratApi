var express = require("express");
var router = express.Router();
var SellerController = require("../controllers/SellerController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
  "/add-payment-method",
  checkAuthMiddleware.checkAuth,
  SellerController.addPaymentMethod
);

router.delete(
  "/remove-payment-method/:method",
  checkAuthMiddleware.checkAuth,
  SellerController.removePaymentMethod
);

router.patch(
  "/update-payment-method",
  checkAuthMiddleware.checkAuth,
  SellerController.updateAPaymentMethod
);
router.patch(
  "/mark-payment-method/:method",
  checkAuthMiddleware.checkAuth,
  SellerController.markPaymentMethodAsPrimary
);



module.exports = router;
