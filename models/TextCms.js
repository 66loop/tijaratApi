var mongoose = require("mongoose");

var textCmsSchema = mongoose.Schema({
  section: { type: String },
  values: [
    {
      key: { type: String },
      value: { type: String }
    }
  ],
  codeSnippet: {type: String}
}, {timestamps: true});

var TextCms = mongoose.model("TextCms", textCmsSchema);

module.exports = TextCms;