var express = require("express");
var router = express.Router();
var userController = require('../../controllers/admin/userConteroller')


/* GET users list. */
router.get("/", userController.getUsers);

router.put("/:userId", userController.updateUser);

router.get("/:userId", userController.getUserById);

module.exports = router;
