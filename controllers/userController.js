const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const buyerController = require('./BuyerController');
const sellerController = require('./SellerController');
const fetch = require('node-fetch');
const common = require('../helper/common');
const nodemailer = require("nodemailer");
const bucketurl = require("../config/BucketUrl");
const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");

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
              registeringAs: { type: "string", optional: true },
            };

            validateResponse(res, user, schema);

            User.create(user)
              .then(async (result) => {
                let token = await jwt.sign(
                  {
                    email: user.email,
                    userId: user.userId,
                  },
                  "secret");

                console.log(token, "before a")

                const newResult = {
                  _id: result._id,
                  firstName: result.firstName,
                  lastName: result.lastName,
                  country: result.country,
                  city: result.city,
                  email: result.email,
                  password: result.password,
                  token,
                  seller: result.registeredAsSeller
                }

                const allUserProps = { user: newResult }


                console.log(newResult, "after a");

                if (user.registeringAs === 'user' || user.registeringAs === 'buyer' || user.registeringAs === undefined) {
                  buyerController.register(user)
                    .then(async () => {
                      allUserProps["buyer"] = await Buyer.findOne({ email: user.email });

                      res.status(201).json({
                        message: "User Created Successfully",
                        post: newResult,
                        user: allUserProps
                      });
                    });
                }

                if (user.registeringAs === 'seller') {

                  buyerController.checkIfBuyerExists(user)
                    .then((resultUpper) => {

                      let promises = []
                      if (resultUpper) {

                        promises.push(sellerController.register({ user: user, shopImageUrl: req.body.shopImageUrl, shopName: req.body.shopName, deliveryDays: req.body.deliveryDays }));

                      }
                      else {
                        promises.push(sellerController.register({ user: user, shopImageUrl: req.body.shopImageUrl, shopName: req.body.shopName, deliveryDays: req.body.deliveryDays }));

                        promises.push(buyerController.register(user));
                      }

                      Promise.all(promises)
                        .then((async resultLower => {
                          updateUserAndBuyerIfRegisteredAsSeller(newResult.email, { registeredAsSeller: true });
                          updateUserAndBuyerIfRegisteredAsSeller(newResult.email, { registeredAsSeller: true }, "buyer");
                          allUserProps["seller"] = await Seller.findOne({ email: user.email });
                          allUserProps["buyer"] = await Buyer.findOne({ email: user.email });

                          res.status(201).json({
                            message: "User Created Successfully",
                            post: newResult,
                            user: allUserProps
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

  const user = {
    shopName: req.body.shopName,
    deliveryDays: req.body.deliveryDays
  }

  if (req.file || req.files) {
    user["shopImageUrl"] = `${bucketurl}/images/${req.files[0].filename}`;
  }

  const schema = {
    shopName: { type: "string", optional: false },
    deliveryDays: { type: "number", optional: true },
  }

  const result = validateResponse(res, user, schema);

  if (result === true) {

    User.findOne({ email: req.userData.email })
      .then(async (result) => {
        if (result) {
          sellerController.checkIfSellerExists(result)
            .then(async sellerFound => {

              if (!sellerFound) {
                sellerController.register({ user: result, ...user }).then(async seller => {
                  console.log(seller, 'seller');
                  updateUserAndBuyerIfRegisteredAsSeller(req.userData.email, { registeredAsSeller: true });
                  updateUserAndBuyerIfRegisteredAsSeller(req.userData.email, { registeredAsSeller: true }, "buyer");

                  let token = await jwt.sign(
                    {
                      email: seller.email,
                      userId: seller.userId,
                    },
                    "secret");

                  console.log(seller, "before a")

                  const allUserProps = { user: seller }

                  const newResult = {
                    _id: seller._id,
                    firstName: seller.firstName,
                    lastName: seller.lastName,
                    country: seller.country,
                    city: seller.city,
                    email: seller.email,
                    password: seller.password,
                    token,
                  }
                  allUserProps["buyer"] = await Buyer.findOne({ email: req.userData.email });

                  // allUserProps["seller"] = await Seller.findOne({ email: req.userData.email });


                  res.status(201).json({
                    message: "Seller Created Successfully",
                    post: newResult,
                    user: allUserProps
                  });
                }).
                  catch(err => {
                    res.status(500).json({
                      message: "Something went wrong",
                      error: err,
                    });
                  })
              }
              else {
                res.status(401).json({
                  message: "User already exists as seller"
                });
              }
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

};

/********************Social Signin with facebook*******************/
exports.socialSignin = async (req, res, next) => {
  try {
    const { accessToken, userID, userType } = req.body;
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
                async function (err, token) {
                  let allUserProps = { user: user };
                  allUserProps["buyer"] = await Buyer.findOne({ email: req.body.email });
                  if (user.registeredAsSeller) {
                    const seller = await Seller.findOne({ email: req.body.email });
                    allUserProps["seller"] = seller;
                  }

                  if (allUserProps.user.securityQuestions.length > 0) {
                    let sq = [];
                    for (let index = 0; index < allUserProps.user.securityQuestions.length; index++) {
                      const element = allUserProps.user.securityQuestions[index];
                      let newObj = {
                        question: element.question
                      };
                      sq.push(newObj);
                    }
                    allUserProps.user.securityQuestions = sq;

                  }
                  res.status(200).json({
                    message: "Authentication successful",
                    token: token,
                    userid: user._id,
                    seller: user.registeredAsSeller,
                    user: allUserProps
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
  else {
    return true;
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

// Get seller

exports.getSellerById = function (req, res, next) {
  const id = req.params.sellerId;

  Seller.findById(id)
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
exports.updateUser = async function (req, res, next) {
  const id = req.params.userId;
  const updatedUser = {
    name: req.body.firstName + req.body.lastName,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    country: req.body.country,
    city: req.body.city
  };

  const schema = {
    firstName: { type: "string", optional: false },
    lastName: { type: "string", optional: false },
    country: { type: "string", optional: false },
    city: { type: "string", optional: false },
    email: { type: "string", optional: false },
    name: { type: "string", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(updatedUser, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  try {

    await User.updateOne({ _id: id }, updatedUser);
    await Buyer.updateOne({email: updatedUser.email}, updatedUser);
    await Seller.updateOne({email: updatedUser.email}, updatedUser);

    res.status(201).json({
      message: "User Updated"
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
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

/********************Change Password*******************/
exports.changePassword = function (req, res, next) {
  try {
    console.log(req.userData.email, 'email');
    const userRequest = {
      email: req.userData.email,
      oldPassword: req.body.oldPassword,
      password: req.body.password,

    };

    const schema = {
      email: { type: "string", optional: false },
      oldPassword: { type: "string", optional: false },
      password: { type: "string", optional: false },
    };

    validateResponse(res, userRequest, schema);

    User.findOne({ email: req.userData.email })
      .then(async (user) => {
        if (user && await bcryptjs.compareSync(req.body.oldPassword, user.password)) {
          const updatedPassword = bcryptjs.hashSync(req.body.password, 10);
          User.updateOne({ _id: user._id }, { password: updatedPassword })
            .then(async (result) => {
              if (result) {

                if (user.registeredAsSeller) {
                  await buyerController.updateBuyer({ email: req.userData.email, updatedProps: { password: updatedPassword } })
                }
                await sellerController.updateSeller({ email: req.userData.email, updatedProps: { password: updatedPassword } })

                res.status(201).json({ message: "Password updated successfully." });

              } else {
                res.status(201).json({ message: "User Not Found" });
              }
            })
            .catch((error) => {
              res.status(500).json({
                message: "Something went wrong",
                error: error.toString(),
              });
            });
        } else {
          res.status(401).json({
            message: "Old password is wrong"
          });
        }
      })
      .catch(err => {
        res.status(401).json({
          message: "User not found",
          error: err.toString(),
        });
      });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.toString(),
    });
  }
};

/********************Forgot Password*******************/

exports.forgotPassword = function (req, res) {
  const user = {
    email: req.body.email,
  };

  const schema = {
    email: { type: "string", optional: false },
  };

  validateResponse(res, user, schema);

  User.findOne({ email: req.body.email })
    .then(async (user) => {
      if (user === null) {
        res.status(401).json({
          message: "User Doesn't Exist",
        });
      } else {
        const newPassword = common.generateRandomString(8);
        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        User.updateOne({ _id: user._id }, { password: hashedPassword })
          .then((result) => {
            if (result) {
              sellerController.updateSeller({ email: req.body.email, updatedProps: { password: hashedPassword } })
                .then(sellerUpdated => {

                  buyerController.updateBuyer({ email: req.body.email, updatedProps: { password: hashedPassword } })
                    .then(buyerUpdated => {

                    })
                })
            } else {
              res.status(201).json({ message: "User Not Found" });
            }
            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                user: 'hassantest4096@gmail.com', // generated ethereal user
                pass: 'hassanTEST123', // generated ethereal password
              },
            });

            transporter.sendMail({
              from: '"Tijarat Support 👻" <forgot-password>', // sender address
              to: req.body.email, // list of receivers
              subject: "Your new password for tijarat ✔", // Subject line
              html: `<p>Your new password has been generated which is : ${newPassword}. if you want to change your password please do that.</p>`, // html body
            })
              .then(mailSent => {
                res.status(201).json({
                  message: "Email has been sent"
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: "Something went wrong",
                  error: err.toString(),
                });
              })
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

/********************Forgot Password*******************/
exports.uploadImage = function (req, res) {
  res.status(201).json({
    message: "Image uploaded succesfully.",
    imageUrl: `${bucketurl}/images/${req.files[0].filename}`
  });
};

const updateUserAndBuyerIfRegisteredAsSeller = async (email, updateProps, from = "user") => {

  let promisesOfUpdates = [
    User.updateOne({ email: email }, updateProps)
  ];

  if (from == 'buyer') {
    promisesOfUpdates.push(Buyer.updateOne({ email: email }, updateProps))
  }

  Promise.all(promisesOfUpdates)
    .then(() => "Updated.")
    .catch(error => error.toString());

};

/********************Update User*******************/
exports.addOrUpdateSQ = function (req, res, next) {
  const id = req.params.userId;
  const updatedUser = {
    securityQuestions: req.body.securityQuestions,
  };

  User.updateOne({ _id: id }, updatedUser)
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

