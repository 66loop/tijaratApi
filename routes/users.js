var express = require('express');
var router = express.Router();
let userController = require('../controllers/userController');

/* GET users listing. */
router.get('/list', userController.getAllUsers);
router.post('/register', userController.register);
router.get('/:userId', userController.getUserById);
router.patch('/update/:userId', userController.updateUser);
router.delete('/delete/:userId', userController.deleteUser);
module.exports = router;
