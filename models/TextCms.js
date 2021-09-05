var mongoose = require("mongoose");

var textCmsSchema = mongoose.Schema({
  section: { type: String },
  key: { type: String },
  value: { type: String }
}, {timestamps: true});

var TextCms = mongoose.model("TextCms", textCmsSchema);

module.exports = TextCms;