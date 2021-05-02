const Seller = require("../models/Seller");
const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");

const updateSellerMethod = (seller) => {
  return new Promise((resolve, reject) => {
    Seller.updateOne({ email: seller.email }, seller.updatedProps)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        console.log(error, 'error');
        reject(error);
      });
  });
};
/********************Registering a Seller*******************/
exports.register = (user) => {
  const newUser = { firstName: user.user.firstName, lastName: user.user.lastName, country: user.user.country, city: user.user.city, email: user.user.email, password: user.user.password, shopImageUrl: user.shopImageUrl, shopName: user.shopName };
  user = newUser;
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

/********************Add payment method*******************/
exports.addPaymentMethod = async function (req, res) {
  let paymentMethod = {
    method: req.body.method,
    methodDisplayName: req.body.methodDisplayName
  };

  let schema = {
    method: { type: "string", optional: false },
    methodDisplayName: { type: "string", optional: false },
  };

  validateResponse(res, paymentMethod, schema);

  if (paymentMethod.method !== 'COD') {

    paymentMethod = {
      method: req.body.method,
      methodDisplayName: req.body.methodDisplayName,
      phoneNumber: req.body.phoneNumber,
      accountTitle: req.body.accountTitle,
    };

    schema = {
      method: { type: "string", optional: false },
      methodDisplayName: { type: "string", optional: false },
      phoneNumber: { type: "string", optional: false },
      accountTitle: { type: "string", optional: false },
    };

    validateResponse(res, paymentMethod, schema);

  }

  let paymentMethodExistsBefore = await Seller.findOne({ $and: [{ 'paymentMethods': { $exists: true } }, { email: req.userData.email }] })

  console.log(paymentMethodExistsBefore.paymentMethods.length, "payment method");

  if (paymentMethodExistsBefore.paymentMethods.length < 1) {
    console.log("within iff");
    await updateSellerMethod({ email: req.userData.email, updatedProps: { primaryPaymentMethod: paymentMethod } })
  }

  Seller.findOne({ $and: [{ 'paymentMethods.method': req.body.method }, { email: req.userData.email }] })
    .then((user) => {
      if (user === null) {
        updateSellerMethod({ email: req.userData.email, updatedProps: { $push: { paymentMethods: paymentMethod } } })
          .then(result => {
            console.log(result, 'result')
            if (result.nModified) {
              res.status(200).json({
                message: "Payment method added successfully"
              });
            }
            else {
              return res.status(500).json({
                message: "Something went wrong please try again"
              });
            }
          })
      } else {
        return res.status(400).json({
          message: "Payment method already exists",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************remove payment method*******************/
exports.removePaymentMethod = async function (req, res) {
  let paymentMethod = {
    method: req.params.method
  };

  let schema = {
    method: { type: "string", optional: false },
  };

  validateResponse(res, paymentMethod, schema);


  let paymentMethodExistsBefore = await Seller.findOne({ $and: [{ 'primaryPaymentMethod.method': paymentMethod.method }, { email: req.userData.email }] })

  if (paymentMethodExistsBefore && paymentMethodExistsBefore.primaryPaymentMethod.method === paymentMethod.method) {
    if (paymentMethodExistsBefore.paymentMethods.length > 1) {
      let otherPaymentMethods = paymentMethodExistsBefore.paymentMethods.filter(x => x.method != paymentMethod.method);
      await Seller.updateOne({ email: req.userData.email }, { primaryPaymentMethod: otherPaymentMethods[0] })
    }
    else {
      await Seller.updateOne({ email: req.userData.email }, { primaryPaymentMethod: {} })
    }

  }


  Seller.updateOne({ email: req.userData.email }, { $pull: { 'paymentMethods': { method: paymentMethod.method } } })
    .then(result => {
      console.log(result, 'result')
      if (result.nModified) {
        res.status(200).json({
          message: "Payment method removed successfully"
        });
      }
      else {
        return res.status(500).json({
          message: "Something went wrong please try again"
        });
      }
    })
    .catch(error => {
      return res.status(500).json({
        message: "Something went wrong please try again",
        error: error.toString()
      });
    });
};

/********************update payment method*******************/
exports.updateAPaymentMethod = async function (req, res) {
  let paymentMethod = {
    method: req.body.method,
    methodDisplayName: req.body.methodDisplayName
  };

  let schema = {
    method: { type: "string", optional: false },
    methodDisplayName: { type: "string", optional: false },
  };

  validateResponse(res, paymentMethod, schema);

  if (paymentMethod.method !== 'COD') {

    paymentMethod = {
      method: req.body.method,
      methodDisplayName: req.body.methodDisplayName,
      phoneNumber: req.body.phoneNumber,
      accountTitle: req.body.accountTitle,
    };

    schema = {
      method: { type: "string", optional: false },
      methodDisplayName: { type: "string", optional: false },
      phoneNumber: { type: "string", optional: false },
      accountTitle: { type: "string", optional: false },
    };

    validateResponse(res, paymentMethod, schema);

  }


  let paymentMethodExistsBefore = await Seller.findOne({ $and: [{ 'primaryPaymentMethod.method': paymentMethod.method }, { email: req.userData.email }] })

  if (paymentMethodExistsBefore && paymentMethodExistsBefore.primaryPaymentMethod.method === paymentMethod.method) {
    await Seller.updateOne({ email: req.userData.email }, { primaryPaymentMethod: paymentMethod })
  }


  Seller.updateOne({ email: req.userData.email, 'paymentMethods.method': paymentMethod.method }, { 'paymentMethods.$': paymentMethod })
    .then(result => {
      console.log(result, 'result')
      if (result.nModified) {
        res.status(200).json({
          message: "Payment method updated successfully"
        });
      }
      else {
        return res.status(500).json({
          message: "Something went wrong please try again"
        });
      }
    })
    .catch(error => {
      return res.status(500).json({
        message: "Something went wrong please try again",
        error: error.toString()
      });
    });
};

/********************mark payment method as primary*******************/
exports.markPaymentMethodAsPrimary = async function (req, res) {
  let paymentMethod = {
    method: req.params.method
  };

  let schema = {
    method: { type: "string", optional: false }
  };

  validateResponse(res, paymentMethod, schema);

  let paymentMethodExistsBefore = await Seller.findOne({ email: req.userData.email });

  if (paymentMethodExistsBefore && paymentMethodExistsBefore.primaryPaymentMethod.method === paymentMethod.method) {
    return res.status(200).json({
      message: "This method is marked as primary already"
    });
  }

  let primaryMethodShouldBe = paymentMethodExistsBefore.paymentMethods.find(x => x.method === paymentMethod.method);

  if (primaryMethodShouldBe) {
    Seller.updateOne({ email: req.userData.email }, { 'primaryPaymentMethod': primaryMethodShouldBe })
      .then(result => {
        console.log(result, 'result')
        if (result.nModified) {
          res.status(200).json({
            message: "Payment method marked as primary successfully"
          });
        }
        else {
          return res.status(500).json({
            message: "Something went wrong please try again"
          });
        }
      })
      .catch(error => {
        return res.status(500).json({
          message: "Something went wrong please try again",
          error: error.toString()
        });
      });
  }
  else {
    return res.status(400).json({
      message: "This method doesn't exists in payment methods."
    });
  }


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