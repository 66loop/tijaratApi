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
  googleId: String,
  shopImageUrl: String,
  shopName: String,
  primaryPaymentMethod: {
    type: mongoose.Schema.Types.Mixed
  },
  paymentMethods: [
    {
      type: mongoose.Schema.Types.Mixed
    }
  ],
  deliveryDays: Number,
  rating: { type: Number, default: 0 },
  reviews: Array
}, {timestamps: true});

var Seller = mongoose.model("Seller", SellerSchema);

module.exports = Seller;
