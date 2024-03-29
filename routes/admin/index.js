var express = require("express");
var router = express.Router();
var userRoutes = require('./user')
var productRoutes = require('./product')
var categoryRoutes = require('./categary')
var subCategoryRoutes = require('./subCategory')
var authRoutes = require('./auth')
var advertisement = require('./advertisement')
var textCms = require('./textCms')
var app = express()

/* GET users listing. */
// router.get("/test", (req, res, next) => {
//     console.log("test api for admin")
//     res.send("its done");
// });
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/product', productRoutes)
app.use('/category', categoryRoutes)
app.use('/sub-category', subCategoryRoutes)
app.use('/advertisement', advertisement)
app.use('/text-cms', textCms)

module.exports = app;
