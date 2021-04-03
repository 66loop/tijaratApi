const Seller = require("../models/Seller");
const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
/********************Registering a Seller*******************/
exports.register = (user) => {
  if (user._id) {
    const newUser = { firstName: user.firstName, lastName: user.lastName, country: user.country, city: user.city, email: user.email, password: user.password };
    user = newUser;
  }
  return new Promise((resolve, reject) => {
    Seller.create(user)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.checkIfSellerExists = (user) => {
  return new Promise((resolve, reject) => {
    Seller.findOne({ email: user.email })
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/********************User Login*******************/

exports.sellerLogin = async function (req, res) {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const schema = {
    email: { type: "string", optional: false },
    password: { type: "string", optional: false },
  };

  validateResponse(res, user, schema);

  Seller.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {
        bcryptjs.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user.userId,
                },
                "secret",
                function (err, token) {
                  res.status(200).json({
                    message: "Authentication successful",
                    token: token,
                    sellerId: user._id
                  });
                }
              );
            }
             else {
              res.status(401).json({
                message: "Invalid Credentials",
              });
            }
          }
        );
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Updating a Seller*******************/
exports.updateSeller = (seller) => {
  return new Promise((resolve, reject) => {
    Seller.updateOne({ email: seller.email }, seller.updatedProps)
      .then((result) => {
        resolve()
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function validateResponse(res, postJson, schema) {
  const v = new validator();
  const validateResponse = v.validate(postJson, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }
}