var express = require("express");
var router = express.Router();
var OrderController = require("../controllers/OrderController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
  "/",
  checkAuthMiddleware.checkAuth,
  OrderController.createOrder
);

router.get(
  "/:sellerId",
  checkAuthMiddleware.checkAuth,
  OrderController.getOrder
);

router.get(
  "/get-by-review/:reviewKey",
  // checkAuthMiddleware.checkAuth,
  OrderController.getOrderByReviewKey
);

router.patch(
  "/:orderId",
  checkAuthMiddleware.checkAuth,
  OrderController.updateOrder
);

router.get(
  "/user/:userId",
  checkAuthMiddleware.checkAuth,
  OrderController.getOrderByUser
);


module.exports = router;
