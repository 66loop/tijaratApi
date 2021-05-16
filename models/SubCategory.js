var mongoose = require("mongoose");

var subCategorySchema = mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
});

var SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
