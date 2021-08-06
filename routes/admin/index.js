var express = require("express");
var router = express.Router();
var userRoutes = require('./user')
var app = express()

/* GET users listing. */
// router.get("/test", (req, res, next) => {
//     console.log("test api for admin")
//     res.send("its done");
// });
app.use('/user', userRoutes)

module.exports = app;
