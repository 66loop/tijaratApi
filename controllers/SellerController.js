const Seller = require("../models/Seller");

/********************Registering a Seller*******************/
exports.register = (user) => {
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
