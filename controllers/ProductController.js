const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const product = require("../models/Product");
const bucketurl = require("../config/BucketUrl")
/********************products List*******************/
exports.getAllproducts = function (req, res, next) {
  product
    .find()
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(201).json({ message: "product Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Get product By Id*******************/
exports.getproductById = function (req, res, next) {
  const id = req.params.productId;

  product
    .findById(id)
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(201).json({ message: "product Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Update product*******************/
exports.updateproduct = function (req, res, next) {
  const id = req.params.productId;
  const updatedproduct = {
    name: req.body.name,
    price: req.body.price,
    salePrice: req.body.salePrice,
    discount: req.body.discount,
    shortDetails: req.body.shortDetails,
    description: req.body.description,
    stock: req.body.stock,
    new: req.body.new,
    sale: req.body.sale,
    category: req.body.category,
    rating: req.body.rating,
  };

  const schema = {
    name: { type: "string", optional: false },
    price: { type: "number", optional: false },
    salePrice: { type: "number", optional: false },
    discount: "number",
    shortDetails: { type: "string", optional: false },
    description: { type: "string", optional: false },
    stock: { type: "number", optional: false },
    new: { type: "boolean", optional: false },
    sale: { type: "boolean", optional: false },
    category: { type: "string", optional: false },
    rating: { type: "number", optional: false },
  };

  const v = new validator();
  const validateResponse = v.validate(updatedproduct, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  product
    .update(updatedproduct, { where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "product Updated",
          product: result,
        });
      } else {
        res.status(201).json({ message: "product Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Delete product*******************/
exports.deleteproduct = function (req, res, next) {
  const id = req.params.productId;

  product
    .destroy({ where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "product Deleted",
          product: result,
        });
      } else {
        res.status(201).json({ message: "product Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};

/********************Create product*******************/
exports.createproduct = function (req, res, next) {
  const createdproduct = {
    name: req.body.name,
    price: req.body.price,
    salePrice: req.body.salePrice,
    discount: req.body.discount,
    shortDetails: req.body.shortDetails,
    description: req.body.description,
    stock: req.body.stock,
    new: req.body.new,
    sale: req.body.sale,
    category: req.body.category,
    rating: req.body.rating,
    tags:req.body.tags,
    pictures: `${bucketurl}/public/images/${req.files[0].filename}`
  };

console.log('hittttttttt', req.body)
  const schema = {
    name: { type: "string", optional: false },
    price: { type: "string", optional: false },
    salePrice: { type: "string", optional: false },
    discount: "string",
    shortDetails: { type: "string", optional: false },
    description: { type: "string", optional: false },
    stock: { type: "string", optional: false },
    new: { type: "string", optional: false },
    sale: { type: "string", optional: false },
    category: { type: "string", optional: false },
    rating: { type: "string", optional: false },
    // pictures:{ type: "string", optional: false }
  };

  const v = new validator();
  const validateResponse = v.validate(createdproduct, schema);

  if (validateResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validateResponse,
    });
  }

  product
    .create(createdproduct)
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: "product created",
          product: result,
        });
      } else {
        res.status(201).json({ message: "product Not Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
};
