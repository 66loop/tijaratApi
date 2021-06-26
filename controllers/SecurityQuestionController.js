const SecurityQuestion = require("../models/SecurityQuestion");


/********************receive feedback of Buyer*******************/
exports.securityQuestion = async function (req, res) {

  SecurityQuestion.find()
    .then((result) => {
      res.status(200).json({ message: "Security questions fetched", data: result });
    })
    .catch((error) => {
      res.status(500).json({ message: "Something went wrong", error: error.toString() });
    });
};
