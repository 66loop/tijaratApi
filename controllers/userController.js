const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
            };

            const schema = {
              firstName: { type: "string", optional: false },
              lastName: { type: "string", optional: false },
              country: { type: "string", optional: false },
              city: { type: "string", optional: false },
              email: { type: "string", optional: false },
              password: { type: "string", optional: false },
              userStatusId: { type: "number", optional: true },
            };

            validateResponse(res, user, schema);

            User.create(user)
              .then((result) => {
                res.status(201).json({
                  message: "User Created Successfully",
                  post: result,
                });
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
  console.log("user", user);

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
