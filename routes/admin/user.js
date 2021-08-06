var express = require("express");
var router = express.Router();
var userController = require('../../controllers/admin/userConteroller')


/* GET users list. */
router.get("/", async (req, res, next) => {
    try {
        res.send(await userController.getUsers())
    } catch (error) {
        next(error)
    }
});

router.put("/:userId", async (req, res, next) => {
    try {
        res.send(await userController.updateUser( req.params.userId, req.body))
    } catch (error) {
        next(error)
    }
});

router.get("/:userId", async (req, res, next) => {
    try {
        res.send(await userController.getUserById( req.params.userId ))
    } catch (error) {
        next(error)
    }
});

module.exports = router;
