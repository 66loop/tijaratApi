const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const product = require("../models/Product");
const bucketurl = require("../config/BucketUrl")
/********************products List*******************/
exports.getAllproducts = function (req, res, next) {
  product
    .find()
    .populate('serllerId category subCategory')
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

/********************products List filtered by seller*******************/
exports.getAllproductsOfSeller = function (req, res, next) {
  product
    .find({ serllerId: req.params.sellerid })
    .populate('serllerId category subCategory')
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
    .populate('serllerId category subCategory')
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
    serllerId: req.body.serllerId,
    condition: req.body.condition,
    category: req.body.category,
    subCategory: req.body.subCategory
  };


  let images = [];

  if (req.files) {
    for (let index = 0; index < req.files.length; index++) {
      images.push(`${bucketurl}/images/${req.files[index].filename}`);
    }

    updatedproduct.pictures = images;
  }

  if (req.body.images) {
    updatedproduct.pictures.push(...req.body.images);
  }

  console.log(updatedproduct.pictures, 'updated product');

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
    serllerId: { type: "string", optional: false },
    condition: { type: "string", optional: true },
    category: { type: "string", optional: false },
    subCategory: { type: "string", optional: false },
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
    .updateOne({ _id: id }, updatedproduct)
    .then((result) => {
      if (result.nModified) {
        product
          .findById(id)
          .populate('serllerId')
          .then((resultInner) => {
            res.status(201).json(resultInner);
          })
          .catch((error) => {
            res.status(500).json({
              message: "Something went wrong",
              error: error,
            });
          });
      } else {
        res.status(500).json({ message: "Something went wrong" });
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

  product.deleteOne({ _id: id })
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
    rating: req.body.rating,
    tags: req.body.tags,
    serllerId: req.body.serllerId,
    condition: req.body.condition,
    category: req.body.category,
    subCategory: req.body.subCategory
  };
  let images = [];

  for (let index = 0; index < req.files.length; index++) {
    images.push(`${bucketurl}/images/${req.files[index].filename}`);
  }

  createdproduct.pictures = images;

  console.log('hittttttttt', typeof req.body.category)
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
    tags: { type: "string", optional: true },
    // pictures:{ type: "string", optional: false }
    serllerId: { type: "string", optional: false },
    condition: { type: "string", optional: true },
    category: { type: "string", optional: false },
    subCategory: { type: "string", optional: false },
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
