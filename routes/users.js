var express = require('express');
var router = express.Router();
let userController = require('../controllers/userController');
const checkAuthMiddleware = require('../middleware/check-auth');

/*Authentication*/
router.post('/register', userController.register);
router.post('/login', userController.login);
/* GET users listing. */
router.get('/list', checkAuthMiddleware.checkAuth, userController.getAllUsers);
router.get('/:userId', checkAuthMiddleware.checkAuth, userController.getUserById);
router.patch('/update/:userId', checkAuthMiddleware.checkAuth, userController.updateUser);
router.delete('/delete/:userId', checkAuthMiddleware.checkAuth, userController.deleteUser);


module.exports = router;
