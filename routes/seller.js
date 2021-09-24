var express = require("express");
const upload = require("../config/multerService");
var router = express.Router();
var SellerController = require("../controllers/SellerController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
  "/add-payment-method",
  checkAuthMiddleware.checkAuth,
  SellerController.addPaymentMethod
);

router.post(
  "/add-review",
  // checkAuthMiddleware.checkAuth,
  SellerController.receiveFeedback
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

router.post(
  "/bulk-upload",
  // checkAuthMiddleware.checkAuth,
  upload.any('pictures'),
  SellerController.bulkUpload
);

router.get(
  "/dashboard/:id",
  // checkAuthMiddleware.checkAuth,
  SellerController.dashboard
);

router.get(
  "/get-seller/:id",
  // checkAuthMiddleware.checkAuth,
  SellerController.getSeller
);

router.patch(
  "/update-seller/:id",
  // checkAuthMiddleware.checkAuth,
  SellerController.updateSellerReq
);




module.exports = router;
