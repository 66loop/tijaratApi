const jwt = require('jsonwebtoken');

exports.checkAuth = function (req, res, next){
    try {
        const token = req.headers.authorization.split(" ")[1]; //Bearer @$~#234#@@@
        const decodedToken = jwt.verify(token, 'secret');
        req.userData = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or Expired Token",
            error: error
        });
    }
}