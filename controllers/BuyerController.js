const Buyer = require("../models/Buyer");

/********************Registering a Buyer*******************/
exports.register = (user) => {
  return new Promise((resolve, reject) => {
    Buyer.create(user)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.checkIfBuyerExists = (user) => {
  return new Promise((resolve, reject) => {
    Buyer.findOne({ email: user.email })
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/********************Updating a Buyer*******************/
exports.updateBuyer = (buyer) => {
  return new Promise((resolve, reject) => {
    Buyer.updateOne({ email: buyer.email }, buyer.updatedProps)
      .then((result) => {
        resolve()
      })
      .catch((error) => {
        reject(error);
      });
  });
};
