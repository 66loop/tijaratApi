var mongoose = require("mongoose");

var advertisementSchema = mongoose.Schema({
  for: { type: String },
  description: { type: String },
  codeSnippet: {type: String}
}, {timestamps: true});

var Advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = Advertisement;
