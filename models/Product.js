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
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  colors: [],
  size: [],
  tags: [],
  rating: Number,
  variants: [],
  serllerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  condition: String,
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: Array,
  cities: { type: Array },
  applyMakeAnOffer: { type: Boolean, default: false },
  deliveryDays: { type: Number }
});

var Product = mongoose.model("Product", productSchema);

module.exports = Product;
