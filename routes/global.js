var express = require("express");
var router = express.Router();
var GlobalsController = require("../controllers/GlobalsController");
var checkAuthMiddleware = require("../middleware/check-auth");


router.get(
  "/get-all/",
  // checkAuthMiddleware.checkAuth,
  GlobalsController.getGlobals
);

router.get(
  "/get-by-Id/:id",
  // checkAuthMiddleware.checkAuth,
  GlobalsController.getGlobalsById
);

router.get(
  "/get-by-key/:id",
  // checkAuthMiddleware.checkAuth,
  GlobalsController.getGlobalsByKey
);

router.post(
  "/",
  // checkAuthMiddleware.checkAuth,
  GlobalsController.addGlobal
);

router.patch(
  "/:id",
  // checkAuthMiddleware.checkAuth,
  GlobalsController.updateGlobals
);

router.delete(
  "/:id",
  // checkAuthMiddleware.checkAuth,
  GlobalsController.deleteGlobal
);


module.exports = router;
