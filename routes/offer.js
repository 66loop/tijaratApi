var express = require("express");
var router = express.Router();
var OfferController = require("../controllers/OfferController");
var checkAuthMiddleware = require("../middleware/check-auth");

router.post(
    "/",
    //   checkAuthMiddleware.checkAuth,
    OfferController.create
);

router.get(
    "/seller/:sellerId",
    //   checkAuthMiddleware.checkAuth,
    OfferController.getForSeller
);

router.get(
    "/:offerId",
    //   checkAuthMiddleware.checkAuth,
    OfferController.getOffer
);

router.patch(
    "/seller/:offerId/:rejected",
    //   checkAuthMiddleware.checkAuth,
    OfferController.acceptOrRejectBySeller
);

router.patch(
    "/buyer/:offerId/:rejected",
    //   checkAuthMiddleware.checkAuth,
    OfferController.acceptOrRejectByBuyer
);

router.patch(
    "/counter-offer/:offerId/:price",
    //   checkAuthMiddleware.checkAuth,
    OfferController.counterOfferBySeller
);


module.exports = router;
