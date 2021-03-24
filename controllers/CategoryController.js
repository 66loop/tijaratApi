const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const category = require("../models/Category");

/********************categorys List*******************/
exports.getAllcategories = function (req, res, next) {
  category
    .find()
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(201).json({ message: "category Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Get category By Id*******************/
exports.getcategoryById = function (req, res, next) {
  const id = req.params.categoryId;

  category
    .findByPk(id)
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(201).json({ message: "category Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Update category*******************/
exports.updatecategory = function (req, res, next) {
  const id = req.params.categoryId;
  const updatedcategory = {
    name: req.body.name,
  };

  const schema = {
    name: { type: "string", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(updatedcategory, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  category
    .update(updatedcategory, { where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "category Updated",
          category: result,
        });
      } else {
        res.status(201).json({ message: "category Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Delete category*******************/
exports.deletecategory = function (req, res, next) {
  const id = req.params.categoryId;

  category
    .destroy({ where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "category Deleted",
          category: result,
        });
      } else {
        res.status(201).json({ message: "category Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Create category*******************/
exports.createcategory = function (req, res, next) {
  const createdcategory = {
    name: req.body.name,
  };

  const schema = {
    name: { type: "string", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(createdcategory, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  category
    .create(createdcategory)
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "category created",
          category: result,
        });
      } else {
        res.status(201).json({ message: "category Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};
