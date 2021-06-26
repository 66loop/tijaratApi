var mongoose = require("mongoose");

var SecurityQuestionSchema = mongoose.Schema({
  question: String,
});

var SecurityQuestion = mongoose.model("SecurityQuestion", SecurityQuestionSchema);

module.exports = SecurityQuestion;
