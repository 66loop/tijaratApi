var express = require("express");
var router = express.Router();
var CartController = require("../controllers/CartController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
    "/:userId",
    //   checkAuthMiddleware.checkAuth,
    CartController.addToCart
);

router.post(
    "/add-multiple/:userId",
    //   checkAuthMiddleware.checkAuth,
    CartController.addMultipleItemsToCart
);

router.post(
    "/remove-from-cart/:userId",
    //   checkAuthMiddleware.checkAuth,
    CartController.removeFromCart
);

router.post(
    "/decrement/:userId",
    //   checkAuthMiddleware.checkAuth,
    CartController.decrementProductCountFromCart
);

router.get(
    "/:userId",
    //   checkAuthMiddleware.checkAuth,
    CartController.getCart
);

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
