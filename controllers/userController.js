const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const buyerController = require('./BuyerController');
const sellerController = require('./SellerController');
const fetch = require('node-fetch');
const common = require('../helper/common')

/********************Registering a User*******************/
exports.register = function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "Email already Exists",
        });
      } else {
        bcryptjs.genSalt(10, function (err, salt) {
          bcryptjs.hash(req.body.password, salt, function (err, hash) {
            const user = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              country: req.body.country,
              city: req.body.city,
              email: req.body.email,
              password: hash,
              userStatusId: req.body.userStatusId,
              registeringAs: req.body.registeringAs,
            };

            const schema = {
              firstName: { type: "string", optional: false },
              lastName: { type: "string", optional: false },
              country: { type: "string", optional: false },
              city: { type: "string", optional: false },
              email: { type: "string", optional: false },
              password: { type: "string", optional: false },
              userStatusId: { type: "number", optional: true },
              registeringAs: { type: "string", optional: false },
            };

            validateResponse(res, user, schema);

            User.create(user)
              .then((result) => {

                if (user.registeringAs === 'user' || user.registeringAs === 'buyer') {
                  buyerController.register(user)
                    .then(() => {
                      res.status(201).json({
                        message: "User Created Successfully",
                        post: result,
                      });
                    });
                }

                if (user.registeringAs === 'seller') {

                  buyerController.checkIfBuyerExists(user)
                    .then((resultUpper) => {

                      let promises = []
                      if (resultUpper) {

                        promises.push(sellerController.register(user));

                      }
                      else {
                        promises.push(sellerController.register(user));
                        promises.push(buyerController.register(user));
                      }

                      Promise.all(promises)
                        .then((resultLower => {
                          res.status(201).json({
                            message: "User Created Successfully",
                            post: result,
                          });
                        }))
                        .catch(error => {
                          res.status(500).json({
                            message: "Something went wrong",
                            error: error,
                          });
                        });


                    })
                    .catch((err) => {
                    })

                }
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Something went wrong",
                  error: error,
                });
              });
          });
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

/********************Registering a User as a seller*******************/
exports.registerUserAsSeller = function (req, res, next) {
  User.findOne({ email: req.userData.email })
    .then((result) => {
      if (result) {
        sellerController.register(result).then(seller => {
          res.status(201).json({
            message: "Seller Created Successfully",
            post: seller,
          });
        }).
          catch(err => {
            res.status(500).json({
              message: "Something went wrong",
              error: err,
            });
          })
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

exports.socialSignin = async (req, res, next) => {
  try {
    console.log("wint in")
    const { accessToken, userID, userType } = req.body;
    console.log(accessToken, userID, 'this is req param');
    let dataToBeStored = {};

    const urlForFb = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,hometown&access_token=${accessToken}`;

    fetch(urlForFb, {
      method: 'GET'
    })
      .then((resc) => resc.json())
      .then(async (response) => {
        const fullName = response.name.split(' ');
        dataToBeStored = {
          facebookId: userID,
          firstName: fullName[0],
          lastName: fullName[1],
          email: response.email ? response.email : await common.generateRandomUserName(fullName[0]) + "@gmail.com",
          country: 'Pakistan',
          city: 'Lahore'
        };

        User.findOne({ $and: [{ facebookId: userID }, { facebookId: { $exists: true } }] })
          .then(foundUser => {
            if (foundUser) {
              const token = jwt.sign(
                {
                  email: foundUser.email,
                  userId: foundUser._id,
                },
                "secret",
                function (err, token) {
                  res.status(200).json({
                    message: "Authentication successful",
                    token: token,
                    userid: foundUser._id
                  });
                }
              );
            }
            else {
              User.create(dataToBeStored)
                .then((result) => {

                  if (userType === 'user' || userType === 'buyer' || userType === undefined || userType === '') {
                    buyerController.register(dataToBeStored)
                      .then(() => {
                        res.status(201).json({
                          message: "User Created Successfully",
                          user: result,
                        });
                      });
                  }

                  if (userType === 'seller') {

                    buyerController.checkIfBuyerExists(dataToBeStored)
                      .then((resultUpper) => {

                        let promises = []
                        if (resultUpper) {

                          promises.push(sellerController.register(dataToBeStored));

                        }
                        else {
                          promises.push(sellerController.register(dataToBeStored));
                          promises.push(buyerController.register(dataToBeStored));
                        }

                        Promise.all(promises)
                          .then((resultLower => {
                            res.status(201).json({
                              message: "User Created Successfully",
                              post: result,
                            });
                          }))
                          .catch(error => {
                            res.status(500).json({
                              message: "Something went wrong",
                              error: error,
                            });
                          });


                      })
                      .catch((err) => {
                      })

                  }
                })
                .catch((error) => {
                  res.status(500).json({
                    message: "Something went wrong",
                    error: error,
                  });
                });
            }
          })
      })
      .catch(err => {
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
      });
  }
  catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.toString(),
    });
  };

};

/********************User Login*******************/

exports.login = async function (req, res) {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const schema = {
    email: { type: "string", optional: false },
    password: { type: "string", optional: false },
  };

  validateResponse(res, user, schema);

  User.findOne({ email: req.body.email })
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
                    userid: user._id
                  });
                }
              );
            }
            //  else {
            //   res.status(401).json({
            //     message: "Invalid Credentials",
            //   });
            // }
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

/********************Users List*******************/
exports.getAllUsers = function (req, res, next) {
  User.find()
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(201).json({ message: "User Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Get User By Id*******************/
exports.getUserById = function (req, res, next) {
  const id = req.params.userId;

  User.findById(id)
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(201).json({ message: "User Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Update User*******************/
exports.updateUser = function (req, res, next) {
  const id = req.params.userId;
  const updatedUser = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    country: req.body.country,
    city: req.body.city,
    email: req.body.email,
    password: req.body.password,
    userStatusId: req.body.userStatus,
  };

  const schema = {
    firstName: { type: "string", optional: false },
    lastName: { type: "string", optional: false },
    country: { type: "number", optional: false },
    city: { type: "number", optional: false },
    email: { type: "string", optional: false },
    password: { type: "string", optional: false },
    userStatusId: { type: "number", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(updatedUser, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  User.update(updatedUser, { where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "User Updated",
          user: result,
        });
      } else {
        res.status(201).json({ message: "User Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Delete User*******************/
exports.deleteUser = function (req, res, next) {
  const id = req.params.userId;

  User.destroy({ where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "User Deleted",
          user: result,
        });
      } else {
        res.status(201).json({ message: "User Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};
