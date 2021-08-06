var express = require("express");
var router = express.Router();
var userRoutes = require('./user')
var productRoutes = require('./product')
var app = express()

/* GET users listing. */
// router.get("/test", (req, res, next) => {
//     console.log("test api for admin")
//     res.send("its done");
// });
app.use('/user', userRoutes)
app.use('/product', productRoutes)

module.exports = app;
