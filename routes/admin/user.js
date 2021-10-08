var express = require("express");
var router = express.Router();
var userController = require('../../controllers/admin/userConteroller')


/* GET users list. */
router.get("/", userController.getUsers);

router.get("/sellers", userController.getSellers);

router.put("/:userId", userController.updateUser);

router.get("/:userId", userController.getUserById);

router.put("/verify-seller/:sellerId/:status", userController.updateSellerVerfication);



module.exports = router;
