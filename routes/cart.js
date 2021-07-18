var express = require("express");
var router = express.Router();
var CartController = require("../controllers/CartController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
    "/:userId",
    //   checkAuthMiddleware.checkAuth,
    CartController.addToCart
);

// router.get(
//     "/seller/:sellerId",
//     //   checkAuthMiddleware.checkAuth,
//     OfferController.getForSeller
// );

// router.get(
//     "/:offerId",
//     //   checkAuthMiddleware.checkAuth,
//     OfferController.getOffer
// );

// router.patch(
//     "/seller/:offerId/:rejected",
//     //   checkAuthMiddleware.checkAuth,
//     OfferController.acceptOrRejectBySeller
// );

// router.patch(
//     "/buyer/:offerId/:rejected",
//     //   checkAuthMiddleware.checkAuth,
//     OfferController.acceptOrRejectByBuyer
// );

// router.patch(
//     "/counter-offer/:offerId/:price",
//     //   checkAuthMiddleware.checkAuth,
//     OfferController.counterOfferBySeller
// );


module.exports = router;
