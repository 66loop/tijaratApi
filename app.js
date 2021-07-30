var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var categoriesRouter = require("./routes/categories");
var sellerRouter = require("./routes/seller");
var orderRouter = require("./routes/order");
var buyerRouter = require("./routes/buyer");
var offerRouter = require("./routes/offer");
var cartRouter = require("./routes/cart");
const securityQuestionsRouter = require('./routes/securityQuestions');
var OrderController = require("./controllers/OrderController");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cors = require('cors')
var app = express();
const cron = require('node-cron');

// multer upload
// app.use(upload.array());

// view engine setup
app.use(cors())
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let pathShouldBe = path.resolve(__dirname, 'public');
console.log(pathShouldBe, "pathShouldBe")
app.use(express.static(pathShouldBe));
// app.use(upload.array()); 

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/seller", sellerRouter);
app.use("/buyer", buyerRouter);
app.use("/order", orderRouter);
app.use("/security", securityQuestionsRouter);
app.use("/offer", offerRouter);
app.use("/cart", cartRouter);
app.use("/test", (req, res, next) => {
  res.send("Success");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
const uri =
  "mongodb+srv://umar:U25121998u@cluster0.7otkr.mongodb.net/practiceNode?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(console.log("MongoDB Connected"))
  .catch((error) => console.log(error.message));

cron.schedule('* * * * *', async () => {
  console.log('----------------------')
  await OrderController.sendEmailForReview();
}, {
  scheduled: true
});

cron.schedule('0 * * * *', async () => {
  console.log('-----expiring offers----')
  await OrderController.sendEmailForReview();
}, {
  scheduled: true
});
module.exports = app;
