var mongoose = require("mongoose");

var categorySchema = mongoose.Schema({
  name: String,
  image: String
});

var Category = mongoose.model("Category", categorySchema);

module.exports = Category;
