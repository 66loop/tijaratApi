var mongoose = require("mongoose");

var subCategorySchema = mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: String
}, { timestamps: true });

var SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
