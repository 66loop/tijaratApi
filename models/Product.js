var mongoose = require("mongoose");

var productSchema = mongoose.Schema({
  name: String,
  price: Number,
  salePrice: Number,
  discount: Number,
  pictures: [],
  shortDetails: String,
  description: String,
  stock: Number,
  new: Boolean,
  sale: Boolean,
  category: String,
  colors: [],
  size: [],
  tags: [],
  rating: Number,
  variants: [],
});

var Product = mongoose.model("Product", productSchema);

module.exports = Product;
