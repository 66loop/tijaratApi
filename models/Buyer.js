var mongoose = require("mongoose");

var BuyerSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  country: String,
  city: String,
  facebookId: String,
  googleId: String,
  registeredAsSeller: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: Array
});

var Buyer = mongoose.model("Buyer", BuyerSchema);

module.exports = Buyer;
