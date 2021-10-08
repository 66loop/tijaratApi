var mongoose = require("mongoose");

var globalsSchema = mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

var Globals = mongoose.model("Globals", globalsSchema);

module.exports = Globals;
