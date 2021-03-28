const Seller = require("../models/Seller");

/********************Registering a Seller*******************/
exports.register = (user) => {
  if(user._id)
  {
    const newUser = {firstName: user.firstName, lastName: user.lastName, country: user.country, city: user.city, email: user.email, password: user.password};
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
