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
  registeredAsSeller: { type: Boolean, default: false },
  securityQuestions: { type: Array}
});

var User = mongoose.model("User", userSchema);

module.exports = User;
