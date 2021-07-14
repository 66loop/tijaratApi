const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const product = require("../models/Product");
const bucketurl = require("../config/BucketUrl");
const categories = require("../controllers/CategoryController");
var mongoose = require("mongoose");

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

/********************products List*******************/
exports.searchProduct = function (req, res, next) {
  product
    .find({})
    .populate('serllerId category subCategory')
    .then((result) => {
      if (result) {
        let searchText = req.query.search;

        let arrayToSend = result.filter(x => x.name.includes(searchText) || x.shortDetails.includes(searchText) || x.description.includes(searchText) || x.category.name.includes(searchText) || x.subCategory.name.includes(searchText))

        arrayToSend = arrayToSend.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        res.status(201).json(arrayToSend);

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

/********************products List*******************/
exports.advanceSearchProduct = function (req, res, next) {
  let queryObject = { '$and': [] };
  console.log(req.query, 'req');
  const { txt, city, priceTo, priceFrom, category, condition } = req.query;

  if (txt) {
    queryObject.$and.push({ '$text': { '$search': txt } });
  }

  if (city) {
    queryObject.$and.push({ 'cities': { $in: city } });
  }

  if (priceFrom && priceTo) {
    queryObject.$and.push({ 'price': { $gte: priceFrom, $lte: priceTo } });
  }
  else if (priceFrom) {
    queryObject.$and.push({ 'price': { $gte: priceFrom } });
  }
  else if (priceTo) {
    queryObject.$and.push({ 'price': { $lte: priceTo } });
  }

  if (condition) {
    queryObject.$and.push({ 'condition': condition });
  }

  if (category) {
    queryObject.$and.push({ 'category': mongoose.Types.ObjectId(category) });

  }


  product
    .find(queryObject)
    .populate('serllerId category subCategory')
    .then((result) => {
      if (result) {

        res.status(201).json(result);

      } else {
        res.status(201).json({ message: "products Not Found" });
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
    subCategory: req.body.subCategory,
    cities: req.body.cities,
    applyMakeAnOffer: req.body.applyMakeAnOffer || false,
  };


  let images = [];

  if (req.files) {
    for (let index = 0; index < req.files.length; index++) {
      images.push(`${bucketurl}/images/${req.files[index].filename}`);
    }

    updatedproduct.pictures = images;
  }

  if (req.body.images) {
    // console.log(req.body.images, 'imagesssss');
    // console.log(typeof req.body.images, 'imagesssss');
    let pastImages = JSON.parse(req.body.images)
    console.log(pastImages, 'pastImages');

    // for (let index = 0; index < pastImages.length; index++) {
    //     updatedproduct.pictures.push(pastImages[index]);
    // }
    updatedproduct.pictures.push(...pastImages);
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
      console.log('result', result)
      if (result.n) {
        product
          .findById(id)
          .populate('serllerId')
          .then((resultInner) => {
            res.status(201).json(resultInner);
          })
          .catch((error) => {
            console.log('error', error)
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
    subCategory: req.body.subCategory,
    cities: req.body.cities,
    applyMakeAnOffer: req.body.applyMakeAnOffer || false,
  };
  let images = [];

  for (let index = 0; index < req.files.length; index++) {
    images.push(`${bucketurl}/images/${req.files[index].filename}`);
  }

  createdproduct.pictures = images;

  console.log('hittttttttt', req.files)
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

/********************Update product status*******************/
exports.updateproductToInActive = function (req, res, next) {
  const id = req.params.productId;
  const updatedproduct = {
    isActive: req.body.isActive,
  };

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

/********************Update product status*******************/
exports.addReview = async function (req, res, next) {

  try {
    for (let index = 0; index < req.body.reviews.length; index++) {
      const element = req.body.reviews[index];
      let dbproduct = await product.findOne({ _id: element.product });
      if (dbproduct) {
        let totalRating = 0;
        if (dbproduct.reviews.length > 0) {
          totalRating = (((dbproduct.reviews.map(item => item.rating).reduce((prev, next) => prev + next)) + element.rating) / (dbproduct.reviews.length + 1)).toFixed(1);
        }
        else {
          totalRating = element.rating;
        }
        let totalReviews = [...dbproduct.reviews, element.review];

        await product.updateOne({ _id: dbproduct._id }, { reviews: totalReviews, rating: totalRating })
      }
    }
    res.status(200).json("reviews added to product");

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.toString(),
    });
  }
};

exports.homeScreen = async function (req, res) {
  let newItems = [];
  let categoriesFound = [];
  let subCategories = [];
  let recommendedItems = [];
  console.log(typeof req.params.category, 'category');
  console.log(req.params.subcategory, 'sub-category');

  try {
    newItems = await product.find({ new: true });
    categoriesFound = await categories.categories();
    subCategories = await categories.subCategories();
    if (req.params.category !== "undefined" && req.params.subcategory !== "undefined") {
      recommendedItems = await product.find({ $and: [{ category: req.params.category }, { subCategory: req.params.subcategory }] });
    }
    else if (req.params.category !== "undefined") {
      recommendedItems = await product.find({ category: req.params.category });

    }
    else if (req.params.subcategory !== "undefined" ) {
      recommendedItems = await product.find({ subCategory: req.params.subcategory });

    }
    else {
      recommendedItems = newItems;
    }

    return res.status(200).json({ message: "reviews added to product", data: { new: newItems, categories: categoriesFound, subCategories: subCategories, recommendedItems } });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.toString(),
    });
  }




}


