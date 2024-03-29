var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
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
  securityQuestions: { type: Array },
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: { type: Number },
    sum: { type: Number }
  }],
  status: {type: String, default: 'active'},
  type: { type: String , default: 'user' }
}, {timestamps: true});

var User = mongoose.model("User", userSchema);

module.exports = User;
