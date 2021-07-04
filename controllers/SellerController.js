const Seller = require("../models/Seller");
const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const bucketurl = require("../config/BucketUrl");
const fs = require('fs');
const parse = require('csv-parse');
var path = require("path");
const csv = require('@fast-csv/parse');
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");




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
  const newUser = { firstName: user.user.firstName, lastName: user.user.lastName, country: user.user.country, city: user.user.city, email: user.user.email, password: user.user.password, shopImageUrl: user.shopImageUrl, shopName: user.shopName, deliveryDays: user.deliveryDays };
  user = newUser;
  user.primaryPaymentMethod = {
    "method": "COD",
    "methodDisplayName": "Cash on delivery"
  };
  user.paymentMethods = [
    {
      "method": "COD",
      "methodDisplayName": "Cash on delivery"
    }
  ];
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

/********************mark payment method as primary*******************/
exports.bulkUpload = async function (req, res) {

  let data = [];

  try {
    // let images = [];
    // if (req.files) {
    //   for (let index = req.files.length; index <= req.files.length; index++) {
    //     images.push(`${bucketurl}/images/${req.files[index].filename}`);
    //   }
    // }

    var jsonPath = path.join(__dirname, '..', 'public', 'images', req.files[req.files.length - 1].filename);

    console.log(jsonPath, 'path');

    //var jsonString = fs.readFileSync(jsonPath, 'utf8');

    await fs.createReadStream(jsonPath)
      .pipe(csv.parse())
      .on('error', error => console.error(error))
      .on('data', row => {
        data.push(row)
      })
      .on('end', async rowCount => {

        let parsedArray = [];
        for (let index = 1; index < data.length; index++) {
          const element = data[index];
          let formattedObject = {};

          for (let pindex = 0; pindex < element.length; pindex++) {

            const innerElement = element[pindex];
            if (data[0][pindex] == 'category') {

              let category = await Category.findOne({ name: innerElement });

              formattedObject[data[0][pindex]] = category._id;

            }

            else if (data[0][pindex] === 'isActive') {

              formattedObject[data[0][pindex]] = innerElement === "1";

            }

            else if (data[0][pindex] === 'sale') {

              formattedObject[data[0][pindex]] = innerElement === "1";

            }

            else if (data[0][pindex] === 'subCategory') {
              let subCategory = await SubCategory.findOne({ name: innerElement })
              formattedObject[data[0][pindex]] = subCategory._id

            }
            else {
              formattedObject[data[0][pindex]] = innerElement

            }

          }

          formattedObject.serllerId = req.body.sellerId;
          formattedObject.new = formattedObject.condition === "New";

          parsedArray.push(formattedObject)
        }

        await Product.insertMany(parsedArray);
        res.status(200).json({
          message: "File uploaded successfully.",
          files: parsedArray

        });
      });


    // fs.readFileSync(jsonPath, 'utf8', function (err, fileData) {
    //   console.log(fileData, 'data');

    //   res.status(200).json({
    //     message: "File uploaded successfully.",
    //     files: fileData,
    //     jsonString

    //   });

    // })
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong please try again",
      error: error.toString()
    });
  }




};

/********************receive feedback of Buyer*******************/
exports.receiveFeedback = async function (req, res) {
  const { sellerId, review } = req.body;
  console.log(sellerId, 'buyer Id');
  Seller.findOne({ _id: sellerId })
    .then((result) => {
      if (result) {
        let totalRating = 0;
        if (result.reviews.length > 0) {
          totalRating = (((result.reviews.map(item => item.rating).reduce((prev, next) => prev + next)) + review.rating) / (result.reviews.length + 1)).toFixed(1);
        }
        else {
          totalRating = review.rating;
        }
        let totalReviews = [...result.reviews, review];
        Seller.updateOne({ _id: sellerId }, { reviews: totalReviews, rating: totalRating })
          .then((SellerUpdated) => {
            res.status(200).json({ message: "Review added" });
          })
          .catch((error) => {
            res.status(500).json({ message: "Something went wrong", error: error.toString() });
          });
      }
      else {
        res.status(201).json({ message: "Seller Not Found" });
      }

    })
    .catch((error) => {
      res.status(500).json({ message: "Something went wrong", error: error.toString() });
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