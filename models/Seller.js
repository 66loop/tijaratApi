var mongoose = require("mongoose");

var SellerSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  country: String,
  city: String,
  facebookId: String,
  googleId: String
});

var Seller = mongoose.model("Seller", SellerSchema);

module.exports = Seller;
